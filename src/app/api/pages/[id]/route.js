import { NextResponse } from 'next/server';

// Mock data - should match the data in ../route.js
// In production, this would be replaced with database access
let mockPages = [
  {
    id: '1',
    name: 'Claude.md',
    content: `# Claude.md

## Claude.md - Ionic/Angular/Capacitor Project

### Project Overview
This is an Ionic application built with Angular and Capacitor for cross-platform mobile development.

### Rules
Any time you do anything, check the commands.md file first to see if that command is found there. If you find something, use those instructions instead.
Then when you execute the task, always go into the aeo/ folder for any work to be done or anything git related.`,
    company: 'AEO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Commands.md',
    content: '# Commands\n\nList of available commands...',
    company: 'AEO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET /api/pages/:id
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const page = mockPages.find(p => p.id === id);
    
    if (!page) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PUT /api/pages/:id
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const pageIndex = mockPages.findIndex(p => p.id === id);
    
    if (pageIndex === -1) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    
    // Update page
    mockPages[pageIndex] = {
      ...mockPages[pageIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(mockPages[pageIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/:id
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const pageIndex = mockPages.findIndex(p => p.id === id);
    
    if (pageIndex === -1) {
      return NextResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    
    // Remove page
    mockPages.splice(pageIndex, 1);
    
    return NextResponse.json(
      { message: 'Page deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}