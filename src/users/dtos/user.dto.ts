import { IsString, IsEmail, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString() nombre: string;
  @IsString() apellido: string;
  @IsEmail() correo: string;
  @IsString() clave: string;
  
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() direccion?: string;
  @IsOptional() @IsString() foto?: string;
  @IsOptional() @IsString() horaInicio?: string;
  @IsOptional() @IsString() horaFin?: string;
  @IsOptional() @IsString() fecha?: string;
  
  @IsArray()
  @IsNumber({}, { each: true })
  rolesIds: number[]; // IDs de los roles a vincular
}