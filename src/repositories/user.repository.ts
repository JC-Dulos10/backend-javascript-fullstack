import { BaseRepository } from "./base.repository";
import { CreateUserDto } from "../dto/auth/create-user.dto";
import { PrismaTransaction } from "../database/prima.types";  

export class UserRepository extends BaseRepository {

    async findByUsername(
        username: string,
        tx?: PrismaTransaction
    ) {

        return this.getDb(tx).user.findUnique({
            where: {
                username,
            },
        });

    }

    async create(
        data: CreateUserDto,
        tx?: PrismaTransaction
    ) {

        return this.getDb(tx).user.create({
            data,
        });

    }

}