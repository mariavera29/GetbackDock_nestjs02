import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { User } from '../../entities/user.entity'; // Subir 2 niveles
import { Rol } from '../../../rol/entities/rol.entity/rol.entity'; // Subir 3 niveles para llegar a src
import { CreateUserDto } from '../../dtos/user.dto'; // Subir 2 niveles

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Rol) private rolRepo: Repository<Rol>,
  ) {}

  async create(data: CreateUserDto) {
    const { rolesIds, ...userData } = data;
    
    // Buscamos los roles existentes en la DB
    const roles = await this.rolRepo.findBy({
      id: In(rolesIds),
    });

    if (roles.length === 0) {
      throw new NotFoundException('No se encontraron roles válidos');
    }

    const newUser = this.userRepo.create({
      ...userData,
      roles, // Asignamos el array de entidades Rol
    });

    return this.userRepo.save(newUser);
  }

  findAll() {
    // Gracias al 'eager: true' en la entidad, ya trae los roles automáticamente
    return this.userRepo.find();
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuario #${id} no existe`);
    return user;
  }
}