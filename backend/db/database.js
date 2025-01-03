import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import {
  DATABASE_URL,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} from "../src/utils/constants.js";
import * as user from "./schema/user.js";
import role from "./schema/role.js";
import blackListToken from "./schema/blacklisttoken.js";
import * as address from "./schema/address.js";
import * as supportTicket from "./schema/supportTicket.js";
import * as wallet from "./schema/wallet.js";
import * as sellerProfile from "./schema/sellerProfile.js";
import * as service from "./schema/service.js";
import * as order from "./schema/order.js";
import * as review from "./schema/review.js";

const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    DATABASE_URL ||
    `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
});

pool
  .connect()
  .then(async () => {
    console.log("Database connection has been established successfully.");

    // // Code for Hafsa
    // // Enable the pgcrypto extension
    // const client = await pool.connect();
    // try {
    //     await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    //     console.log('pgcrypto extension enabled successfully');
    // } catch (error) {
    //     console.error('Error enabling pgcrypto extension:', error);
    // } finally {
    //     // Release the client back to the pool
    //     client.release();
    // }
  })

  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export const database = drizzle(pool, {
  schema: {
    ...user,
    role,
    blackListToken,
    ...address,
    ...sellerProfile,
    ...wallet,
    ...supportTicket,
    ...service,
    ...order,
    ...review,
  },
});
