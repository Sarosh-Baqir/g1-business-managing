import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import routes from "./routes/index.js";
import { database } from "../db/database.js";

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.SERVER_PORT;
const HOST = process.env.SERVER_HOST;

app.use(express.static("public"));
app.use(express.json());
app.use(cors());
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});
