import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/user-workspace
// Add an existing user to a workspace
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

    const body = await request.json();

    // Validate input
    if (!body.userId || !body.workspaceId) {
      return NextResponse.json(
        { error: 'userId and workspaceId are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: body.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if workspace exists
    const workspace = await prisma.workspace.findUnique({
      where: { id: body.workspaceId }
    });

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Check if relationship already exists
    const existingRelation = await prisma.userWorkspace.findUnique({
      where: {
        userId_workspaceId: {
          userId: body.userId,
          workspaceId: body.workspaceId
        }
      }
    });

    if (existingRelation) {
      return NextResponse.json(
        { error: 'User is already in this workspace' },
        { status: 409 }
      );
    }

    // Create the user-workspace relationship
    const userWorkspace = await prisma.userWorkspace.create({
      data: {
        userId: body.userId,
        workspaceId: body.workspaceId,
        role: body.role || 'member'
      }
    });

    return NextResponse.json(userWorkspace, { status: 201 });
  } catch (error) {
    console.error('Error adding user to workspace:', error);
    return NextResponse.json(
      { error: 'Failed to add user to workspace' },
      { status: 500 }
    );
  }
}

// DELETE /api/user-workspace
// Remove a user from a workspace
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.userId || !body.workspaceId) {
      return NextResponse.json(
        { error: 'userId and workspaceId are required' },
        { status: 400 }
      );
    }

    // Delete the user-workspace relationship
    const deletedRelation = await prisma.userWorkspace.delete({
      where: {
        userId_workspaceId: {
          userId: body.userId,
          workspaceId: body.workspaceId
        }
      }
    });

    return NextResponse.json({
      message: 'User removed from workspace successfully',
      data: deletedRelation
    });
  } catch (error) {
    console.error('Error removing user from workspace:', error);
    return NextResponse.json(
      { error: 'Failed to remove user from workspace' },
      { status: 500 }
    );
  }
}