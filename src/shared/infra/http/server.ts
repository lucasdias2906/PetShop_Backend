import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors'; // usando para tratar os erros

import routes from './routes';
import uploadConfig from '../../../config/upload';
import AppError from '../../errors/AppError';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);
// a trativa dos erro SEMPRE tem que ser depois das rotas
// no _:Nextfunction nao esta erro pq eu configurei o ESLINT pra quando eu colocar o _ ele nao der erro, significa que nao quero usar aquele parametro
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
    // aqui estamos validadno se for um error originalizado pela a nossa aplicacao, caso for ele vai retornar aquiele json
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    // se for um erro que nos nao conhecemos, um erro que nos nao estavamos esperando
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

app.listen(3333, () => {
    console.log('server started on port 3333');
});
