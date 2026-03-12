import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Verifica que el archivo se llame users.controller.ts (plural)
import { UsersController } from './controllers/users/users.controller'; 
import { UsersService } from './services/users/users.service';
import { User } from './entities/user.entity'; // Se llama User, no Usuario
import { Rol } from '../rol/entities/rol.entity/rol.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Rol]),
  ],
  controllers: [UsersController], 
  providers: [UsersService],
  exports: [UsersService] 
})
export class UsersModule {}