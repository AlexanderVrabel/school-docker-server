import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

// 1. Setup the connection pool (using your .env URL)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Setup the adapter
const adapter = new PrismaPg(pool);

// 3. Create the client using the adapter
const prisma = new PrismaClient({ adapter });

export default prisma;