// Importaciones de módulos y servicios necesarios
import { Body, Controller, Post } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "@prisma/client";
import * as bcrypt from 'bcrypt'

// Decorador @Controller define la ruta base para las rutas manejadas por este controlador
@Controller('api') 
export class UserController {

    // Constructor del controlador que inyecta el servicio necesario para manejar el registro de usuarios
    constructor(private readonly UserService: UserService) {}

    // Decorador @Post define una ruta POST para manejar el registro de usuarios
    @Post('register')
    // Método para manejar la solicitud de registro de usuarios
    async registerUser(@Body() data: User) {

        //saltOrRounds es un argumento para la funcionalidad de hash, debe ser un numero. Buscar Documentacion de bcrypt
        const saltOrRounds = 12; 

        //Se crea una variable que contenga el valor del password pero encryptado
        const hashedPassword = await bcrypt.hash( data.password, saltOrRounds);

        //Se asigna ese valor encriptado a la propiedad password del data object
        data.password = hashedPassword; 

        // Llama al método createUser del servicio registerService y retorna el resultado
        return this.UserService.createUser(data);
    }

    @Post('login')
    // Metod para manejar la solicitud de login 
    async loginUser(@Body() data: User){
        const user = await this.UserService.loginUser(data);
    }
}
