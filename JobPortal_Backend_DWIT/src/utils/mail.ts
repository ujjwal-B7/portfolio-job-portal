//@ts-nocheck
import * as nodeMailer from 'nodemailer';
// import { password, username } from './constant';

interface SendEmailProps {
  email: string;
  subject: string;
  html: any;
}

export const sendEmail = async (options: SendEmailProps) => {
  const transporter = nodeMailer.createTransport({
    // Will be changed in production
    service: 'gmail',
    host: process.env.HOST as string,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD,
    },
  });
  // console.log('Reached mail function', options.email, options.resetPasswordUrl);

  await transporter.sendMail({
    from: process.env.MAIL, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    // text: options.resetPasswordUrl,
    html: options.html,
  });
};
