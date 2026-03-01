import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
// Subimos dos niveles para salir de controllers/rol/
import { RolService } from '../../services/rol/rol.service';
import { RolDto } from '../../dtos/rol.dto/rol.dto';

@Controller('roles')
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  findAll() {
    return this.rolService.findAll();
  }

  @Post()
  create(@Body() payload: RolDto) {
    return this.rolService.create(payload);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.findOne(id);
  }
}