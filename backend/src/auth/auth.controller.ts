import {
    Controller,
    Post,
    Get,
    Body,
    Req,
    Res,
    UseGuards,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { AuthGuard } from "@nestjs/passport";

/** ✅ Custom Request Type to fix TS error with req.user */
interface AuthRequest extends Request {
    user?: { sub: number; username: string; role: string };
}

@Controller("auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    /** ✅ Handles user signup */
    @Post("signup")
    async signup(
        @Body() body: { username: string; password: string },
        @Res() res: Response
    ): Promise<Response> {
        console.log("📝 Signup request received:", body);

        try {
            const tokens = await this.authService.signup(body.username, body.password);
            console.log("✅ Signup successful for:", body.username);

            // ✅ Set secure HTTP-only cookie
            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: "localhost",
                path: "/",
            });

            return res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            console.error("🚨 Signup failed:", error);

            if (error instanceof ConflictException) {
                return res.status(409).json({ message: "Username already exists" });
            }

            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    /** ✅ Handles user login */
    @Post("login")
    async login(
        @Body() body: { username: string; password: string },
        @Res() res: Response
    ): Promise<Response> {
        console.log("📝 Login request received:", body);

        try {
            const tokens = await this.authService.validateUser(body.username, body.password);
            console.log("✅ Login successful for:", body.username);

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                domain: "localhost",
                path: "/",
            });

            return res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            console.error("🚨 Login failed:", error);

            if (error instanceof UnauthorizedException) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    /** ✅ Returns the currently logged-in user */
    @Get("me")
    @UseGuards(AuthGuard("jwt"))
    async getProfile(@Req() req: AuthRequest) {
        console.log("🧠 req.user payload received:", req.user);

        const userId = req.user?.sub;
        if (!userId) {
            console.warn("⚠️ Missing JWT payload.");
            throw new UnauthorizedException("Missing user payload");
        }

        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            console.warn(`⚠️ No user found with ID ${userId}`);
            throw new NotFoundException("User not found");
        }

        return {
            id: user.id,
            username: user.username,
            role: user.role,
        };
    }

    /** 🔄 Refresh access token using cookie */
    @Post("refresh")
    async refresh(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) throw new UnauthorizedException("Refresh token missing");

        const tokens = await this.authService.refreshToken(refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: "localhost",
            path: "/",
        });

        return res.json({ accessToken: tokens.accessToken, user: tokens.user });
    }

    /** 🚪 Logout & clear refresh cookie */
    @Post("logout")
    async logout(@Res() res: Response) {
        res.clearCookie("refreshToken", { path: "/", domain: "localhost" });
        console.log("✅ User logged out, refresh token cleared!");
        return res.json({ message: "Logged out successfully" });
    }
}
