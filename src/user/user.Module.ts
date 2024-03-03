import {Module} from "@nestjs/common"
// @ts-ignore 
import { UserService } from "./User.Service";
// @ts-ignore 
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