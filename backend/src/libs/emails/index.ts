import Email from 'email-templates'
import path from 'path'

const email = new Email({
    views: {
        root: path.resolve(__dirname, 'templates'),
        options: { extension: 'ejs' },
    },
    message: {
        from: `Beam <${process.env.GMAIL_USER}>`,
    },
    transport: {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER || '',
            pass: process.env.GMAIL_PASSWORD || '',
        },
    },
    preview: false,
    send: true,
})

// emails
interface IEmailOptions {
    to: string | string[]
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

export function sendJoinGroupEmail(options: IEmailOptions) {
    return email.send({
        template: 'joinGroup',
        message: {
            to: options.to,
            subject: `Someone just joined ${options.data.groupName}`,
        },
        locals: options.data,
    })
}

export function sendNewMessageEmail(options: IEmailOptions) {
    return email.send({
        template: 'newMessage',
        message: {
            to: options.to,
            subject: `${options.data.friendName} sent you a message on Beam`,
        },
        locals: options.data,
    })
}

export function sendInviteEmail(options: IEmailOptions) {
    return email.send({
        template: 'invite',
        message: {
            to: options.to,
            subject: `Someone invited you to chat`,
        },
        locals: options.data,
    })
}
