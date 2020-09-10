import { getRepository, Repository } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>; // o repositorio vai usar a  entidade de user

    constructor() {
        // assim que o repositorio for carregado
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne(id);

        return user;
    }

    // vai preocurar um usuari onde o email seja igual ao email q estamos recebendo
    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({ where: { email } });

        return user;
    }

    // criando um appointment e salvando
    public async create(userdata: ICreateUserDTO): Promise<User> {
        const appointment = this.ormRepository.create(userdata);

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UsersRepository;
