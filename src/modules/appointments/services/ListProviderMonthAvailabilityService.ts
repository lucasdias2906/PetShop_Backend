// listar a disponibilidade de um mes
import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns'; // ele retorna extamente quantos dias tem no mes

// import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    // listando os prestadores de servico, MENOS o user_id
    public async execute({
        provider_id,
        year,
        month,
    }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
            {
                provider_id,
                year,
                month,
            },
        );

        // ver quantos dias tem no mes
        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        // aqui estamos CRIANDO um array, o tamanho do array vai ser a quantidades de dias do mes, index +1 colocamos pq o mes nao começa com 0, entao ele vai contar sempre +1
        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        // verificando se existe algum agendamento no dia especifico
        const availability = eachDayArray.map(day => {
            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });

            return {
                day,
                available: appointmentsInDay.length < 10,
            };
        });

        return availability;
    }
}

export default ListProviderMonthAvailabilityService;
