
export interface IEmailService{

    sendMail(to: string, subject: string, content: string);
}
