import { Router } from 'express';

import ProfileController from '../controllers/ProfileController';

import ensureAuthenticatedUser from '../middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticatedUser);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;
