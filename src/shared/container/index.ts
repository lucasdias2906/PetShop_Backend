// controle de dependencias
import { container } from 'tsyringe';
import '@modules/users/providers';
import './providers';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UsersTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

// 1º qual é o id nome que eu vou dar pra chamar quando eu precisa da dependencia, type que usamos vai garantir que essa variavel que estamos passando como segundo parametro tem exatamente o mesmo formato da variavel de tipagem que é a IAppointmentRep
// registerSingleton e nao usamos o register, pq o register td vez que um arquivo precisar da dependencia, ele sempre vai criar um nova classe, registerSingleton ele vai extanciar a classe somente uma vez durante td o ciclo de vida da nossa aplicacao
container.registerSingleton<IAppointmentRepository>(
    'AppointmentsRepository',
    AppointmentsRepository,
);

container.registerSingleton<IUserRepository>(
    'UsersRepository',
    UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
    'UsersTokensRepository',
    UsersTokensRepository,
);
