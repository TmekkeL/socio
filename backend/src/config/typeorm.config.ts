import { DataSource } from "typeorm";
import { User } from "../user/user.entity";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: configService.get<string>("DB_HOST", "localhost"),
    port: configService.get<number>("DB_PORT", 5432),
    username: configService.get<string>("DB_USER", "mekke187"),
    password: configService.get<string>("DB_PASS", "securepassword"),
    database: configService.get<string>("DB_NAME", "socio"),
    entities: [User],
    synchronize: false, // 🚨 Disable in production!
    migrations: ["dist/migrations/*.js"], // ✅ Migration files
    logging: true,
});

export default AppDataSource; // ✅ Ensure we export exactly ONE DataSource instance
