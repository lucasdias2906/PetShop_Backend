import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';

const providersRoutes = Router();
const providersController = new ProvidersController();

providersRoutes.use(ensureAuthenticated); // ele vai aplicar esse middlewares em tds as rotas

providersRoutes.get('/', providersController.index);

export default providersRoutes;
