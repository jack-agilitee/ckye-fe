import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      data: variants
    });
  } catch (error) {
    console.error('Error fetching variants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch variants' },
      { status: 500 }
    );
  }
}