import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/by-email?email=user@example.com
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    // Get user with their workspaces
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        createdAt: true,
        updatedAt: true,
        userWorkspaces: {
          select: {
            workspace: {
              select: {
                id: true,
                name: true,
                shortName: true,
                // Get user count for each workspace
                _count: {
                  select: {
                    userWorkspaces: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform the data to include workspace user counts
    const transformedUser = {
      ...user,
      workspaces: user.userWorkspaces.map(uw => ({
        ...uw.workspace,
        userCount: uw.workspace._count.userWorkspaces
      })),
      userWorkspaces: undefined // Remove the intermediate join table data
    };

    return NextResponse.json({
      data: transformedUser
    });
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}