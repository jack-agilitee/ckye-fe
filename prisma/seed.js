import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const workspaces = [
  {
    name: 'Americal Eagle',
    shortName: 'AE',
    status: 'active'
  },
  {
    name: 'Dollar General',
    shortName: 'DG',
    status: 'active'
  },
  {
    name: 'Agilitee',
    shortName: 'AG',
    status: 'active'
  }
];

const users = [
  {
    name: 'Andrew Vonn',
    email: 'andrew@agilitee.com',
    userType: 'Member',
    avatar: 'A'
  },
  {
    name: 'Eli Eljadi',
    email: 'eli@agilitee.com',
    userType: 'Member',
    avatar: 'E'
  },
  {
    name: 'Erin Ramos',
    email: 'erin@agilitee.com',
    userType: 'Member',
    avatar: 'E'
  },
  {
    name: 'Fadi',
    email: 'fadi@agilitee.com',
    userType: 'Member',
    avatar: 'F'
  },
  {
    name: 'Holland Bohr',
    email: 'holland@agilitee.com',
    userType: 'Member',
    avatar: 'H'
  },
  {
    name: 'Jack Nichols',
    email: 'jack@agilitee.com',
    userType: 'Admin',
    avatar: 'J'
  },
  {
    name: 'James Otey',
    email: 'james@agilitee.com',
    userType: 'Admin',
    avatar: 'J'
  },
  {
    name: 'JD McCulley',
    email: 'jd@agilitee.com',
    userType: 'Member',
    avatar: 'J'
  },
  {
    name: 'John Elliot',
    email: 'john@agilitee.com',
    userType: 'Member',
    avatar: 'J'
  },
  {
    name: 'Katelyn Thompson',
    email: 'katelyn@agilitee.com',
    userType: 'Member',
    avatar: 'K'
  },
  {
    name: 'Phil Stephenson',
    email: 'phil@agilitee.com',
    userType: 'Member',
    avatar: 'P'
  }
];

// Mapping of user emails to workspace names
const userWorkspaceMap = {
  'andrew@agilitee.com': ['Americal Eagle'],
  'eli@agilitee.com': ['Americal Eagle', 'Agilitee'],
  'erin@agilitee.com': ['Americal Eagle'],
  'fadi@agilitee.com': ['Americal Eagle'],
  'holland@agilitee.com': ['Dollar General'],
  'jack@agilitee.com': ['Americal Eagle', 'Dollar General', 'Agilitee'],
  'james@agilitee.com': ['Americal Eagle'],
  'jd@agilitee.com': ['Americal Eagle'],
  'john@agilitee.com': ['Americal Eagle'],
  'katelyn@agilitee.com': ['Americal Eagle'],
  'phil@agilitee.com': ['Americal Eagle']
};

const pages = [
  {
    name: 'Claude.md',
    content: `# Claude.md

## Claude.md - Ionic/Angular/Capacitor Project

### Project Overview
This is an Ionic application built with Angular and Capacitor for cross-platform mobile development.

### Rules
Any time you do anything, check the commands.md file first to see if that command is found there. If you find something, use those instructions instead.
Then when you execute the task, always go into the aeo/ folder for any work to be done or anything git related.`,
    company: 'AEO'
  },
  {
    name: 'Commands.md',
    content: '# Commands\n\nList of available commands...',
    company: 'AEO'
  }
];

async function main() {
  console.log('Seeding database...');
  
  // Delete existing data
  await prisma.userWorkspace.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.page.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.suggestion.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();
  
  // Create workspaces
  const createdWorkspaces = {};
  for (const workspace of workspaces) {
    const created = await prisma.workspace.create({
      data: workspace
    });
    createdWorkspaces[workspace.name] = created.id;
    console.log(`Created workspace: ${workspace.name}`);
  }
  
  // Create users and their workspace associations
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: user
    });
    console.log(`Created user: ${user.name}`);
    
    // Create user-workspace associations
    const userWorkspaces = userWorkspaceMap[user.email] || [];
    for (const workspaceName of userWorkspaces) {
      const workspaceId = createdWorkspaces[workspaceName];
      if (workspaceId) {
        await prisma.userWorkspace.create({
          data: {
            userId: createdUser.id,
            workspaceId: workspaceId,
            role: user.userType === 'Admin' ? 'admin' : 'member'
          }
        });
        console.log(`  - Added to workspace: ${workspaceName}`);
      }
    }
  }
  
  // Create pages
  for (const page of pages) {
    await prisma.page.create({
      data: page
    });
    console.log(`Created page: ${page.name}`);
  }
  
  // Create sample variants for each workspace
  const variants = [
    {
      content: `# Project Guidelines for American Eagle

## Code Style
- Use functional components with React hooks
- Follow atomic design principles  
- Use SCSS modules with BEM methodology
- Implement proper error handling

## Best Practices
- Keep components small and reusable
- Use proper TypeScript types
- Write comprehensive tests
- Document all API endpoints

## Development Standards
- Follow ESLint rules
- Use Prettier for formatting
- Commit messages should follow conventional commits`,
      summary: 'Initial project guidelines with code style and best practices for AE',
      workspaceId: createdWorkspaces['Americal Eagle']
    },
    {
      content: `# Development Workflow for American Eagle

## Git Workflow
1. Create feature branches from main
2. Write descriptive commit messages
3. Create pull requests for review
4. Run tests before merging

## Code Review Process
- Check for code quality
- Verify test coverage
- Ensure documentation is updated
- Validate performance impact

## Deployment Process
- Stage changes in development
- Test in staging environment
- Deploy to production with approval`,
      summary: 'Development workflow including Git practices and deployment process for AE',
      workspaceId: createdWorkspaces['Americal Eagle']
    },
    {
      content: `# API Documentation for Dollar General

## RESTful Endpoints
- GET /api/products - List all products
- GET /api/products/:id - Get single product
- POST /api/products - Create new product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

## Authentication
All endpoints require Bearer token authentication

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per user`,
      summary: 'API documentation with RESTful endpoints and authentication for DG',
      workspaceId: createdWorkspaces['Dollar General']
    },
    {
      content: `# Testing Strategy for Dollar General

## Unit Testing
- Test individual components
- Mock external dependencies
- Achieve 80% code coverage

## Integration Testing
- Test API endpoints
- Verify database operations
- Test user workflows

## E2E Testing
- Test critical user journeys
- Verify cross-browser compatibility
- Mobile responsiveness testing`,
      summary: 'Comprehensive testing strategy covering unit, integration, and E2E tests for DG',
      workspaceId: createdWorkspaces['Dollar General']
    },
    {
      content: `# Performance Optimization for Agilitee

## Frontend Optimization
- Use React.memo for expensive components
- Implement lazy loading
- Optimize bundle size
- Use proper caching strategies

## Backend Optimization
- Implement database indexing
- Use query optimization
- Add response caching
- Monitor API performance

## CDN Strategy
- Static assets on CDN
- Image optimization
- Compression enabled`,
      summary: 'Performance optimization guidelines for frontend and backend at Agilitee',
      workspaceId: createdWorkspaces['Agilitee']
    },
    {
      content: `# Security Best Practices for Agilitee

## Input Validation
- Sanitize all user inputs
- Validate data types and formats
- Implement rate limiting
- Use parameterized queries

## Authentication & Authorization
- Use secure token storage
- Implement proper session management
- Apply principle of least privilege
- Regular security audits

## Data Protection
- Encrypt sensitive data
- HTTPS everywhere
- Regular backups`,
      summary: 'Security best practices for input validation and data protection at Agilitee',
      workspaceId: createdWorkspaces['Agilitee']
    }
  ];

  for (const variant of variants) {
    if (variant.workspaceId) {
      await prisma.variant.create({
        data: variant
      });
      console.log(`Created variant: ${variant.summary}`);
    }
  }

  // Create sample experiments
  const experiments = [
    {
      name: 'Homepage Redesign A/B Test',
      description: 'Testing new homepage layout with improved CTA placement',
      workspaceId: createdWorkspaces['Americal Eagle'],
      status: 'active',
      startDate: new Date('2025-08-01'),
      metrics: {
        targetMetric: 'conversion_rate',
        baseline: 3.5,
        target: 5.0
      }
    },
    {
      name: 'Checkout Flow Optimization',
      description: 'Testing simplified checkout process',
      workspaceId: createdWorkspaces['Americal Eagle'],
      status: 'completed',
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-07-31'),
      metrics: {
        targetMetric: 'checkout_completion',
        baseline: 65,
        target: 75,
        result: 72
      }
    },
    {
      name: 'Product Grid Layout Test',
      description: 'Testing different product grid layouts for better engagement',
      workspaceId: createdWorkspaces['Dollar General'],
      status: 'active',
      startDate: new Date('2025-08-05'),
      metrics: {
        targetMetric: 'click_through_rate',
        baseline: 12,
        target: 15
      }
    },
    {
      name: 'Mobile Navigation Experiment',
      description: 'Testing hamburger menu vs bottom navigation',
      workspaceId: createdWorkspaces['Agilitee'],
      status: 'inactive',
      metrics: {
        targetMetric: 'user_engagement',
        baseline: 45,
        target: 55
      }
    }
  ];

  for (const experiment of experiments) {
    if (experiment.workspaceId) {
      await prisma.experiment.create({
        data: experiment
      });
      console.log(`Created experiment: ${experiment.name}`);
    }
  }
  
  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });