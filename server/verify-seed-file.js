const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  let log = '';
  try {
    const users = await prisma.user.findMany();
    log += `Found ${users.length} users.\n`;
    
    for (const user of users) {
      log += `User: ${user.email}, Role: ${user.role}\n`;
      const isMatch = await bcrypt.compare('12345678', user.password);
      log += `Password '12345678' match: ${isMatch}\n`;
    }
  } catch (err) {
    log += `Error: ${err.message}\n`;
  }
  
  fs.writeFileSync('verify-status.txt', log);
}

main()
  .catch((e) => {
    fs.writeFileSync('verify-status.txt', `Fatal: ${e.message}`);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
