const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash('admin123', salt);

  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: { password: password }, // Force update password
      create: {
        email: 'admin@example.com',
        name: 'Admin User',
        password: password,
        role: 'ADMIN',
      },
    });
    fs.writeFileSync('admin-status.txt', `Success: Admin updated with ID ${admin.id}`);
  } catch (error) {
    fs.writeFileSync('admin-status.txt', `Error: ${error.message}`);
  }
}

main()
  .catch((e) => {
    fs.writeFileSync('admin-status.txt', `Fatal Error: ${e.message}`);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
