const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'plumber@example.com';
  const password = '12345678';
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log('Provider User NOT FOUND');
    return;
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(`User: ${user.email}`);
  console.log(`Role: ${user.role}`);
  console.log(`Password Valid: ${isMatch}`);
  
  if (user.role !== 'PROVIDER') {
      console.log('WARNING: User is not a PROVIDER');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
