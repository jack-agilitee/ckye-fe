import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const users = [
  {
    name: 'Andrew Vonn',
    email: 'andrew@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'A'
  },
  {
    name: 'Eli Eljadi',
    email: 'eli@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle', 'Agilitee'],
    avatar: 'E'
  },
  {
    name: 'Erin Ramos',
    email: 'erin@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'E'
  },
  {
    name: 'Fadi',
    email: 'fadi@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'F'
  },
  {
    name: 'Holland Bohr',
    email: 'holland@agilitee.com',
    userType: 'Member',
    workspaces: ['Dollar General'],
    avatar: 'H'
  },
  {
    name: 'Jack Nichols',
    email: 'jack@agilitee.com',
    userType: 'Admin',
    workspaces: ['Americal Eagle', 'Dollar General', 'Agilitee'],
    avatar: 'J'
  },
  {
    name: 'James Otey',
    email: 'james@agilitee.com',
    userType: 'Admin',
    workspaces: ['Americal Eagle'],
    avatar: 'J'
  },
  {
    name: 'JD McCulley',
    email: 'jd@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'J'
  },
  {
    name: 'John Elliot',
    email: 'john@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'J'
  },
  {
    name: 'Katelyn Thompson',
    email: 'katelyn@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'K'
  },
  {
    name: 'Phil Stephenson',
    email: 'phil@agilitee.com',
    userType: 'Member',
    workspaces: ['Americal Eagle'],
    avatar: 'P'
  }
];

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
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();
  
  // Create users
  for (const user of users) {
    await prisma.user.create({
      data: user
    });
    console.log(`Created user: ${user.name}`);
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