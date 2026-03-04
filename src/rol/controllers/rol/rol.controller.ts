import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, UseGuards } from '@nestjs/common';
// Subimos dos niveles para salir de controllers/rol/
import { RolService } from '../../services/rol/rol.service';
import { RolDto } from '../../dtos/rol.dto/rol.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt.guard';

@ApiTags('roles')
@ApiBearerAuth('RSO')
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolController {
  constructor(private readonly rolService: RolService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles' })
  findAll() {
    return this.rolService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  create(@Body() payload: RolDto) {
    return this.rolService.create(payload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol existente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: Partial<RolDto>,
  ) {
    return this.rolService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un rol existente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolService.remove(id);
  }
}