import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';

// GET /api/pages?company=companyName
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company');
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company parameter is required' },
        { status: 400 }
      );
    }
    
     // Get all pages for the specified company
    const pages = await prisma.page.findMany({
      where: {
        company: {
          equals: company,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        content: true,
        company: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      data: pages
    });
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Server: Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/pages
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.company) {
      return NextResponse.json(
        { error: 'Name and company are required' },
        { status: 400 }
      );
    }
    
    let page;
    
    // Check if id is provided for update
    if (body.id) {
      // Update existing page
      page = await prisma.page.update({
        where: {
          id: body.id
        },
        data: {
          name: body.name,
          content: body.content || '',
          company: body.company,
          updatedAt: new Date()
        },
        select: {
          id: true,
          name: true,
          content: true,
          company: true,
          createdAt: true,
          updatedAt: true
        }
      });
    } else {
      // Create new page
      page = await prisma.page.create({
        data: {
          name: body.name,
          content: body.content || '',
          company: body.company
        },
        select: {
          id: true,
          name: true,
          content: true,
          company: true,
          createdAt: true,
          updatedAt: true
        }
      });
    }
    
    return NextResponse.json(page, { status: body.id ? 200 : 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Page not found' },
          { status: 404 }
        );
      }
    }
    console.error('Error creating/updating page:', error);
    return NextResponse.json(
      { error: 'Failed to create/update page' },
      { status: 500 }
    );
  }
}