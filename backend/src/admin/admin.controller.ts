// src/admin/admin.controller.ts
import { Controller, Get, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("admin")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class AdminController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    @Get("users")
    @Roles("admin")
    async findAllUsers() {
        const users = await this.userRepository.find({
            select: ["id", "username", "role", "isActive", "createdAt"],
            order: { id: "ASC" }
        });
        return users;
    }
}
