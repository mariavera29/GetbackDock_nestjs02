import { Module } from '@nestjs/common';
import { RolController } from './controllers/rol/rol.controller';
import { RolService } from './rol.service';
import { ServicesService } from './services/services.service';

@Module({
  controllers: [RolController],
  providers: [RolService, ServicesService]
})
export class RolModule {}
