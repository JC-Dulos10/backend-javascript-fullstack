import "dotenv/config";

import prisma from "../src/config/prisma";
import { PasswordUtil } from "../src/security/password";

import { Role } from "@prisma/client";

async function main() {

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });