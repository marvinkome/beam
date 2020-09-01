import Email from 'email-templates'
import path from 'path'

const email = new Email({
    views: {
        root: path.resolve(__dirname, 'templates'),
        options: { extension: 'ejs' },
    },
    message: {
        from: `The Beam team <${process.env.GMAIL_USER}>`,
    },
    transport: {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER || '',
            pass: process.env.GMAIL_PASSWORD || '',
        },
    },
    preview: false,
})

interface IEmailOptions {
    to: string
    data?: any
}
export function sendWelcomeEmail(options: IEmailOptions) {
    return email.send({
        template: 'welcome',
        message: {
            to: options.to,
            subject: 'Welcome to Beam',
        },
        locals: options.data,
    })
}
