import { NextResponse } from 'next/server';

// Mock user data based on Figma design
const mockUsers = [
  {
    id: 1,
    name: 'Andrew Vonn',
    email: 'andrew@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'A'
  },
  {
    id: 2,
    name: 'Eli Eljadi',
    email: 'eli@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle', 'Agilitee'],
    avatar: 'E'
  },
  {
    id: 3,
    name: 'Erin Ramos',
    email: 'erin@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'E'
  },
  {
    id: 4,
    name: 'Fadi',
    email: 'fadi@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'F'
  },
  {
    id: 5,
    name: 'Holland Bohr',
    email: 'holland@agilitee.com',
    userType: 'Member',
    workspaces: ['Dollar General'],
    avatar: 'H'
  },
  {
    id: 6,
    name: 'Jack Nichols',
    email: 'jack@agilitee.com',
    userType: 'Admin',
    workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee'],
    avatar: 'J'
  },
  {
    id: 7,
    name: 'James Otey',
    email: 'james@agilitee.com',
    userType: 'Admin',
    workspaces: ['Americal Eagle'],
    avatar: 'J'
  },
  {
    id: 8,
    name: 'JD McCulley',
    email: 'jd@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'J'
  },
  {
    id: 9,
    name: 'John Elliot',
    email: 'john@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'J'
  },
  {
    id: 10,
    name: 'Katelyn Thompson',
    email: 'katelyn@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'K'
  },
  {
    id: 11,
    name: 'Phil Stephenson',
    email: 'phil@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'P'
  }
];

// GET /api/users
export async function GET() {
  try {
    // Return all users without filtering or pagination
    return NextResponse.json({
      data: mockUsers
    });
  } catch {
    // Handle errors appropriately
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Create new user (mock implementation)
    const newUser = {
      id: mockUsers.length + 1,
      name: body.name,
      email: body.email,
      userType: body.userType || 'Member',
      workspaces: body.workspaces || [],
      avatar: body.name.charAt(0).toUpperCase()
    };
    
    // In a real implementation, you would save to database here
    mockUsers.push(newUser);
    
    // Return created resource
    return NextResponse.json(newUser, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}