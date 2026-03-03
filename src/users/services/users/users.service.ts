import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { User } from '../../entities/user.entity';
import { Rol } from '../../../rol/entities/rol.entity/rol.entity';
import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
  ) {}

  async create(data: CreateUserDto) {
    // Verificar si el correo ya existe
    const existe = await this.userRepo.findOne({ 
      where: { correo: data.correo } 
    });
    
    if (existe) {
      throw new ConflictException(`El correo ${data.correo} ya está registrado`);
    }

    const { rolesIds, ...userData } = data;
    
    // Buscar roles existentes
    let roles: Rol[] = [];
    if (rolesIds && rolesIds.length > 0) {
      roles = await this.rolRepo.findBy({
        id: In(rolesIds),
      });

      if (roles.length !== rolesIds.length) {
        throw new NotFoundException('Algunos roles no existen');
      }
    }

    const newUser = this.userRepo.create({
      ...userData,
      roles,
    });

    const savedUser = await this.userRepo.save(newUser);
    // Eliminar clave de la respuesta
    const { clave, ...result } = savedUser;
    return result;
  }

  async findAll() {
    const users = await this.userRepo.find({
      relations: ['roles']
    });
    // Eliminar clave de cada usuario
    return users.map(user => {
      const { clave, ...result } = user;
      return result;
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ 
      where: { id },
      relations: ['roles']
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario #${id} no existe`);
    }
    
    const { clave, ...result } = user;
    return result;
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.userRepo.findOne({ 
      where: { id },
      relations: ['roles']
    });

    if (!user) {
      throw new NotFoundException(`Usuario #${id} no existe`);
    }

    // Verificar correo único si se actualiza
    if (data.correo && data.correo !== user.correo) {
      const existe = await this.userRepo.findOne({ 
        where: { correo: data.correo } 
      });
      if (existe) {
        throw new ConflictException(`El correo ${data.correo} ya está registrado`);
      }
    }

    const { rolesIds, ...userData } = data;

    // Actualizar roles si vienen
    if (rolesIds) {
      const roles = await this.rolRepo.findBy({
        id: In(rolesIds),
      });

      if (roles.length !== rolesIds.length) {
        throw new NotFoundException('Algunos roles no existen');
      }

      user.roles = roles;
    }

    // Actualizar datos (PUT - reemplaza todo)
    // Si es PUT, deberían venir todos los campos
    if (userData) {
      user.nombre = userData.nombre ?? user.nombre;
      user.apellido = userData.apellido ?? user.apellido;
      user.correo = userData.correo ?? user.correo;
      if (userData.clave) user.clave = userData.clave;
      user.telefono = userData.telefono ?? user.telefono;
      user.direccion = userData.direccion ?? user.direccion;
      user.foto = userData.foto ?? user.foto;
      user.horaInicio = userData.horaInicio ?? user.horaInicio;
      user.horaFin = userData.horaFin ?? user.horaFin;
      user.fecha = userData.fecha ?? user.fecha;
      user.estado = userData.estado ?? user.estado;
    }

    const updatedUser = await this.userRepo.save(user);
    
    const { clave, ...result } = updatedUser;
    return result;
  }

  async patch(id: number, data: UpdateUserDto) {
    const user = await this.userRepo.findOne({ 
      where: { id },
      relations: ['roles']
    });

    if (!user) {
      throw new NotFoundException(`Usuario #${id} no existe`);
    }

    // Verificar correo único si se actualiza
    if (data.correo && data.correo !== user.correo) {
      const existe = await this.userRepo.findOne({ 
        where: { correo: data.correo } 
      });
      if (existe) {
        throw new ConflictException(`El correo ${data.correo} ya está registrado`);
      }
    }

    const { rolesIds, ...userData } = data;

    // Actualizar roles si vienen
    if (rolesIds) {
      const roles = await this.rolRepo.findBy({
        id: In(rolesIds),
      });

      if (roles.length !== rolesIds.length) {
        throw new NotFoundException('Algunos roles no existen');
      }

      user.roles = roles;
    }

    // Aplicar solo los campos que vienen en la petición (PATCH)
    Object.assign(user, userData);

    const updatedUser = await this.userRepo.save(user);
    
    const { clave, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ 
      where: { id } 
    });

    if (!user) {
      throw new NotFoundException(`Usuario #${id} no existe`);
    }

    await this.userRepo.remove(user);
    return { message: `Usuario #${id} eliminado correctamente` };
  }

  async cambiarEstado(id: number, estado: 'ACTIVO' | 'INACTIVO') {
    const user = await this.userRepo.findOne({ 
      where: { id },
      relations: ['roles']
    });

    if (!user) {
      throw new NotFoundException(`Usuario #${id} no existe`);
    }

    user.estado = estado;
    const updatedUser = await this.userRepo.save(user);
    
    const { clave, ...result } = updatedUser;
    return result;
  }

  async findByEmail(correo: string) {
    const user = await this.userRepo.findOne({ 
      where: { correo },
      relations: ['roles']
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario con correo ${correo} no existe`);
    }
    
    const { clave, ...result } = user;
    return result;
  }
}