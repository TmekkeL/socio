import { DataSource } from "typeorm";
import { User } from "../user/user.entity"; // Add more entities here later
import { config } from "dotenv";

config(); // Load environment variables

export default new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "mekke187",
    password: process.env.DB_PASS || "securepassword",
    database: process.env.DB_NAME || "socio",
    entities: [User],
    migrations: ["src/migrations/*.ts"], // ✅ Path to migrations
    synchronize: false, // ❌ DISABLE SYNC, we use migrations instead!
    logging: true, // ✅ See SQL queries in logs
});
