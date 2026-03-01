import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersRol1772305463534 implements MigrationInterface {
    name = 'UsersRol1772305463534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "descripcion" text, CONSTRAINT "UQ_a5be7aa67e759e347b1c6464e10" UNIQUE ("nombre"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "apellido" character varying NOT NULL, "telefono" character varying, "direccion" character varying, "correo" character varying NOT NULL, "clave" character varying NOT NULL, "foto" character varying, "hora_inicio" TIME, "hora_fin" TIME, "fecha" date, "estado" character varying NOT NULL DEFAULT 'ACTIVO', CONSTRAINT "UQ_63665765c1a778a770c9bd585d3" UNIQUE ("correo"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios_roles" ("usuario_id" integer NOT NULL, "rol_id" integer NOT NULL, CONSTRAINT "PK_1213eb778bfb72e49cdf8a25da3" PRIMARY KEY ("usuario_id", "rol_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2c14b9e5e2d0cf077fa4dd3350" ON "usuarios_roles" ("usuario_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_425dfd009aeeee0c08af9a67a3" ON "usuarios_roles" ("rol_id") `);
        await queryRunner.query(`ALTER TABLE "usuarios_roles" ADD CONSTRAINT "FK_2c14b9e5e2d0cf077fa4dd33502" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "usuarios_roles" ADD CONSTRAINT "FK_425dfd009aeeee0c08af9a67a37" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios_roles" DROP CONSTRAINT "FK_425dfd009aeeee0c08af9a67a37"`);
        await queryRunner.query(`ALTER TABLE "usuarios_roles" DROP CONSTRAINT "FK_2c14b9e5e2d0cf077fa4dd33502"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_425dfd009aeeee0c08af9a67a3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2c14b9e5e2d0cf077fa4dd3350"`);
        await queryRunner.query(`DROP TABLE "usuarios_roles"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
