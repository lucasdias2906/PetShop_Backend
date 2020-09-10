import IHashProvider from '../models/IHashProvider';

class FakeHashProvider implements IHashProvider {
    // criptografando a senha, o segundo parametro é o tamanho da senha que vai ser de 8
    public async generateHash(payload: string): Promise<string> {
        return payload;
    }

    public async compareHash(
        payload: string,
        hashed: string,
    ): Promise<boolean> {
        // compararando uma senha nao cript com uma senha ja cripto, para ver se é a mesma senha
        return payload === hashed;
    }
}

export default FakeHashProvider;
