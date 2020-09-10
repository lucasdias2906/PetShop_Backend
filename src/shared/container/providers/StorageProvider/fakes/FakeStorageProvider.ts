// inves de salvar no disco ele só vai salvar em um array
// salvando as imagem em nosso disco
import IStorageProvider from '../models/IStorageProvider';

// colocando o arquivos em uma nova pasta, movendo pra pasta upload
class DiskStorageProvider implements IStorageProvider {
    private storage: string[] = [];

    public async saveFile(file: string): Promise<string> {
        this.storage.push(file);
        return file;
    }

    // deletando o arquivo
    public async deleteFile(file: string): Promise<void> {
        const findIndex = this.storage.findIndex(
            storageFile => storageFile === file,
        );

        // vamos deletar uma infomacao a partir da posicao findIndex
        this.storage.splice(findIndex, 1);
    }
}

export default DiskStorageProvider;
