import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import AppointmentsController from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();

appointmentsRouter.use(ensureAuthenticated); // ele vai aplicar esse middlewares em tds as rotas

// appointmentsRouter.get('/', async (req, res) => {
//     // o repositorio que tem a responsabilidade de buscar todos os dados
//     const appointment = await appointmentsRepository.find();

//     return res.json(appointment);
// });

appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
