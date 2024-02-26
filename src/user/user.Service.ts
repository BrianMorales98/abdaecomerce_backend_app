import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User} from  "@prisma/client"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class UserService{

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService){}
    

    async createUser(data: User): Promise<User>{
        data['role_id'] = 1 
         //saltOrRounds es un argumento para la funcionalidad de hash, debe ser un numero. Buscar Documentacion de bcrypt
         const saltOrRounds = 12; 

         //Se crea una variable que contenga el valor del password pero encryptado
         const hashedPassword = await bcrypt.hash( data.password, saltOrRounds);
 
         //Se asigna ese valor encriptado a la propiedad password del data object
         data.password = hashedPassword; 
 
         // Llama al método createUser del servicio registerService y retorna el resultado
        return this.prisma.user.create({
            data
        })
    }

    async loginUser(data:User): Promise<string> {
        const user = await this.prisma.user.findFirst({where: { email: data.email}});

        if(!user) {
            throw new BadRequestException('Invalid Credentials')
        }

        if (!await bcrypt.compare(data.password, user.password)){
            throw new BadRequestException('Invalid Credentials')    
        }

        const jwt = await this.jwtService.signAsync({id: user.user_id, name: user.name, lastname: user.last_name, role_Id: user.role_id});

        return jwt; 
    }

}

