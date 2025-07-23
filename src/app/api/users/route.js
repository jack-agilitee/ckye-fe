import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

// GET /api/users
export async function GET() {
  try {
    // Return all users without filtering or pagination
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        workspaces: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      data: users
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
        workspaces: body.workspaces || [],
        avatar: body.avatar || body.name.charAt(0).toUpperCase()
      },
      select: {
        id: true,
        email: true,
        name: true,
        userType: true,
        workspaces: true,
        avatar: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    // Return created resource
    return NextResponse.json(user, { status: 201 });
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