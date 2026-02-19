const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

async function run() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true }
    });
    console.log('Users in DB:');
    users.forEach(u => console.log(`ID: ${u.id}, Email: ${u.email}`));
    
    if (users.length > 0) {
      const u = users[0];
      const token = jwt.sign({ id: u.id }, secret, { expiresIn: '1h' });
      console.log('--- TEST TOKEN START ---');
      console.log(token);
      console.log('--- TEST TOKEN END ---');
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
