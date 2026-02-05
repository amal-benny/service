const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users.`);
  
  for (const user of users) {
    console.log(`User: ${user.email}, Role: ${user.role}`);
    const isMatch = await bcrypt.compare('12345678', user.password);
    console.log(`Password '12345678' match: ${isMatch}`);
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
