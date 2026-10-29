import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env.js";
import * as schema from "./schema/index.js";
import { Pool } from "pg";

export const pool = new Pool({
	connectionString: env.DATABASE_URL,
});

export const db = drizzle({
    client: pool,
    schema,
});
