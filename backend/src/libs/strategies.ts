import { OAuth2Strategy as GoogleStrategy, IOAuth2StrategyOption } from 'passport-google-oauth'
import { Strategy as GoogleTokenStrategy } from 'passport-google-token'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import FacebookTokenStrategy from 'passport-facebook-token'
import User from '@models/users'
import passport from 'passport'
import { registerSetup } from './setup'

type ResolverOptions = {
    authType: 'googleId' | 'facebookId' | 'twitterId'
    profile: {
        id: string
        email: string
        name: string
        picture: string
    }
    done: (error: any, user?: any, msg?: { message: string }) => void
}
async function resolveUser({ profile, done, authType }: ResolverOptions) {
    let user = await User.findOne({ [authType]: profile.id })

    if (user) {
        return done(null, user)
    }

    // check if user already registered
    user = await User.findOne({ email: profile.email })
    if (user) {
        return done(null, false, {
            message: 'An account already exists with this email',
        })
    }

    // register user if user doesn't exist
    user = new User({
        email: profile.email,
        [authType]: profile.id,
        profile: {
            name: profile.name,
            picture: profile.picture,
        },
    })

    await user.save()

    // send welcome email
    await registerSetup(user)
    return done(null, user)
}

// Google
const googleOptions: IOAuth2StrategyOption = {
    clientID: process.env.GOOGLE_ID || '',
    clientSecret: process.env.GOOGLE_SECRET || '',
    callbackURL: '/auth/google/callback',
}
const googleStrategy = new GoogleStrategy(googleOptions, async (_, __, profile, done) => {
    const email = profile.emails ? profile.emails[0].value : ''
    await resolveUser({
        authType: 'googleId',
        done,
        profile: {
            id: profile.id,
            email,
            name: profile.displayName,
            picture: profile._json.picture,
        },
    })
})

// Google token
const googleTokenStrategy = new GoogleTokenStrategy(
    googleOptions,
    async (_: any, __: any, profile: any, done: any) => {
        const email = profile.emails ? profile.emails[0].value : ''
        await resolveUser({
            authType: 'googleId',
            done,
            profile: {
                id: profile.id,
                email,
                name: profile.displayName,
                picture: profile._json.picture,
            },
        })
    }
)

// Facebook
const facebookOptions = {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['name', 'email', 'link', 'gender'],
    enableProof: true,
}
const facebookStrategy = new FacebookStrategy(facebookOptions, async (_, __, profile, done) => {
    const email = profile.emails ? profile.emails[0].value : ''
    await resolveUser({
        authType: 'facebookId',
        done,
        profile: {
            id: profile.id,
            email,
            name: `${profile.name?.givenName} ${profile.name?.familyName}`,
            picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
        },
    })
})

// Facebook token
const facebookTokenStrategy = new FacebookTokenStrategy(
    facebookOptions,
    async (_: any, __: any, profile: any, done: any) => {
        const email = profile.emails ? profile.emails[0].value : ''
        await resolveUser({
            authType: 'facebookId',
            done,
            profile: {
                id: profile.id,
                email,
                name: `${profile.name?.givenName} ${profile.name?.familyName}`,
                picture: `https://graph.facebook.com/${profile.id}/picture?type=large`,
            },
        })
    }
)

export default () => {
    passport.use(googleStrategy)
    passport.use(facebookStrategy)
    passport.use(googleTokenStrategy)
    passport.use(facebookTokenStrategy)
}
