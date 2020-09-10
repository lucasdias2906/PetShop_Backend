// fazer a parte de recuperacao de senha
import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokenRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokenRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

// categorizando o teste, utilizando o describe, it - isso
describe('SendForgotPasswordEmail', () => {
    // isso vai ser desparado antes de cada teste
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokenRepository = new FakeUserTokensRepository();

        sendForgotPasswordEmail = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokenRepository,
        );
    });

    it('should be able to recover the password using the email', async () => {
        // esperamos que o metodo/funcao SendMail tenha sido enviado
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // fazendo a recuperacao
        await sendForgotPasswordEmail.execute({
            email: 'lucas@gmail.com',
        });

        // esperando que o metodo sendMail tenha sido enviado
        expect(sendMail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {
        // esperando que o metodo sendMail tenha sido enviado
        await expect(
            sendForgotPasswordEmail.execute({
                email: 'lucas@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        // esperamos que o metodo/funcao SendMail e generate  tenha sido enviado
        const generateToken = jest.spyOn(fakeUserTokenRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // fazendo a recuperacao
        await sendForgotPasswordEmail.execute({
            email: 'lucas@gmail.com',
        });

        // esperando que o metodo sendMail tenha sido enviado
        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
