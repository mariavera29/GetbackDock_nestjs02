import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserRolesTable1714567890000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crea la tabla de rompimiento automáticamente
        await queryRunner.query(`
            CREATE TABLE "usuarios_roles" (
                "usuario_id" integer NOT NULL,
                "rol_id" integer NOT NULL,
                CONSTRAINT "PK_usuarios_roles" PRIMARY KEY ("usuario_id", "rol_id")
            )
        `);

        // Crea las llaves foráneas
        await queryRunner.query(`
            ALTER TABLE "usuarios_roles" 
            ADD CONSTRAINT "FK_user" FOREIGN KEY ("usuario_id") 
            REFERENCES "usuarios"("id") ON DELETE CASCADE
        `);
        
        await queryRunner.query(`
            ALTER TABLE "usuarios_roles" 
            ADD CONSTRAINT "FK_rol" FOREIGN KEY ("rol_id") 
            REFERENCES "roles"("id") ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "usuarios_roles"`);
    }
}