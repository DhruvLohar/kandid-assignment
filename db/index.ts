import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Ensure the DATABASE_URL is set in your environment variables.
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
}

// Create a client for the database connection.
// We use 'prepare: false' to avoid issues with Neon's connection pooling in serverless environments.
const client = postgres(process.env.DATABASE_URL, { prepare: false });

// Initialize Drizzle with the client and schema.
export const db = drizzle(client, { schema });
