import prisma from "../config/prisma";
import { PrismaTransaction } from "../database/prisma.types";

// Shared repository helpers keep Prisma access consistent across the app.
export abstract class BaseRepository {

    protected getDb(tx?: PrismaTransaction) {
        return tx ?? prisma;
    }

}