import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { pageId, commitCount } = body;

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    // Try to find the page or variant by ID
    let record = await prisma.page.findUnique({
      where: { id: pageId }
    });

    let isVariant = false;
    if (!record) {
      // If not found in pages, try variants
      record = await prisma.variant.findUnique({
        where: { id: pageId }
      });
      isVariant = true;
    }

    if (!record) {
      return NextResponse.json(
        { error: 'Page or variant not found' },
        { status: 404 }
      );
    }

    // Parse existing statistics or create new object
    let statistics = record.statistics || {
      totalPRs: 0,
      firstTrySuccess: 0,
      successRate: 0
    };

    // Update statistics
    statistics.totalPRs = (statistics.totalPRs || 0) + 1;
    
    // If commit count <= 2, consider it a first-try success
    if (commitCount <= 2) {
      statistics.firstTrySuccess = (statistics.firstTrySuccess || 0) + 1;
    }

    // Calculate success rate
    statistics.successRate = Math.round(
      (statistics.firstTrySuccess / statistics.totalPRs) * 100
    );

    // Update the record
    if (isVariant) {
      await prisma.variant.update({
        where: { id: pageId },
        data: { statistics }
      });
    } else {
      await prisma.page.update({
        where: { id: pageId },
        data: { statistics }
      });
    }

    return NextResponse.json({
      success: true,
      pageId,
      statistics,
      type: isVariant ? 'variant' : 'page'
    });

  } catch (error) {
    console.error('Error updating page statistics:', error);
    return NextResponse.json(
      { error: 'Failed to update page statistics' },
      { status: 500 }
    );
  }
}