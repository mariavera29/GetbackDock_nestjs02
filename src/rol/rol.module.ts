import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolController } from './controllers/rol/rol.controller';
import { RolService } from './services/rol/rol.service';
import { Rol } from './entities/rol.entity/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolController],
  providers: [RolService],
  exports: [TypeOrmModule, RolService],
})
export class RolModule {}