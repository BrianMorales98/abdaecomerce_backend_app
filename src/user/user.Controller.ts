
import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.Service";
import { User } from "@prisma/client";

@Controller('user') //Endpoint 
export class UserController {

    constructor(
        private readonly registerService: UserService
        
        ) {}

    @Post('register')
    async createUser(@Body() data: User) {
        console.log(data)
        return this.registerService.createUser(data);
    }
}