import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

// GET /api/users
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const userTypes = searchParams.get('userTypes')?.split(',').filter(Boolean);
    const accountTypes = searchParams.get('accountTypes')?.split(',').filter(Boolean);
    const search = searchParams.get('search');

    // Build where clause for filtering
    const where = {};
    
    if (userTypes && userTypes.length > 0) {
      where.userType = { in: userTypes };
    }

    if (accountTypes && accountTypes.length > 0) {
      // For account types, we need to check if user is active/deactivated
      // Assuming active users have a non-null email and deactivated have a flag or specific pattern
      // Since we don't have an explicit status field, we'll need to add logic based on your schema
      // For now, we'll filter based on presence of email or a status field if it exists
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Return all users with their workspaces through the join table
    const users = await prisma.user.findMany({
      where,
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

// DELETE /api/users
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
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete user-workspace relationships first
    await prisma.userWorkspace.deleteMany({
      where: { userId: body.id }
    });

    // Delete the user
    const deletedUser = await prisma.user.delete({
      where: { id: body.id }
    });

    return NextResponse.json({ 
      message: 'User deleted successfully',
      data: deletedUser 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

// PATCH /api/users
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Extract only the fields we want to update
    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.userType !== undefined) updateData.userType = body.userType;

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: body.id },
      data: updateData,
      include: {
        userWorkspaces: {
          include: {
            workspace: true
          }
        }
      }
    });

    // Format the response
    const formattedUser = {
      ...updatedUser,
      workspaces: updatedUser.userWorkspaces.map(uw => uw.workspace.name)
    };
    delete formattedUser.userWorkspaces;

    return NextResponse.json({ data: formattedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}