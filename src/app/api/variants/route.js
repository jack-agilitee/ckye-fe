import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/variants
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceName = searchParams.get('workspaceName');

    // Build where clause
    const where = {};
    
    // Filter by workspaceName if provided
    if (workspaceName) {
      where.workspaceName = workspaceName;
    }

    // Execute query - get all variants, no pagination
    const variants = await prisma.variant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        summary: true,
        workspaceName: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Fetch user information for variants with createdBy
    const variantsWithUsers = await Promise.all(
      variants.map(async (variant) => {
        if (variant.createdBy) {
          const user = await prisma.user.findUnique({
            where: { id: variant.createdBy },
            select: { id: true, name: true, email: true }
          });
          return { ...variant, user };
        }
        return variant;
      })
    );

    return NextResponse.json({
      data: variantsWithUsers
    });
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    );
  }
}

// POST /api/variants - Create a new variant
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Get the current user from the session (for future use when createdBy is added)
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
    if (!body.content || !body.workspaceName) {
      return NextResponse.json(
        { error: 'content and workspaceName are required' },
        { status: 400 }
      );
    }

    // Create the variant
    const variant = await prisma.variant.create({
      data: {
        content: body.content,
        summary: body.summary || body.name || 'Untitled Variant',
        workspaceName: body.workspaceName,
        createdBy: userId
      },
      select: {
        id: true,
        content: true,
        summary: true,
        workspaceName: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(variant, { status: 201 });
  } catch (error) {
    console.error('Error creating variant:', error);
    return NextResponse.json(
      { error: 'Failed to create variant' },
      { status: 500 }
    );
  }
}