import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Rol } from '../../rol/entities/rol.entity/rol.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  apellido: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'varchar', nullable: true })
  direccion: string;

  @Column({ type: 'varchar', unique: true })
  correo: string;

  @Column({ type: 'varchar' })
  clave: string;

  @Column({ type: 'varchar', nullable: true })
  foto: string;

  @Column({ type: 'time', name: 'hora_inicio', nullable: true })
  horaInicio: string;

  @Column({ type: 'time', name: 'hora_fin', nullable: true })
  horaFin: string;

  @Column({ type: 'date', nullable: true })
  fecha: string;

  @Column({ type: 'varchar', default: 'ACTIVO' })
  estado: string;

  // Relación Muchos a Muchos (Línea 43 corregida)
  @ManyToMany(() => Rol, (rol) => rol.usuarios, {
    cascade: true,
    eager: true,
  })
  @JoinTable({
    name: 'usuarios_roles',
    joinColumn: {
      name: 'usuario_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'rol_id',
      referencedColumnName: 'id',
    },
  })
  roles: Rol[];
}