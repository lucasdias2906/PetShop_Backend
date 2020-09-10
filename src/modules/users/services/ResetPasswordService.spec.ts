// fazer a parte de recuperacao de senha
import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokensRepository;
let resetPassword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

// categorizando o teste, utilizando o describe, it - isso
describe('ResetPasswordService', () => {
    // isso vai ser desparado antes de cada teste
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokenRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPassword = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokenRepository,
            fakeHashProvider,
        );
    });

    it('should be able to reset password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        // fazendo a recuperacao
        await resetPassword.execute({
            password: '12345',
            token,
        });

        const updateUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('12345');
        // esperando a senha seja 12345
        expect(updateUser?.password).toBe('12345');
    });

    it('should not be able to reset the password with non-exiting token', async () => {
        await expect(
            resetPassword.execute({
                token: 'non-exiting-token',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // criando token pro usuario que nao existe
    it('should not be able to reset the password with non-exiting user', async () => {
        const { token } = await fakeUserTokenRepository.generate(
            'non-exiting-user',
        );

        await expect(
            resetPassword.execute({
                token,
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to reset password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        const { token } = await fakeUserTokenRepository.generate(user.id);

        // simulando que estamos a 2 horas no futuro
        // neste momento estamos espionando o momento em q a funcao now foi chamada
        // o mickimpletation, ele faz com que, de vez executa a funcao nativa do js ele vai executar a funcao mock, ele só vai pega o date.now como referente pra ele executar
        // ONCE que dizer somente uma vez
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            // criando uma nova data
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        // simulando que estamos fazendo o retorno reset da senha depois de 2horas de gerar o token
        await expect(
            resetPassword.execute({
                password: '12345',
                token,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
