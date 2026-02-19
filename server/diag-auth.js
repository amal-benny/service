const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET;

console.log('Diagnostic script starting...');

async function diagnose() {
  console.log('JWT_SECRET from env:', secret);
  
  // 1. Create a dummy token for a known user (if any) or just a test ID
  let userId = 1; // Assuming user with ID 1 exists, otherwise we'll check the DB first
  
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No users found in database. Cannot test valid token.');
    return;
  }
  
  userId = user.id;
  console.log(`Testing with real User ID: ${userId} (${user.email})`);
  
  const token = jwt.sign({ id: userId }, secret, { expiresIn: '1h' });
  console.log('Generated Token:', token);
  
  try {
    const decoded = jwt.verify(token, secret);
    console.log('Decoded Token:', decoded);
    
    // Check if ID type matches
    console.log('Type of decoded.id:', typeof decoded.id);
    
    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });
    
    if (dbUser) {
      console.log('User found in DB:', dbUser);
    } else {
      console.log('User NOT found in DB with ID:', decoded.id);
    }
  } catch (err) {
    console.error('JWT Verification failed:', err.message);
  }
}

diagnose()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
