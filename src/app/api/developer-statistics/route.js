import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

// GET /api/developer-statistics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'mergedDate';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Validate workspaceId is provided
    if (!workspaceId) {
      return NextResponse.json(
        { error: 'workspaceId parameter is required' },
        { status: 400 }
      );
    }

    // Build where clause
    const where = {
      workspaceId
    };

    // Execute query with pagination
    const [stats, total] = await prisma.$transaction([
      prisma.developerStats.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          user: true,
          workspaceId: true,
          prNumber: true,
          mergedDate: true,
          estimatedTime: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.developerStats.count({ where })
    ]);

    return NextResponse.json({
      data: stats,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        workspaceId
      }
    });
  } catch (error) {
    console.error('Error fetching developer statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developer statistics' },
      { status: 500 }
    );
  }
}

// POST /api/developer-statistics
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.user) {
      return NextResponse.json(
        { error: 'User (GitHub username) is required' },
        { status: 400 }
      );
    }

    if (!body.workspaceId) {
      return NextResponse.json(
        { error: 'Workspace ID is required' },
        { status: 400 }
      );
    }

    if (!body.prNumber || typeof body.prNumber !== 'number') {
      return NextResponse.json(
        { error: 'PR number is required and must be a number' },
        { status: 400 }
      );
    }

    if (!body.mergedDate) {
      return NextResponse.json(
        { error: 'Merged date is required' },
        { status: 400 }
      );
    }

    // Convert mergedDate to DateTime if it's a string
    const mergedDate = new Date(body.mergedDate);
    if (isNaN(mergedDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid merged date format' },
        { status: 400 }
      );
    }

    // Validate estimatedTime if provided (now accepts string or number)
    if (body.estimatedTime !== undefined && body.estimatedTime !== null) {
      // Convert to string if it's a number
      body.estimatedTime = String(body.estimatedTime);
    }

    const stat = await prisma.developerStats.create({
      data: {
        user: body.user,
        workspaceId: body.workspaceId,
        prNumber: body.prNumber,
        mergedDate,
        estimatedTime: body.estimatedTime ? String(body.estimatedTime) : null
      },
      select: {
        id: true,
        user: true,
        workspaceId: true,
        prNumber: true,
        mergedDate: true,
        estimatedTime: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(stat, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A developer stat with these unique fields already exists' },
          { status: 409 }
        );
      }
    }
    console.error('Error creating developer statistics:', error);
    return NextResponse.json(
      { error: 'Failed to create developer statistics' },
      { status: 500 }
    );
  }
}