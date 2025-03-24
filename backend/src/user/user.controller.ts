import {
    Controller,
    Get,
    Put,
    Patch,
    Delete,
    Param,
    Body,
    Req,
    UseGuards,
    ForbiddenException,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

/** ✅ Extend Request with user object (JWT payload) */
interface AuthRequest extends Request {
    user?: { sub: number; role: string };
}

@Controller("admin")
export class UserController {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    @Get("users")
    @UseGuards(AuthGuard("jwt"))
    async getAllUsers(@Req() req: AuthRequest) {
        const user = req.user;
        if (user?.role !== "admin") {
            throw new ForbiddenException("Access denied: Admins only");
        }

        const users = await this.userRepository.find({
            select: ["id", "username", "role", "createdAt", "updatedAt"],
            order: { id: "ASC" },
        });

        return users;
    }

    @Put("users/:id")
    @UseGuards(AuthGuard("jwt"))
    async updateUser(
        @Param("id") id: number,
        @Body() body: Partial<User>,
        @Req() req: AuthRequest
    ) {
        const requester = req.user;
        if (requester?.role !== "admin") {
            throw new ForbiddenException("Access denied");
        }

        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        user.username = body.username ?? user.username;
        user.role = body.role ?? user.role;

        await this.userRepository.save(user);

        return { message: "User updated successfully", user };
    }

    @Patch("users/:id")
    @UseGuards(AuthGuard("jwt"))
    async partiallyUpdateUser(
        @Param("id") id: number,
        @Body() updateData: Partial<User>,
        @Req() req: AuthRequest
    ) {
        const requester = req.user;
        if (requester?.role !== "admin") {
            throw new ForbiddenException("Access denied");
        }

        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        Object.assign(user, updateData);
        user.updatedAt = new Date();

        await this.userRepository.save(user);

        return { message: "User partially updated", user };
    }

    @Delete("users/:id")
    @UseGuards(AuthGuard("jwt"))
    async deleteUser(@Param("id") id: number, @Req() req: AuthRequest) {
        const requester = req.user;
        if (requester?.role !== "admin") {
            throw new ForbiddenException("Access denied");
        }

        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException("User not found");
        }

        await this.userRepository.remove(user);

        return { message: "User deleted successfully" };
    }
}
