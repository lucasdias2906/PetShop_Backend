import { getRepository, Repository } from 'typeorm';

import IUsersTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../entities/UserToken';

class UsersTokensRepository implements IUsersTokensRepository {
    private ormRepository: Repository<UserToken>; // o repositorio vai usar a  entidade de User token

    constructor() {
        // assim que o repositorio for carregado
        this.ormRepository = getRepository(UserToken);
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.ormRepository.findOne({
            where: { token },
        });

        return userToken;
    }

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({
            user_id,
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }
}

export default UsersTokensRepository;
