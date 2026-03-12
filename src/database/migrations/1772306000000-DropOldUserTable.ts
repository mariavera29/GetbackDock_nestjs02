import { MigrationInterface, QueryRunner } from "typeorm";

export class DropOldUserTable1772306000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Si necesitas revertir, aquí iría la recreación, pero no es necesario
        // ya que "usuarios" es la tabla correcta
    }

}
