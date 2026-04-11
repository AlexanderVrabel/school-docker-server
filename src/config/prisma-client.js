const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('../generated/prisma');

// 1. Setup the connection pool (using your .env URL)
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Setup the adapter
const adapter = new PrismaPg(pool);

// 3. Create the client using the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;