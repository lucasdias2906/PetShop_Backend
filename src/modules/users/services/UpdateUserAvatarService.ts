import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUserRepository';

interface IRequest {
    user_id: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarServices {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated users can change avatar',
                401,
            );
        }

        // deletar avatar anterior antes de salvar o novo avatar
        if (user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        const filename = await this.storageProvider.saveFile(avatarFilename);

        user.avatar = filename;

        // metodo save ele serve quanto para criar quanto pra salvar
        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarServices;
