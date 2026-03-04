import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { User } from '../../entities/user.entity';
import { Rol } from '../../../rol/entities/rol.entity/rol.entity';
import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';

import * as bcrypt from 'bcrypt'; // Encriptar


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
  ) {}

  async create(data: CreateUserDto) {
    const existe = await this.userRepo.findOne({ 
      where: { correo: data.correo } 
    });
    
    if (existe) {
      throw new ConflictException(`El correo ${data.correo} ya está registrado`);
    }

    // Extraemos rolesIds y clave de los datos recibidos
    const { rolesIds, clave, ...userData } = data;
    
    // ENCRIPTACIÓN: Hasheamos la clave con 10 rondas de salt
    const hashedPassword = await bcrypt.hash(clave, 10);

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
      clave: hashedPassword, // Guardamos la versión encriptada
      roles,
    });

    const savedUser = await this.userRepo.save(newUser);
    const { clave: _, ...result } = savedUser;
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

  // Lógica de correo único (Tu original)
  if (data.correo && data.correo !== user.correo) {
    const existe = await this.userRepo.findOne({ where: { correo: data.correo } });
    if (existe) throw new ConflictException(`El correo ${data.correo} ya está registrado`);
  }

  const { rolesIds, clave, ...userData } = data;

  if (rolesIds) {
    const roles = await this.rolRepo.findBy({ id: In(rolesIds) });
    if (roles.length !== rolesIds.length) throw new NotFoundException('Algunos roles no existen');
    user.roles = roles;
  }

  // Actualizamos campos manualmente asegurando la encriptación
  if (clave) {
    user.clave = await bcrypt.hash(clave, 10);
  }

  user.nombre = userData.nombre ?? user.nombre;
  user.apellido = userData.apellido ?? user.apellido;
  user.correo = userData.correo ?? user.correo;
  user.telefono = userData.telefono ?? user.telefono;
  user.direccion = userData.direccion ?? user.direccion;
  user.foto = userData.foto ?? user.foto;
  user.horaInicio = userData.horaInicio ?? user.horaInicio;
  user.horaFin = userData.horaFin ?? user.horaFin;
  user.fecha = userData.fecha ?? user.fecha;
  user.estado = userData.estado ?? user.estado;

  const updatedUser = await this.userRepo.save(user);
  const { clave: _, ...result } = updatedUser;
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

  // Extraemos rolesIds y clave POR SEPARADO para que no entren en el Object.assign
  const { rolesIds, clave, ...restOfData } = data;

  if (clave) {
    user.clave = await bcrypt.hash(clave, 10);
  }

  if (rolesIds) {
    const roles = await this.rolRepo.findBy({ id: In(rolesIds) });
    if (roles.length !== rolesIds.length) {
      throw new NotFoundException('Algunos roles no existen');
    }
    user.roles = roles;
  }

  // Usamos restOfData (que YA NO TIENE la clave) para actualizar lo demás
  Object.assign(user, restOfData);

  const updatedUser = await this.userRepo.save(user);
  const { clave: _, ...result } = updatedUser;
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

  async findByEmailWithPassword(correo: string) {
    const user = await this.userRepo.findOne({ 
      where: { correo },
      relations: ['roles']
    });
    
    if (!user) {
      throw new NotFoundException(`Usuario con correo ${correo} no existe`);
    }
    
    return user;
  }
}