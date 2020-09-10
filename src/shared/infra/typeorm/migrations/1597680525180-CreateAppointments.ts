import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
    TableColumn,
} from 'typeorm';

export default class CreateAppointments1597680525180
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'appointments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'provider_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'date',
                        type: 'timestamp with time zone', // aqui ele vai salvar o horario e o fuso horario daquele horario
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'appointments',
            new TableForeignKey({
                name: 'AppointmentProvider', // nome da foreignKey
                columnNames: ['provider_id'], // qual é a coluna que vai receber a chave estrageira
                referencedColumnNames: ['id'], // qula é o nome da coluna na tabela que vai representar esse providerid
                referencedTableName: 'users',
                onDelete: 'SET NULL', // OQ vai acontecer com os agendamentos quando o usuario for deletado, caso seja deletado ele vai deixar null
                onUpdate: 'CASCADE', // caso o id seja alterado, A ALTERACAO VAI REFLETIR NO SEU ALTERACAO
            }),
        );
    }

    // se acontecer algum problema, na base de dados, usamos esse metodo dom pra casa de erro, ele da um DROP(DELETAR) a nossa tabela
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');
        await queryRunner.dropColumn('appointments', 'provider_id');
        await queryRunner.addColumn(
            'appointments',
            new TableColumn({
                name: 'provider',
                type: 'varchar',
            }),
        );
    }
}
