import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AutheticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AutheticateUserService;

// categorizando o teste, utilizando o describe, it - isso
describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        createUser = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        authenticateUser = new AutheticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should be able to autheticate', async () => {
        const user = await createUser.execute({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // criando o appointment
        const response = await authenticateUser.execute({
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // esperamos que o nosso appointment tenha um token
        expect(response).toHaveProperty('token');
        // para vermos se é igual ao usuario
        expect(response.user).toEqual(user);
    });

    it('should not be able to autheticate with non existing user', async () => {
        await expect(
            authenticateUser.execute({
                email: 'lucas@gmail.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to autheticate with wrong password', async () => {
        await createUser.execute({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        await expect(
            authenticateUser.execute({
                email: 'lucas@gmail.com',
                password: 'wrong-password',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
