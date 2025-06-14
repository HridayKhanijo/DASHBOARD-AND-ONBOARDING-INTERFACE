import nodemailer from 'nodemailer';
import { createTransport } from 'nodemailer';
import { fileURLToPath } from 'url';
import path from 'path';
import ejs from 'ejs';
import fs from 'fs';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readFile = promisify(fs.readFile);

// Create a test account if in development
let transporter;


if (process.env.NODE_ENV === 'production') {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });
} else {
  // Dynamically generate Ethereal test account
  const testAccount = await nodemailer.createTestAccount();

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
    logger: true,
    debug: true,
  });

  console.log('Ethereal test account created!');
  console.log('Login:', testAccount.user);
  console.log('Password:', testAccount.pass);
}


// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Error verifying email configuration:', error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

// Compile email templates
const compileTemplate = async (templateName, data) => {
  try {
    const templatePath = path.join(
      __dirname,
      '..',
      'views',
      'emails',
      `${templateName}.ejs`
    );

    const template = await readFile(templatePath, 'utf-8');
    return ejs.render(template, data);
  } catch (error) {
    console.error('Error compiling email template:', error);
    throw new Error('Failed to compile email template');
  }
};

// Send email function
export const sendEmail = async (options) => {
  try {
    const { email, subject, template, context } = options;

    // If in development, log the email instead of sending
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n--- EMAIL NOTIFICATION ---');
      console.log('To:', email);
      console.log('Subject:', subject);
      console.log('Context:', context);
      console.log('Template:', template);
      console.log('-------------------------\n');
      return { message: 'Email logged (not sent in development)' };
    }

    // Compile email template
    const html = await compileTemplate(template, context);

    // Define email options
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject,
      html,
      text: html.replace(/<[^>]*>?/gm, ''), // Convert HTML to plain text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return { message: 'Email sent successfully', messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

// Example email templates (for reference)
const emailTemplates = {
  WELCOME: 'welcome',
  PASSWORD_RESET: 'password-reset',
  EMAIL_VERIFICATION: 'email-verification',
  PASSWORD_CHANGED: 'password-changed',
  ACCOUNT_UPDATED: 'account-updated',
};

export default { sendEmail, emailTemplates };
