// Importaciones de módulos y servicios necesarios
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";

@Injectable()
export class UserService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    // Método para registrar un nuevo usuario
    async registerUser(data: User): Promise<User> {
        // Asigna un valor predeterminado para el role_id
        data['role_id'] = 1;

        // Encripta la contraseña
        const hashedPassword = await bcrypt.hash(data.password, 12);

        // Asigna la contraseña encriptada al objeto de datos del usuario
        data.password = hashedPassword;

        // Llama al método createUser del servicio de Prisma para crear el usuario
        return this.prisma.user.create({
            data
        });
    }

    // Método para autenticar al usuario y generar un token JWT
    async loginUser(data: User, res: Response): Promise<any> {
        // Valida las credenciales del usuario
        const user = await this.validateUser(data);

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        // Genera un token JWT
        const token = await this.generateToken(user);

        // Establece la cookie de token en la respuesta
        res.cookie('token', token, { httpOnly: true });

        return { message: 'Éxito' };
    }

    // Método para validar las credenciales del usuario
    async validateUser(data: User): Promise<User | null> {
        // Busca al usuario en la base de datos por su correo electrónico
        const user = await this.prisma.user.findFirst({
            where: { email: data.email }
        });

        // Compara las contraseñas si el usuario existe
        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            return null;
        }

        return user;
    }

    // Método para generar un token JWT
    async generateToken(user: User): Promise<string> {
        // Elimina la contraseña del usuario del objeto antes de firmar el token
        const { password, ...userWithoutPassword } = user;
        return this.jwtService.signAsync(userWithoutPassword);
    }

    // Método para obtener información del usuario basada en el token JWT
    async getUserFromToken(request: Request): Promise<User | undefined> {
        // Extrae el token JWT de la solicitud
        const token = await this.extractTokenFromRequest(request);

        if (!token) {
            throw new UnauthorizedException('Token JWT no encontrado');
        }

        // Verifica y decodifica el token JWT
        const decoded = await this.verifyToken(token);

        // Si el token no es válido o no contiene el correo electrónico, lanza una excepción
        if (!decoded || !decoded.email) {
            throw new UnauthorizedException('Token JWT inválido');
        }

        // Busca al usuario en la base de datos por su correo electrónico
        return this.prisma.user.findUnique({ where: { email: decoded.email } });
    }

    // Método para extraer el token JWT de la solicitud
    async extractTokenFromRequest(request: Request): Promise<string | null> {
        const cookie = request.cookies['token'];
        return cookie || null;
    }

    // Método para verificar la validez del token JWT
    async verifyToken(token: string): Promise<any> {
        try {
            return await this.jwtService.verifyAsync(token);
        } catch (error) {
            throw new UnauthorizedException('Token JWT inválido');
        }
    }

    // Método para cerrar la sesión del usuario y limpiar la cookie de token
    async logoutUser(response: Response): Promise<any> {
        response.clearCookie('token');
        return { message: 'Éxito' };
    }
}
