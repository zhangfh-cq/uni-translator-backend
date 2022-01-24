import nodemailer from 'nodemailer';
import { EMAIL } from '../config/Config';

const mailer = nodemailer.createTransport({
    host: EMAIL.HOST,
    port: EMAIL.PORT,
    secure: EMAIL.SECURE,
    auth: {
        user: EMAIL.USER,
        pass: EMAIL.PASS
    }
});

export default mailer;