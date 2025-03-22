import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    /** ✅ Handles user signup */
    async signup(username: string, password: string) {
        console.log("🔍 Checking if user already exists:", username);

        const existingUser = await this.userRepository.findOne({ where: { username } });

        if (existingUser) {
            console.error("⚠️ User already exists:", username);
            throw new ConflictException("Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = this.userRepository.create({
            username,
            password: hashedPassword,
            role: "user", // Default to user role
        });

        await this.userRepository.save(newUser);
        console.log("✅ User saved successfully:", newUser);

        return this.generateTokens(newUser);
    }

    /** ✅ Validates user credentials */
    async validateUser(username: string, password: string) {
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return this.generateTokens(user);
    }

    /** ✅ Generates JWT tokens */
    generateTokens(user: User) {
        const payload = {
            sub: user.id,
            username: user.username,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload, {
            expiresIn: "15m",
        });

        const refreshToken = this.jwtService.sign({ sub: user.id }, {
            expiresIn: "7d",
        });

        return { accessToken, refreshToken, user };
    }

    /** 🔄 ✅ Verifies refresh token and returns new tokens */
    async refreshToken(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userRepository.findOne({ where: { id: payload.sub } });

            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            console.log("🔄 Refresh token verified for user:", user.username);
            return this.generateTokens(user);
        } catch (err) {
            console.error("🚨 Invalid refresh token:", err.message);
            throw new UnauthorizedException("Invalid refresh token");
        }
    }
}
