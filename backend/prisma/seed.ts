import dotenv from 'dotenv';
import { PrismaClient, AdminRole } from '@prisma/client';
import { hashPassword } from '../src/utils/bcrypt';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('--- Initializing Admin Seed Process ---');

  const email = process.env.ADMIN_INITIAL_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  const name = process.env.ADMIN_INITIAL_NAME || 'System Administrator';
  const roleInput = process.env.ADMIN_INITIAL_ROLE || 'SUPER_ADMIN';

  // 1. Validate required credentials
  if (!email || !email.includes('@')) {
    throw new Error('ADMIN_INITIAL_EMAIL is required and must be a valid email address');
  }

  if (!password || password.length < 8) {
    throw new Error('ADMIN_INITIAL_PASSWORD is required and must be at least 8 characters long');
  }

  if (!name || name.trim().length === 0) {
    throw new Error('ADMIN_INITIAL_NAME is required');
  }

  const role = roleInput in AdminRole ? (roleInput as AdminRole) : AdminRole.SUPER_ADMIN;

  // 2. Check if an admin with this email already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase().trim() },
  });

  if (existingAdmin) {
    console.log(`[Seed Notice] Administrator with email ${email} already exists. Skipping seed.`);
    return;
  }

  // 3. Hash password using bcrypt cost factor 12
  const passwordHash = await hashPassword(password);

  // 4. Create initial administrator
  const createdAdmin = await prisma.admin.create({
    data: {
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name.trim(),
      role,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  console.log(`[Seed Success] Initial administrator created successfully:`);
  console.log(`ID: ${createdAdmin.id}`);
  console.log(`Email: ${createdAdmin.email}`);
  console.log(`Role: ${createdAdmin.role}`);
}

main()
  .catch((e) => {
    console.error('[Seed Error] Failed to seed initial administrator:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
