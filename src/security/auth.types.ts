import { Role } from "@prisma/client";

export interface JwtPayload {

    userId: number;

    username: string;

    role: Role;

}