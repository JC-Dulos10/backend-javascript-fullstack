import prisma from "../../src/config/prisma";
import { PasswordUtil } from "../../src/security/password";
import { env } from "../../src/config/env";

import { Role } from "@prisma/client";

export async function seedAdmin() {

    const existingAdmin = await prisma.user.findFirst({
        where: {
            role: Role.ADMIN,
        },
    });

    if (existingAdmin) {
        console.log("✔ Admin already exists.");
        return;
    }

    const hashedPassword = await PasswordUtil.hash(
        env.ADMIN_PASSWORD
    );

    await prisma.user.create({
        data: {
            username: env.ADMIN_USERNAME,
            password: hashedPassword,
            role: Role.ADMIN,
        },
    });

    console.log("✔ Admin user created.");
}