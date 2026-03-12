import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToMany, 
  JoinTable 
} from 'typeorm';
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

  @Column({ type: 'varchar', nullable: true, name: 'hora_inicio' }) // ← CORREGIDO
  horaInicio?: string;

  @Column({ type: 'varchar', nullable: true, name: 'hora_fin' }) // ← CORREGIDO
  horaFin?: string;

  @Column({ type: 'varchar', nullable: true, name: 'fecha' })
  fecha?: string;

  @Column({ type: 'varchar', default: 'ACTIVO' })
  estado: string;

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