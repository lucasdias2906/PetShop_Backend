// Upload de imagem
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp'); // onde vamos salvar as imagens

export default {
    tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, 'uploads'),

    storage: multer.diskStorage({
        destination: tmpFolder,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString('hex'); // aqui ele vai gerar um aquivo de 10 bytes
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
};
