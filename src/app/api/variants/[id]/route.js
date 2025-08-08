import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/variants/:id
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const variant = await prisma.variant.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        summary: true,
        workspaceId: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(variant);
  } catch (error) {
    console.error(`Error fetching variant ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch variant' },
      { status: 500 }
    );
  }
}