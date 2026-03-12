import { DataSource } from 'typeorm';
import config from '../config';
import * as dotenv from 'dotenv';
import { enviroments } from '../enviroments';
import { join } from 'path';

// IMPORTA TUS ENTIDADES REALES AQUÍ
import { User } from '../users/entities/user.entity'; 
import { Rol } from '../rol/entities/rol.entity/rol.entity';

const envFile = enviroments[process.env.NODE_ENV as keyof typeof enviroments] || enviroments.dev;
dotenv.config({ path: envFile });
const configuration = config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configuration.dataBase.host,
  port: configuration.dataBase.port,
  username: configuration.dataBase.user,
  password: configuration.dataBase.password,
  database: configuration.dataBase.name,
  synchronize: false, // Esto creará solo lo que esté en 'entities'
  logging: true,
  // CAMBIA LA LÍNEA DE ABAJO POR ESTA:
  entities: [User, Rol], 
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});