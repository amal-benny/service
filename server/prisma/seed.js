const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');
  // Delete in order to avoid foreign key constraints
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.service.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding new data...');

  const password = await bcrypt.hash('12345678', 10);

  // 1. Create Admin
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password,
      role: 'ADMIN',
    },
  });

  // 2. Create Client
  await prisma.user.create({
    data: {
      email: 'client@example.com',
      name: 'Alice Client',
      password,
      role: 'CLIENT',
    },
  });

  // 3. Create Providers with Services
  const providers = [
    {
      name: 'John Plumber',
      email: 'plumber@example.com',
      role: 'PROVIDER',
      profile: {
        phone: '555-0101',
        address: '123 Pipe Lane',
        bio: 'Expert in leak detection and pipe repairs with 10 years of experience.',
        isVerified: true,
      },
      services: [
        {
          title: 'Emergency Pipe Repair',
          description: 'Quick fix for bursting pipes and severe leaks. Available 24/7.',
          price: 120.00,
          category: 'Plumbing',
          imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Faucet Installation',
          description: 'Installation of new faucets for kitchen and bathroom.',
          price: 80.00,
          category: 'Plumbing',
          imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
      ]
    },
    {
      name: 'Sarah Electrician',
      email: 'electric@example.com',
      role: 'PROVIDER',
      profile: {
        phone: '555-0102',
        address: '456 Voltage Way',
        bio: 'Certified electrician specializing in home wiring and smart home setups.',
        isVerified: true,
      },
      services: [
        {
          title: 'Full Home Rewiring',
          description: 'Complete electrical rewiring for older homes to ensure safety.',
          price: 1500.00,
          category: 'Electrical',
          imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Light Fixture Installation',
          description: 'Install chandeliers, pendant lights, and recessed lighting.',
          price: 90.00,
          category: 'Electrical',
          imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
      ]
    },
    {
      name: 'CleanPro Services',
      email: 'cleaner@example.com',
      role: 'PROVIDER',
      profile: {
        phone: '555-0103',
        address: '789 Sparkle Dr',
        bio: 'Professional cleaning service for homes and offices. Eco-friendly products.',
        isVerified: true,
      },
      services: [
        {
          title: 'Deep House Cleaning',
          description: 'Thorough cleaning of all rooms, including carpets and windows.',
          price: 200.00,
          category: 'Cleaning',
          imageUrl: 'https://images.unsplash.com/photo-1581578731117-104529302f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
        {
          title: 'Move-in/Move-out Clean',
          description: 'Get your place spotless before you move in or after you leave.',
          price: 250.00,
          category: 'Cleaning',
          imageUrl: 'https://images.unsplash.com/photo-1527515673516-75c44e7154cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
      ]
    },
    {
      name: 'Quick Movers',
      email: 'mover@example.com',
      role: 'PROVIDER',
      profile: {
        phone: '555-0104',
        address: '321 Box St',
        bio: 'Reliable moving service. We handle your items with care.',
        isVerified: false, // Not verified yet
      },
      services: [
        {
          title: 'Local Moving Service',
          description: 'Truck and 2 movers for local moves within 30 miles.',
          price: 100.00, // Per hour maybe, but sticking to flat for now
          category: 'Moving',
          imageUrl: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        },
      ]
    },
  ];

  for (const p of providers) {
    await prisma.user.create({
      data: {
        email: p.email,
        name: p.name,
        password,
        role: p.role,
        providerProfile: {
          create: {
            ...p.profile,
            services: {
              create: p.services
            }
          }
        }
      }
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
