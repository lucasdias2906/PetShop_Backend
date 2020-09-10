import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm'; // Entity que vamos salvar algo dentro do nosso banco de dados

@Entity('users') // aqui estamos indicando que toda vez que for salvo e alterado, vai ser salvo dentro da tabela APPOINTMENTS dentro da nossa DB
class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    avatar: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default User;
