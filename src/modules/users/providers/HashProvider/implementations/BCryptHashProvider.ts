// uma biblioteca ou uma forma da gente implementar a questao de hash
import { hash, compare } from 'bcryptjs';

import IHashProvider from '../models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
    // criptografando a senha, o segundo parametro é o tamanho da senha que vai ser de 8
    public async generateHash(payload: string): Promise<string> {
        return hash(payload, 8);
    }

    public async compareHash(
        payload: string,
        hashed: string,
    ): Promise<boolean> {
        // compararando uma senha nao cript com uma senha ja cripto, para ver se é a mesma senha
        return compare(payload, hashed);
    }
}

export default BCryptHashProvider;
