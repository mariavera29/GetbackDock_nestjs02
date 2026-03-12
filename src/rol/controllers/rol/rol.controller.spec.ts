import { Controller, Get, Post, Body, Param, ParseIntPipe, Put, Delete, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../../entities/rol.entity/rol.entity';
import { RolDto } from '../../dtos/rol.dto/rol.dto';

@Controller('roles')
export class RolController {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  @Get()
  findAll() {
    return this.rolRepo.find();
  }

  @Post()
  create(@Body() payload: RolDto) {
    const nuevoRol = this.rolRepo.create(payload);
    return this.rolRepo.save(nuevoRol);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const rol = await this.rolRepo.findOneBy({ id });
    if (!rol) throw new NotFoundException(`Rol #${id} no encontrado`);
    return rol;
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() payload: RolDto) {
    const rol = await this.findOne(id);
    this.rolRepo.merge(rol, payload);
    return this.rolRepo.save(rol);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const rol = await this.findOne(id);
    return this.rolRepo.remove(rol);
  }
}