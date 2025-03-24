// src/user/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("users") // Matches actual table name in Postgres
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({ default: "user" })
    role: string;

    @CreateDateColumn({
        name: "created_at",
        type: "timestamp with time zone",
        default: () => "now()",
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: "updated_at",
        type: "timestamp with time zone",
        default: () => "now()",
    })
    updatedAt: Date;

    @Column({ name: "is_active", default: true })
    isActive: boolean;

    @Column({ name: "profile_picture", nullable: true })
    profilePicture?: string;
}
