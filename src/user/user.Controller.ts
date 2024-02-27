// Importaciones de módulos y servicios necesarios
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

// Decorador @Controller define la ruta base para las rutas manejadas por este controlador
@Controller('api') 
export class UserController {

    // Constructor del controlador que inyecta el servicio necesario para manejar el registro de usuarios
    constructor(
        private readonly UserService: UserService) {}

    // Decorador @Post define una ruta POST para manejar el registro de usuarios
    @Post('register')
    // Método para manejar la solicitud de registro de usuarios
    async registerUser(@Body() data: User) {
        console.log(data)
        return this.UserService.createUser(data);
    }

    @Post('login')
    // Metod para manejar la solicitud de login 
    async loginUser(@Body() data: User, @Res({passthrough: true}) res: Response){
        try {
            const token = await this.UserService.loginUser(data);
            
            res.cookie('token', token, {httpOnly: true});

            return{
                message: "succes"
            }
        } catch (error) {
            message: "Invalid Credentials"
        }
    }
}
