import prisma from "../config/prisma";
import { PrismaTransaction } from "../database/prima.types";

export abstract class BaseRepository {

    protected getDb(tx?: PrismaTransaction) {
        return tx ?? prisma;
    }

}