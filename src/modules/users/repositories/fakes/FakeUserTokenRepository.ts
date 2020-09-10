import { uuid } from 'uuidv4';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
    private userTokens: UserToken[] = [];

    // gerando o token
    public async generate(user_id: string): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            user_id,
            created_at: new Date(),
            updated_at: new Date(),
        });

        this.userTokens.push(userToken);

        return userToken;
    }

    // preocurando o usuario pelo o token, e vendo se os tokens batem do que eu to recendo com o do banco
    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = this.userTokens.find(
            findToken => findToken.token === token,
        );

        return userToken;
    }
}

export default FakeUserTokensRepository;
