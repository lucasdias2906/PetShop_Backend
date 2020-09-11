import { getRepository, Repository, Not } from 'typeorm';
import IUsersRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

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

    // filtrando os prestadores de servicos, que nem fizmos na repository de USER Porem de outra forma
    public async findAllProviders({
        expept_user_id,
    }: IFindAllProvidersDTO): Promise<User[]> {
        let users: User[];

        if (expept_user_id) {
            users = await this.ormRepository.find({
                where: {
                    id: Not(expept_user_id),
                },
            });
        } else {
            users = await this.ormRepository.find();
        }

        return users;
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
