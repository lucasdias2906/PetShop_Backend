import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import UsersController from '../controllers/UsersController';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticatedUser from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const upload = multer(uploadConfig);

usersRouter.post('/', usersController.create);

// atualizando o avatar
usersRouter.patch(
    '/avatar',
    ensureAuthenticatedUser,
    upload.single('avatar'),
    userAvatarController.update,
);

export default usersRouter;
