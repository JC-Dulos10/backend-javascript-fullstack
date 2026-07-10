import "dotenv/config";

import prisma from "../src/config/prisma";

import { seedAdmin } from "./seeders/admin.seeder";
import { seedCategories } from "./seeders/category.seeder";

async function main() {

    console.log("");

    console.log("Starting database seed...");

    // If migrations were not applied yet, the DB tables may not exist.
    // Fail fast with a clearer message.
    try {
        await seedAdmin();
        await seedCategories();
    } catch (err: any) {
        console.error("Seed failed. Most commonly: run `npx prisma migrate dev` (or ensure migrations are applied) before seeding.");
        throw err;
    }

    console.log("");

    console.log("Database seed completed.");

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });