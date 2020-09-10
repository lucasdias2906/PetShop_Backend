import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

// categorizando o teste, utilizando o describe, it - isso
describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();

        updateUserAvatar = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );
    });
    // isso deve permiti criar um novo agendamento
    it('should be able to create a new user', async () => {
        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // criando o avatar
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        // esperamos que o nosso appointment tenha um ID
        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should be able to update avatar from non existing user', async () => {
        // criando o avatar

        await expect(
            updateUserAvatar.execute({
                user_id: 'non-existing-user',
                avatarFilename: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {
        // metodo que quero espionar na nossa aplicacao, e assim conseguimos sabe se ela foi desparada
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        // criando o avatar
        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar.jpg',
        });

        await updateUserAvatar.execute({
            user_id: user.id,
            avatarFilename: 'avatar2.jpg',
        });

        // toHaveBeenCalledWith espero que essa funcao tenha sido chamada com um paramentro especifico, ai passamos o "avatar.jpg" como paramentro, pq esperamos que ela seja deletada, pq é o arquivo anterior, assim o avatar2 vai ser o novo arquivo do usuario
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

        // esperamos que o nosso appointment tenha um ID
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
