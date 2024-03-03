import {Module} from "@nestjs/common"
import { UserService } from "./User.Service";
import { UserController } from "./User.Controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";


@Module({
    controllers:[UserController],
    providers: [UserService],
    imports: [PrismaModule, 
    JwtModule.register({
        secret: 'super secret', //Debe guardarse en el .env
        signOptions: {expiresIn: '1h'}
    })
    ]
})

export class UserModule {}