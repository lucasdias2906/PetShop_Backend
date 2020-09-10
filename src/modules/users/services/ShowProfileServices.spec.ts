// import AppError from '@shared/errors/AppError';

import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileServices';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

// categorizando o teste, utilizando o describe, it - isso
describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfileService = new ShowProfileService(fakeUsersRepository);
    });
    // listando o usuario
    it('should be able show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'lucas silva',
            email: 'lucas@gmail.com',
            password: '123123',
        });

        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        // esperamos que o nosso appointment tenha um ID
        expect(profile.name).toBe('lucas silva');
        expect(profile.email).toBe('lucas@gmail.com');
    });

    // tentar listar um usuario que nao existe
    it('should be able show the profile from non-existing user', async () => {
        expect(
            showProfileService.execute({
                user_id: 'non-existing-user-id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
