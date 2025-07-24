import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

// GET /api/users
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
    // Return all users with their workspaces through the join table
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        userWorkspaces: {
          select: {
            workspace: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform the data to flatten workspaces array
    const transformedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      userType: user.userType,
      avatar: user.avatar,
      workspaces: user.userWorkspaces.map(uw => uw.workspace.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    return NextResponse.json({
      data: transformedUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users
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
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        userType: body.userType || 'Member',
        avatar: body.avatar || body.name.charAt(0).toUpperCase()
      },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    // If workspace IDs are provided, create associations
    if (body.workspaceIds && Array.isArray(body.workspaceIds) && body.workspaceIds.length > 0) {
      await prisma.userWorkspace.createMany({
        data: body.workspaceIds.map(workspaceId => ({
          userId: user.id,
          workspaceId: workspaceId,
          role: body.userType === 'Admin' ? 'admin' : 'member'
        }))
      });
    }
    
    // Fetch the user with workspaces
    const userWithWorkspaces = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        userWorkspaces: {
          select: {
            workspace: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    
    // Transform response
    const responseData = {
      id: userWithWorkspaces.id,
      email: userWithWorkspaces.email,
      name: userWithWorkspaces.name,
      userType: userWithWorkspaces.userType,
      avatar: userWithWorkspaces.avatar,
      workspaces: userWithWorkspaces.userWorkspaces.map(uw => uw.workspace.name),
      createdAt: userWithWorkspaces.createdAt,
      updatedAt: userWithWorkspaces.updatedAt
    };
    
    // Return created resource
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        );
      }
    }
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}