const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });
  
  if (admin) {
    console.log('Admin found:', admin.email);
    console.log('Role:', admin.role);
    console.log('Password hash length:', admin.password.length);
  } else {
    console.log('Admin USER NOT FOUND');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
