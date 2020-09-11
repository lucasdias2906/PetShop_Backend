// import AppError from '@shared/errors/AppError';

// import AppError from '@shared/errors/AppError';
import FakeAppointmentesRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentesRepository: FakeAppointmentesRepository;

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

// categorizando o teste, utilizando o describe, it - isso
describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentesRepository = new FakeAppointmentesRepository();

        listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
            fakeAppointmentesRepository,
        );
    });
    // listando o usuario
    it('should be able to list the month availability from provider', async () => {
        // criando os agendamentos
        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 8, 0, 0), // construcao date do js, (ano, mes(janeiro é o 0), dia, hora, minuto, seg)
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 9, 0, 0),
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 10, 0, 0),
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 11, 0, 0),
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 12, 0, 0),
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 13, 0, 0),
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 16, 0, 0),
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 20, 17, 0, 0),
        });

        await fakeAppointmentesRepository.create({
            provider_id: 'user',
            user_id: 'user',
            date: new Date(2020, 4, 21, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailability.execute({
            provider_id: 'user',
            year: 2020,
            month: 5,
        });

        // espero que seja um array, iremos ver se ta com available false, vai ser false pq foi o dia que eu marquei o agendamento
        // o expect.arrayContaining ele vai ver se essa resposta é um array contendo aquilo que vou passar la dentro
        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ]),
        );
    });
});
