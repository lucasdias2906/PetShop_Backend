// armazenando os tokens gerado de recuperacao de senha
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Generated,
} from 'typeorm'; // Entity que vamos salvar algo dentro do nosso banco de dados

@Entity('user_tokens') // aqui estamos indicando que toda vez que for salvo e alterado, vai ser salvo dentro da tabela APPOINTMENTS dentro da nossa DB
class UserToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Generated('uuid')
    token: string;

    @Column()
    user_id: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default UserToken;
