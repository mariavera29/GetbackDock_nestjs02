import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../../entities/rol.entity/rol.entity';
import { RolDto } from '../../dtos/rol.dto/rol.dto';

@Injectable()
export class RolService {
  constructor(
    @InjectRepository(Rol)
    private rolRepo: Repository<Rol>,
  ) {}

  findAll() {
    return this.rolRepo.find();
  }

  async findOne(id: number) {
    const rol = await this.rolRepo.findOne({ where: { id } });
    if (!rol) throw new NotFoundException(`Rol con ID ${id} no existe`);
    return rol;
  }

  create(data: RolDto) {
    const newRol = this.rolRepo.create(data);
    return this.rolRepo.save(newRol);
  }
}