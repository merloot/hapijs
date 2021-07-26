import * as nodemailer from 'nodemailer';
import {IEmailService} from "./interfaces/IEmailService";
import config from "../config/config";

export class emailService implements IEmailService {
    private _transporter: nodemailer.Transporter;
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: config.mailer.user,
                pass: config.mailer.pass
            }
        });
    }
    sendMail(to: string, subject: string, content: string): void {
        let options = {
            from: 'from_test@gmail.com',
            to: to,
            subject: subject,
            text: content
        };

        this._transporter.sendMail(
            options, (error, info) => {
                if (error) {
                    return console.log(`error: ${error}`);
                }
                console.log(`Message Sent ${info.response}`);
            });
    }
}
