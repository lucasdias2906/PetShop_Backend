import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokensRepository {
    // recendo o id do usuario que eu quero gerar esse token
    generate(user_id: string): Promise<UserToken>;
    findByToken(token: string): Promise<UserToken | undefined>;
}
