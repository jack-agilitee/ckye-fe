import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/variants/set-to-master
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.variantId || !body.company) {
      return NextResponse.json(
        { error: 'variantId and company are required' },
        { status: 400 }
      );
    }

    // Get the variant
    const variant = await prisma.variant.findUnique({
      where: { id: body.variantId },
      select: {
        id: true,
        content: true,
        summary: true,
        workspaceName: true
      }
    });

    if (!variant) {
      return NextResponse.json(
        { error: 'Variant not found' },
        { status: 404 }
      );
    }

    // Extract the file name from the variant content or use body.pageName if provided
    let pageName = body.pageName || 'Claude.md'; // Default or provided name
    
    // If no pageName provided, try to extract from content
    if (!body.pageName) {
      const contentLines = variant.content.split('\n');
      const firstHeading = contentLines.find(line => line.trim().startsWith('#'));
      if (firstHeading) {
        // Extract text after # and clean it
        const match = firstHeading.match(/^#\s+(.+?)$/);
        if (match) {
          pageName = match[1].trim();
          // Clean up the name - remove .md if present and re-add it
          pageName = pageName.replace(/\.md$/i, '');
          // Ensure it ends with .md
          if (!pageName.toLowerCase().endsWith('.md')) {
            pageName += '.md';
          }
        }
      }
    }

    // Try to find existing page with case-insensitive search
    const existingPage = await prisma.page.findFirst({
      where: {
        company: {
          equals: body.company,
          mode: 'insensitive'
        },
        name: {
          equals: pageName,
          mode: 'insensitive'
        }
      }
    });

    let page;
    if (existingPage) {
      // Update existing page
      page = await prisma.page.update({
        where: { id: existingPage.id },
        data: {
          content: variant.content,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new page
      page = await prisma.page.create({
        data: {
          name: pageName,
          content: variant.content,
          company: body.company
        }
      });
    }

    // Delete the variant after successful page update/creation
    await prisma.variant.delete({
      where: { id: body.variantId }
    });

    return NextResponse.json({
      success: true,
      page: {
        id: page.id,
        name: page.name,
        company: page.company
      },
      message: existingPage ? 'Page updated and variant deleted' : 'Page created and variant deleted'
    });
  } catch (error) {
    console.error('Error setting variant to master:', error);
    return NextResponse.json(
      { error: 'Failed to set variant to master' },
      { status: 500 }
    );
  }
}