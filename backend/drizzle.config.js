import { DATABASE_URL } from "./src/utils/constants"

export default {
  schema: "./db/schema",
  out: "./migrations",
  dbCredentials: {
    connectionString: DATABASE_URL,
  },
  driver: "pg",
}
