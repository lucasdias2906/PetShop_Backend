import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateProfileProfile from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileProfile: UpdateProfileProfile;

// categorizando o teste, utilizando o describe, it - isso
describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();

        updateProfileProfile = new UpdateProfileProfile(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });
    // isso deve permiti criar um novo agendamento
    it('should be able update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // criando o avatar
        const updateUser = await updateProfileProfile.execute({
            user_id: user.id,
            name: 'lucas Dias Silva',
            email: 'lucaaasss@gmail.com',
        });

        expect(updateUser.name).toBe('lucas Dias Silva');
        expect(updateUser.email).toBe('lucaaasss@gmail.com');
    });

    it('should be able to change to another user email', async () => {
        await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'test@gmail.com',
            password: '123123',
        });

        // criando o avatar
        await expect(
            updateProfileProfile.execute({
                user_id: user.id,
                name: 'lucas joe ',
                email: 'lucas@gmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // criando o avatar
        const updateUser = await updateProfileProfile.execute({
            user_id: user.id,
            name: 'lucas Dias Silva',
            email: 'lucaaasss@gmail.com',
            old_password: '123123', // senha antiga
            password: '122212', // senha nova
        });

        expect(updateUser.password).toBe('122212');
    });

    // atualizando a senha sem mandar a senha antiga, no caso vai dar erro no teste
    it('should not be able update the password without old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // criando o avatar
        await expect(
            updateProfileProfile.execute({
                user_id: user.id,
                name: 'lucas Dias Silva',
                email: 'lucaaasss@gmail.com',
                password: '122212', // senha nova
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    // usuario querendo atualizar a nova senha porem colocando a senha antiga de forma errada
    it('should not be able update the password without wrong old password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // criando o avatar
        await expect(
            updateProfileProfile.execute({
                user_id: user.id,
                name: 'lucas Dias Silva',
                email: 'lucaaasss@gmail.com',
                old_password: 'wrong-old-password', // informando a senha antiga porem errada
                password: '122212', // senha nova
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
