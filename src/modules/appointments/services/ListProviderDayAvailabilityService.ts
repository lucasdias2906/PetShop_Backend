// listar os horarios disponiveis no dia pro prestador
import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns'; // ele retorna horario de uma data/ isAfter verfica se um horario esta depois que outro

// import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    // listando os prestadores de servico, MENOS o user_id
    public async execute({
        provider_id,
        year,
        month,
        day,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                year,
                month,
                day,
            },
        );

        // vendo as horas disponiveis que temos no nosso dia
        const hourStart = 8; // a hora que vai começar os agendamentos que vai ser as 8

        const eachHourArray = Array.from(
            { length: 10 },
            (_, index) => index + hourStart,
        );

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour => {
            // verificando se ja tem algum agendamento na hora que a pessoa for marca
            const hasAppointmentInHour = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );

            const compareDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available:
                    !hasAppointmentInHour && isAfter(compareDate, currentDate), // o valor de available vai ser DIFERE do valor de hasAppointmentInHour/ a Date de hora tem que ser depois do primeiro horario de agendamento
            };
        });

        return availability;
    }
}

export default ListProviderDayAvailabilityService;
