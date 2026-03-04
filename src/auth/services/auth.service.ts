
import { UsersService } from '../../users/services/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // <--- 1. Importar bcrypt

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(correo: string, clave: string) {
    // Buscamos al usuario incluyendo la clave (usando el método que ya tienes en tu service)
    const user = await this.usersService.findByEmailWithPassword(correo);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // --- 2. COMPARACIÓN SEGURA CON BCRYPT ---
    // Compara la clave en texto plano con el hash de la DB
    const isMatch = await bcrypt.compare(clave, user.clave);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Si coincide, devolvemos el usuario (sin la clave por seguridad)
    const { clave: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { correo: user.correo, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
