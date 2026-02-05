const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const email = 'plumber@example.com';
  const password = '12345678';
  let log = '';

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    log += 'Provider User NOT FOUND\n';
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    log += `User: ${user.email}\n`;
    log += `Role: ${user.role}\n`;
    log += `Password Valid: ${isMatch}\n`;
  }
  
  fs.writeFileSync('login-status.txt', log);
  console.log('Done');
}

main()
  .catch(e => fs.writeFileSync('login-status.txt', e.toString()))
  .finally(() => prisma.$disconnect());
