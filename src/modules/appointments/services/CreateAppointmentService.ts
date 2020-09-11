import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe'; // inject significa que quero INJETAR nosso repositorio

import AppError from '@shared/errors/AppError';
import Appointment from '../infra/typeorm/entities/Appointments';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
/**
 * Recebimento das informaçoes
 * Trativa de erros/excessoes
 * acesso ao repositorio
 */

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable() // aqui estamos falando que essa classe ela é injetavel, que ela pode receber injecao de dependencias
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository, // aqui automaticamento ele esta deixando a varivel como privada
    ) {}

    public async execute({
        date,
        provider_id,
        user_id,
    }: IRequest): Promise<Appointment> {
        // startOfHour ele faz uma regra de negocio que os agendamentos ele só vao poder ser de hora em hora
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (findAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        const appointment = await this.appointmentsRepository.create({
            provider_id,
            user_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
