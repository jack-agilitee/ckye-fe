import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/workspaces/[id]
export async function GET(_, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Fetch workspace with user count
    const workspace = await prisma.workspace.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        shortName: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { userWorkspaces: true }
        },
        userWorkspaces: {
          select: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                seatType: true,
                status: true
              }
            },
            role: true
          }
        }
      }
    });

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }

    // Transform the data
    const transformedWorkspace = {
      id: workspace.id,
      name: workspace.name,
      shortName: workspace.shortName,
      status: workspace.status,
      userCount: workspace._count.userWorkspaces,
      users: workspace.userWorkspaces.map(uw => ({
        ...uw.user,
        role: uw.role
      })),
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt
    };

    return NextResponse.json({
      data: transformedWorkspace
    });
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspace' },
      { status: 500 }
    );
  }
}