import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
// Subimos dos niveles (../../) para salir de controllers/users/
import { UsersService } from '../../services/users/users.service';
import { CreateUserDto } from '../../dtos/user.dto';

@Controller('usuarios')
export class UsersController {
  constructor(private readonly usuariosService: UsersService) {}

  @Post()
  async crear(@Body() body: CreateUserDto) {
    // Usamos el método 'create' que definimos en el Service
    return this.usuariosService.create(body);
  }

  @Get()
  async findAll() {
    // Usamos 'findAll' del Service
    return this.usuariosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // Usamos 'findOne' del Service
    return this.usuariosService.findOne(id);
  }
}