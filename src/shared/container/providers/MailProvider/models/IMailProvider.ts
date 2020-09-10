// criando a interface para email
import ISendMailDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
    sendMail(data: ISendMailDTO): Promise<void>;
}
