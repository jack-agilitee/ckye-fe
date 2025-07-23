import { NextResponse } from 'next/server';

// Mock workspace data
const mockWorkspaces = [
  {
    id: 1,
    name: 'Americal Eagle',
    description: 'American Eagle Outfitters workspace',
    userCount: 9,
    createdAt: '2024-01-15T10:00:00Z',
    status: 'active'
  },
  {
    id: 2,
    name: 'Dollar General',
    description: 'Dollar General Corporation workspace',
    userCount: 2,
    createdAt: '2024-01-20T14:30:00Z',
    status: 'active'
  },
  {
    id: 3,
    name: 'Agilitee',
    description: 'Agilitee internal workspace',
    userCount: 3,
    createdAt: '2024-01-10T09:00:00Z',
    status: 'active'
  }
];

// GET /api/workspaces
export async function GET() {
  try {
    // Return all workspaces without filtering or pagination
    return NextResponse.json({
      data: mockWorkspaces
    });
  } catch {
    // Handle errors appropriately
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}

// Mock users data to simulate user lookup
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', avatar: null },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', avatar: null },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', avatar: null },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', avatar: null },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', avatar: null },
  { id: '6', name: 'Eve Martin', email: 'eve@example.com', avatar: null },
  { id: '7', name: 'Frank Thompson', email: 'frank@example.com', avatar: null },
  { id: '8', name: 'Grace Lee', email: 'grace@example.com', avatar: null },
  { id: '9', name: 'Henry Williams', email: 'henry@example.com', avatar: null },
  { id: '10', name: 'Iris Johnson', email: 'iris@example.com', avatar: null },
];

// POST /api/workspaces
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    if (!body.name) {
      return NextResponse.json(
        { error: 'Workspace name is required' },
        { status: 400 }
      );
    }
    
    // Create new workspace (mock implementation)
    const newWorkspace = {
      id: mockWorkspaces.length + 1,
      name: body.name,
      description: body.description || '',
      userCount: users.length,
      users: body.userIds, // Include full user objects
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // In a real implementation, you would save to database here
    mockWorkspaces.push(newWorkspace);
    
    // Return created resource
    return NextResponse.json(newWorkspace, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
}