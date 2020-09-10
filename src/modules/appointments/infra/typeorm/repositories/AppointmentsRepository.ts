import { getRepository, Repository } from 'typeorm';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
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

    // criando um appointment e salvando
    public async create({
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({ provider_id, date });

        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
