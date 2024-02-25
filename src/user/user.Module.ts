import { Module } from "@nestjs/common";
import { UserController} from "./user.Controller";
import { UserService } from "./user.Service";
import { PrismaModule } from "src/prisma/prisma.module";
@Module({
    controllers:[UserController],
    providers: [UserService],
    imports: [PrismaModule]
})
export class UserModule {}