import Appointment from '../infra/typeorm/entities/Appointments';
import ICreateAppointment from '../dtos/ICreateAppointmentDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointment): Promise<Appointment>;
    findByDate(date: Date): Promise<Appointment | undefined>;
}
