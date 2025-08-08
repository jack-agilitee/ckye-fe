import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

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

    return NextResponse.json({
      data: experiments
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
        createdBy: body.createdBy || null
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