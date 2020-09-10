import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

// categorizando o teste, utilizando o describe, it - isso
describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    // isso deve permiti criar um novo agendamento
    it('should be able to create a new user', async () => {
        // criando o appointment
        const user = await createUser.execute({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // esperamos que o nosso appointment tenha um ID
        expect(user).toHaveProperty('id');
    });

    it('should be able to create a new user with same email from another', async () => {
        // criando o appointment
        await createUser.execute({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // esperamos que o nosso appointment tenha um ID
        await expect(
            createUser.execute({
                name: 'lucas silva',
                email: 'lucas@gmail.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
