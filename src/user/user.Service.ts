import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User} from  "@prisma/client"


@Injectable()
export class UserService{

    constructor(
        private prisma: PrismaService){}
    

    async createUser(data: User): Promise<User>{
        data['role_id'] = 1 
        return this.prisma.user.create({
            data
        })
    }

}

