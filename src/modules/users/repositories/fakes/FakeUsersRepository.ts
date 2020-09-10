import IUsersRepository from '@modules/users/repositories/IUserRepository';
import { uuid } from 'uuidv4';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.id === id);

        return findUser;
    }

    // vai preocurar um usuari onde o email seja igual ao email q estamos recebendo
    public async findByEmail(email: string): Promise<User | undefined> {
        const findUser = this.users.find(user => user.email === email);

        return findUser;
    }

    // criando um user e salvando
    public async create(userdata: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid() }, userdata);

        this.users.push(user);

        return user;
    }

    // aqui estamos vendo se ja existe o usuario aqui dentro, ai vamos subscrever no array de usuario na posicao findIdex o usuario
    public async save(user: User): Promise<User> {
        const findIndex = this.users.findIndex(
            findUser => findUser.id === user.id,
        );

        this.users[findIndex] = user;

        return user;
    }
}

export default FakeUsersRepository;
