import "dotenv/config";

import prisma from "../src/config/prisma";

import { seedAdmin } from "./seeders/admin.seeder";
import { seedCategories } from "./seeders/category.seeder";

async function main() {

    console.log("");

    console.log("Starting database seed...");

    await seedAdmin();

    await seedCategories();

    console.log("");

    console.log("Database seed completed.");

}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });