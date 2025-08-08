import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/variants
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const workspaceId = searchParams.get('workspaceId');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where = {};
    
    // Filter by workspaceId if provided
    if (workspaceId) {
      where.workspaceId = workspaceId;
    }
    
    // Search in content and summary
    if (search) {
      where.OR = [
        { content: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Execute query with pagination
    const [variants, total] = await prisma.$transaction([
      prisma.variant.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          content: true,
          summary: true,
          workspaceId: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.variant.count({ where })
    ]);

    return NextResponse.json({
      data: variants,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    );
  }
}