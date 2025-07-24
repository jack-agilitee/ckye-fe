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
  await prisma.page.deleteMany();
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