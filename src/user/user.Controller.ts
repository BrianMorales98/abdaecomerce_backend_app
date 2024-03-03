// Importaciones de módulos y servicios necesarios
import { UserService } from "../user/user.Service";
import { User } from "@prisma/client";
import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('api') 
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) {}

    // Método para manejar la solicitud de registro de usuarios
    @Post('register')
    async registerUser(@Body() data: User) {
        return this.userService.registerUser(data);
    }

    // Método para manejar la solicitud de inicio de sesión de usuarios
    @Post('login')
    async loginUser(@Body() data: User, @Res({passthrough: true}) res: Response) {
        return this.userService.loginUser(data, res);
    }

    // Método para manejar la solicitud de obtención de información de usuario
    @Get('user')
    async getUser(@Req() request: Request) {
        return this.userService.getUserFromToken(request);
    }

    // Método para manejar la solicitud de cierre de sesión de usuarios
    @Post('logout')
    async logoutUser(@Res({passthrough: true}) response: Response) {
        return this.userService.logoutUser(response);
    }
}
