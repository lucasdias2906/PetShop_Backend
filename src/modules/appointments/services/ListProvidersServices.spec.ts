// import AppError from '@shared/errors/AppError';

// import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

// categorizando o teste, utilizando o describe, it - isso
describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        listProvidersService = new ListProvidersService(fakeUsersRepository);
    });
    // listando o usuario
    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'lucas sousa',
            email: 'lucassousa@gmail.com',
            password: '123123',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'lucas dias',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        // esperamos que o nosso provider sejam um array contendo os dois primieros users
        expect(providers).toEqual([user1, user2]);
    });
});
