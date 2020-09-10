// salvando as imagem em nosso disco
import fs from 'fs';
import path from 'path';
import uploadConfig from '@config/upload';

import IStorageProvider from '../models/IStorageProvider';

// colocando o arquivos em uma nova pasta, movendo pra pasta upload
class DiskStorageProvider implements IStorageProvider {
    public async saveFile(file: string): Promise<string> {
        await fs.promises.rename(
            path.resolve(uploadConfig.tmpFolder, file),
            path.resolve(uploadConfig.uploadsFolder, file),
        );

        return file;
    }

    // deletando o arquivo
    public async deleteFile(file: string): Promise<void> {
        const filePath = path.resolve(uploadConfig.uploadsFolder, file);

        // verificando se o arquivo existe
        try {
            // o stat ele tras informacoes sobre o arquivo
            await fs.promises.stat(filePath);
        } catch {
            return;
        }
        // forma de deletar o arquivo caso ele existir
        await fs.promises.unlink(filePath);
    }
}

export default DiskStorageProvider;
