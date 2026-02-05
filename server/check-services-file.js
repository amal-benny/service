const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const services = await prisma.service.findMany({
    include: {
        provider: {
            select: {
                id: true
            }
        }
    }
  });
  fs.writeFileSync('services-status.txt', JSON.stringify(services, null, 2));
}

main()
  .catch(e => fs.writeFileSync('services-status.txt', e.toString()))
  .finally(() => prisma.$disconnect());
