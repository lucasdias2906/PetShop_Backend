import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
    public async create(req: Request, res: Response): Promise<Response> {
        const { provider_id, date } = req.body;

        // criando uma data nova
        // parseISO ele tranforma o dado que esta vindo em string para data
        const parsedDate = parseISO(date);

        // container.resolve ele vai carregar nosso server vai ver no constructor dele e vai
        // ver se ele esta precisando de qualquer dependencia ai ele vai la no container e vai
        // ver se tem uma dependecia cadastrada, ai ele retorna uma extancia da classe, tudo de forma automatica
        const createAppointment = container.resolve(CreateAppointmentService);

        // aqui vamos passar os paramentros para crirar um agendamento
        const appointment = await createAppointment.execute({
            date: parsedDate,
            provider_id,
        });

        return res.json(appointment);
    }
}
