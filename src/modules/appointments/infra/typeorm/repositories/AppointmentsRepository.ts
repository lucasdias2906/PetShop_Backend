// raw é quando queremos escrever uma condicao para o campo no formato de texto que vai diretamente passado para o postgress, nao vai ser interpretado para o typeorm como fosse um query sql
import { getRepository, Repository, Raw } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '../entities/Appointments';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>; // o repositorio vai usar a  entidade de appointment

    constructor() {
        // assim que o repositorio for carregado
        this.ormRepository = getRepository(Appointment);
    }

    // parametro de uma tipagem, parametro Appointment
    // ele vai enconstrar um por data, Aqui vamos ver se o retorno vai ser Appointment ou NULL
    // usamos o implements IAppointmentsRepository pq se um dia fomos usar outro banco de dados, vamos implementar, e vai ficar desse mesmo jeito usando outro banco de dados
    // usamos o L de SOLID que é o Liskov Substitution Principle que diz que nossas camada com outras bibliotecas que é possivel ter essas informacoes definindo um conjunto de regras para elas,indicando que nossas services vai depeder apenas de uma regra de repositorio
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        // retorno da Promise vai ser <Appointment ou NULL>

        const findAppointment = await this.ormRepository.findOne({
            // aqui fizemos um query para verificar se tem um agendamento na mesma data usando SQL
            where: { date },
        });

        return findAppointment;
    }

    // encontrando varios
    public async findAllInMonthFromProvider({
        provider_id,
        month,
        year,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0'); // colocando o 0 a esquerda no mes, entao vai ficar 01, 02,....

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }

    public async findAllInDayFromProvider({
        provider_id,
        month,
        day,
        year,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0'); // colocando o 0 a esquerda no mes, entao vai ficar 01, 02,....

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }

    // criando um appointment e salvando
    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            provider_id,
            date,
            user_id,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
