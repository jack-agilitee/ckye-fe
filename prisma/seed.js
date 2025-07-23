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

async function main() {
  console.log('Seeding database...');
  
  // Delete existing users
  await prisma.user.deleteMany();
  
  // Create users
  for (const user of users) {
    await prisma.user.create({
      data: user
    });
    console.log(`Created user: ${user.name}`);
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