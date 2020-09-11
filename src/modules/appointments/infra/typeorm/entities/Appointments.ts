import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'; // Entity que vamos salvar algo dentro do nosso banco de dados

import User from '@modules/users/infra/typeorm/entities/User';

// decoretors
@Entity('appointments') // aqui estamos indicando que toda vez que for salvo e alterado, vai ser salvo dentro da tabela APPOINTMENTS dentro da nossa DB
class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider_id: string;

    // MUITOS agendamentos para UM usuario
    @ManyToOne(() => User)
    @JoinColumn({ name: 'provider_id' }) // qual é a coluna que vai identificar o prestador desse agendamento
    provider: User;

    @Column()
    user_id: string;

    // relacionamento dentro do JS
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' }) // qual é a coluna que vai identificar o prestador desse agendamento
    user: User;

    @Column('time with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Appointment;
