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
        workspaceName: true,
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

// PATCH /api/variants/:id
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content } = body;

    if (!content && content !== '') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const variant = await prisma.variant.update({
      where: { id },
      data: { 
        content,
        updatedAt: new Date()
      },
      select: {
        id: true,
        content: true,
        summary: true,
        workspaceName: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(variant);
  } catch (error) {
    console.error(`Error updating variant ${params.id}:`, error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update variant' },
      { status: 500 }
    );
  }
}