import AppError from '@shared/errors/AppError';
import FakeAppointmentesRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentesRepository: FakeAppointmentesRepository;
let createAppointment: CreateAppointmentService;

// categorizando o teste, utilizando o describe, it - isso
describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentesRepository = new FakeAppointmentesRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentesRepository,
        );
    });

    // isso deve permiti criar um novo agendamento
    it('should be able to create a new appointment', async () => {
        // criando o appointment
        const appointment = await createAppointment.execute({
            date: new Date(),
            provider_id: '123123',
        });

        // esperamos que o nosso appointment tenha um ID
        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123123');
    });

    // nao permiti que os agendamento seja no mesmo horario
    it('should not be able to create two appointment on the same time', async () => {
        const appointmentDate = new Date(2020, 4, 11);

        // criando o appointment
        await createAppointment.execute({
            date: appointmentDate,
            provider_id: '123123',
        });

        // esperando q essa funcao ela rejeite e retorne um erro e o erro seja uma extancia de AppError

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                provider_id: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
