// Importaciones de módulos y servicios necesarios
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { Controller, Post, Body, Res, HttpStatus, Get, Req, UnauthorizedException } from '@nestjs/common';
import { Response, Request, CookieOptions, response } from 'express';
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

// Decorador @Controller define la ruta base para las rutas manejadas por este controlador
@Controller('api') 
export class UserController {

    // Constructor del controlador que inyecta el servicio necesario para manejar el registro de usuarios
    constructor(
        private readonly UserService: UserService,
        private jwtService: JwtService,
        private prisma: PrismaService,
        ) {}

    // Decorador @Post define una ruta POST para manejar el registro de usuarios
    @Post('register')
    // Método para manejar la solicitud de registro de usuarios
    async registerUser(@Body() data: User) {
        console.log(data)

        const user = await this.UserService.createUser(data);

        const { password, ...userData} = user

        return userData
    }

    @Post('login')
    // Metod para manejar la solicitud de login 
    async loginUser(@Body() data: User, @Res({passthrough: true}) res: Response){
        try {
            const token = await this.UserService.loginUser(data);
            
            res.cookie('token', token, {httpOnly: true});

            return{
                message: "Succes"
            }
        } catch (error) {
            message: "Invalid Credentials"
        }
    }

     @Get('user')
    async user(@Req() request: Request) {
        let token: any;
        try {

            const cookie = request.cookies['token'];
            if (cookie) {
                token = cookie; // Assuming the entire cookie is the token
            } else {
                throw new Error("JWT token not found in the cookie");
            }

            const data = await this.jwtService.verifyAsync(token)

            if(!data) {
                throw new UnauthorizedException()
            }

            const user = await this.prisma.user.findFirst({where: {email: data.email}})

            const {password, ...userData} = user

            return userData;

        } catch (error) {
            throw new UnauthorizedException()
        }        
    }

    @Post('logout')
    async userLogout(@Res({passthrough: true}) response: Response) {
        response.clearCookie('token')
        return {
            message: "Succes"
        }
    }
}
