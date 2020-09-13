import User, { IUser } from '@models/users'
import jwt from 'express-jwt'
import { IContext } from 'src/graphql'
import { Request } from 'express'
import { verify, sign } from 'jsonwebtoken'

export function generateToken(user: IUser) {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60) // expires in 60 days

    return sign(
        {
            email: user.email,
            id: user._id,
            exp: expirationDate.getTime() / 1000,
        },
        process.env.APP_KEY || ''
    )
}

export function getTokenFromHeaders(req: Request) {
    const auth = req.headers.authorization

    if (auth && auth.split(' ')[0] === 'Bearer') {
        return auth.split(' ')[1]
    }

    return null
}

export async function getUserFromToken(token: string): Promise<IUser | null> {
    // decode token
    let payload: any = null
    try {
        payload = verify(token, process.env.APP_KEY || '')
    } catch (e) {
        return null
    }

    // get user
    return await User.findById((payload as any).id)
}

export function authenticated(next: (...args: any[]) => any) {
    return (root: any, args: any, context: IContext, info: any) => {
        if (!context.currentUser) {
            throw new Error('Unauthenticated')
        }

        return next(root, args, context, info)
    }
}

export default {
    required: jwt({
        secret: process.env.APP_KEY || '',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: process.env.APP_KEY || '',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
}
