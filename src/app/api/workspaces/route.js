import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

// GET /api/workspaces
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }
    // Return all workspaces with user count
    const workspaces = await prisma.workspace.findMany({
      select: {
        id: true,
        name: true,
        shortName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { userWorkspaces: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform the data to include userCount
    const transformedWorkspaces = workspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      shortName: workspace.shortName,
      status: workspace.status,
      userCount: workspace._count.userWorkspaces,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt
    }));

    return NextResponse.json({
      data: transformedWorkspaces
    });
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}

// POST /api/workspaces
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }
    // Parse request body
    const body = await request.json();
    
    // Validate input
    if (!body.name) {
      return NextResponse.json(
        { error: 'Workspace name is required' },
        { status: 400 }
      );
    }
    
    // Start a transaction to create workspace and add users
    const workspace = await prisma.$transaction(async (tx) => {
      // Create the workspace
      const newWorkspace = await tx.workspace.create({
        data: {
          name: body.name,
          shortName: body.shortName || null,
          status: body.status || 'active'
        }
      });

      // If userIds are provided, create UserWorkspace relations
      if (body.userIds && Array.isArray(body.userIds) && body.userIds.length > 0) {
        await tx.userWorkspace.createMany({
          data: body.userIds.map(userId => ({
            userId,
            workspaceId: newWorkspace.id,
            role: 'member'
          }))
        });
      }

      // Return the workspace with user count
      return await tx.workspace.findUnique({
        where: { id: newWorkspace.id },
        select: {
          id: true,
          name: true,
          shortName: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { userWorkspaces: true }
          }
        }
      });
    });

    // Transform the response
    const responseData = {
      id: workspace.id,
      name: workspace.name,
      shortName: workspace.shortName,
      status: workspace.status,
      userCount: workspace._count.userWorkspaces,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt
    };
    
    // Return created resource
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A workspace with this name already exists' },
          { status: 409 }
        );
      }
    }
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
}