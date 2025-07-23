import { NextResponse } from 'next/server';

// Mock data for development - replace with actual database
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

// GET /api/pages?company=companyName
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company');
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company parameter is required' },
        { status: 400 }
      );
    }
    
    // Filter pages by company
    const companyPages = mockPages.filter(page => 
      page.company.toLowerCase() === company.toLowerCase()
    );
    
    return NextResponse.json({
      data: companyPages,
      meta: {
        total: companyPages.length,
        company: company
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/pages
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.company) {
      return NextResponse.json(
        { error: 'Name and company are required' },
        { status: 400 }
      );
    }
    
    // Create new page
    const newPage = {
      id: (mockPages.length + 1).toString(),
      name: body.name,
      content: body.content || '',
      company: body.company,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockPages.push(newPage);
    
    return NextResponse.json(newPage, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}