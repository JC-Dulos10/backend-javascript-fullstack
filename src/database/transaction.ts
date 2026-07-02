import prisma from "../config/prisma";
import { PrismaTransaction } from "./prima.types";

export class TransactionService {

  static async execute<T>(
    callback: (tx: PrismaTransaction) => Promise<T>
  ): Promise<T> {

    return prisma.$transaction(async (tx) => {

      return callback(tx);

    });

  }

}