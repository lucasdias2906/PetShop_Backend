import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUserRepository';

interface IRequest {
    user_id: string; // de qual usuario eu quero atualizar o id
}

@injectable()
class ShowProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    // atualizando usuario
    public async execute({ user_id }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('User not found');
        }

        return user;
    }
}

export default ShowProfileService;
