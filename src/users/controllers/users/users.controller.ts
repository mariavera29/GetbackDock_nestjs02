import { Controller, Post, Body, Get, Param, Put, Patch, Delete } from '@nestjs/common';
import { UsersService } from '../../services/users/users.service';
import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.patch(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch(':id/estado/:estado')
  cambiarEstado(
    @Param('id') id: string, 
    @Param('estado') estado: 'ACTIVO' | 'INACTIVO'  // ← Corregido aquí
  ) {
    return this.usersService.cambiarEstado(+id, estado);
  }

  @Get('correo/:correo')
  findByEmail(@Param('correo') correo: string) {
    return this.usersService.findByEmail(correo);
  }
}