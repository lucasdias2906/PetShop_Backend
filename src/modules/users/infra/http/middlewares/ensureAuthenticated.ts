// Esse arquivo vai verificar se o usuario esta realmente authenticado na nossa aplicacao
import { Request, Response, NextFunction } from 'express';

import { verify } from 'jsonwebtoken';

import authConfig from '../../../../../config/auth';

import AppError from '../../../../../shared/errors/AppError';

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    // Validacao do token JWT

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT token is missing', 401);
    }

    // Bearer ksdjlsdjlsjdlsjds

    // aqui ele vai dividir em dois espacos, o Bearer "ESPACO" token, entao vai ficar ' Bearer TOKEN'
    // só a virgula significa que nao queros passar a primeira posicao do array
    const [, token] = authHeader.split(' ');

    // verficando se o token existe
    try {
        const decoded = verify(token, authConfig.jwt.secret);

        // aqui iremos força a variavel Decoded a ter um formato/tipo, só utilizarmos o AS
        const { sub } = decoded as ITokenPayload;

        // aqui adicionamos o user nas tipagens do express na nossa aplicacao
        req.user = {
            id: sub,
        };

        return next();
    } catch (err) {
        throw new AppError('Invalid JWT token', 401);
    }
}
