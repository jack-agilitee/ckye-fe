import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/experiments - Get experiments filtered by workspaceName
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceName = searchParams.get('workspaceName');

    // Require workspaceName for filtering
    if (!workspaceName) {
      return NextResponse.json(
        { error: 'workspaceName is required' },
        { status: 400 }
      );
    }

    // Build where clause
    const where = {
      workspaceName
    };

    // Execute query - get all experiments, no pagination
    const experiments = await prisma.experiment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        pageId: true,
        variantId: true,
        workspaceName: true,
        status: true,
        startDate: true,
        endDate: true,
        metrics: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Fetch page, variant names, and user info for each experiment
    const experimentsWithNames = await Promise.all(
      experiments.map(async (experiment) => {
        let pageName = null;
        let variantName = null;
        let createdByUser = null;

        // Fetch page name if pageId exists
        if (experiment.pageId) {
          try {
            const page = await prisma.page.findUnique({
              where: { id: experiment.pageId },
              select: { name: true }
            });
            pageName = page?.name || null;
          } catch (error) {
            console.error(`Error fetching page ${experiment.pageId}:`, error);
          }
        }

        // Fetch variant name/summary if variantId exists
        if (experiment.variantId) {
          try {
            const variant = await prisma.variant.findUnique({
              where: { id: experiment.variantId },
              select: { summary: true }
            });
            variantName = variant?.summary || null;
          } catch (error) {
            console.error(`Error fetching variant ${experiment.variantId}:`, error);
          }
        }

        // Fetch user info if createdBy exists
        if (experiment.createdBy) {
          try {
            const user = await prisma.user.findUnique({
              where: { id: experiment.createdBy },
              select: { 
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            });
            createdByUser = user;
          } catch (error) {
            console.error(`Error fetching user ${experiment.createdBy}:`, error);
          }
        }

        return {
          ...experiment,
          pageName,
          variantName,
          createdByUser
        };
      })
    );

    return NextResponse.json({
      data: experimentsWithNames
    });
  } catch (error) {
    console.error('Error fetching experiments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiments' },
      { status: 500 }
    );
  }
}

// POST /api/experiments - Create a new experiment
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Get the current user from the session
    const session = await getServerSession(authOptions);
    let userId = null;
    
    if (session?.user?.email) {
      // Try to find the user in the database
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      userId = user?.id || null;
    }
    
    // Validate required fields
    if (!body.name || !body.workspaceName) {
      return NextResponse.json(
        { error: 'name and workspaceName are required' },
        { status: 400 }
      );
    }

    // Validate status if provided
    const validStatuses = ['active', 'inactive', 'completed'];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Create the experiment
    const experiment = await prisma.experiment.create({
      data: {
        name: body.name,
        description: body.description || null,
        pageId: body.pageId || null,
        variantId: body.variantId || null,
        workspaceName: body.workspaceName,
        status: body.status || 'inactive',
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        metrics: body.metrics || null,
        createdBy: userId || body.createdBy || null  // Use session user ID or fallback
      },
      select: {
        id: true,
        name: true,
        description: true,
        pageId: true,
        variantId: true,
        workspaceName: true,
        status: true,
        startDate: true,
        endDate: true,
        metrics: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(experiment, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'An experiment with this name already exists' },
          { status: 409 }
        );
      }
    }
    console.error('Error creating experiment:', error);
    return NextResponse.json(
      { error: 'Failed to create experiment' },
      { status: 500 }
    );
  }
}

// PATCH /api/experiments - Update experiment status (activate/deactivate)
export async function PATCH(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.id || !body.status) {
      return NextResponse.json(
        { error: 'id and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'completed'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Update the experiment status
    const updateData = {
      status: body.status,
      updatedAt: new Date()
    };

    // If activating, set startDate if not already set
    if (body.status === 'active' && !body.preserveDates) {
      const existing = await prisma.experiment.findUnique({
        where: { id: body.id },
        select: { startDate: true }
      });
      
      if (!existing) {
        return NextResponse.json(
          { error: 'Experiment not found' },
          { status: 404 }
        );
      }
      
      if (!existing.startDate) {
        updateData.startDate = new Date();
      }
    }

    // If completing, set endDate if not already set
    if (body.status === 'completed' && !body.preserveDates) {
      const existing = await prisma.experiment.findUnique({
        where: { id: body.id },
        select: { endDate: true }
      });
      
      if (!existing) {
        return NextResponse.json(
          { error: 'Experiment not found' },
          { status: 404 }
        );
      }
      
      if (!existing.endDate) {
        updateData.endDate = new Date();
      }
    }

    // Update metrics if provided
    if (body.metrics) {
      updateData.metrics = body.metrics;
    }

    // Perform the update
    const experiment = await prisma.experiment.update({
      where: { id: body.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        description: true,
        pageId: true,
        variantId: true,
        workspaceName: true,
        status: true,
        startDate: true,
        endDate: true,
        metrics: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(experiment);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Experiment not found' },
          { status: 404 }
        );
      }
    }
    console.error('Error updating experiment:', error);
    return NextResponse.json(
      { error: 'Failed to update experiment' },
      { status: 500 }
    );
  }
}