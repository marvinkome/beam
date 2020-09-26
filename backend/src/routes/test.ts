import { Router } from 'express'
import { connection } from 'mongoose'
import User, { AccountType } from 'src/models/users'
const router = Router()

// routes for test only
router.get('/clean-db', async (_, res) => {
    await connection.db.dropDatabase()

    // seed db with one user
    const user = new User()

    user.email = 'seededuser@gmail.com'
    user.googleId = '221436712395236582699'
    user.lastSeen = null

    user.profile = {
        name: 'Jane User',
        picture:
            'https://lh6.googleusercontent.com/-71lpTLfSPYg/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnQ8p7jSzyXTfkMlNwOuH0mGCKVdw/photo.jpg',
        location: {
            lat: 3.3840596,
            long: 6.5269003,
            state: 'Lagos',
            city: 'Ikeja',
            country: 'Nigeria',
        },
    }

    user.connectedAccounts = [
        {
            id: 'UCr3cBLTYmIK9kY0F_OdFWFQ',
            name: 'Casually Explained',
            image:
                'https://yt3.ggpht.com/-szMs8icRWHI/AAAAAAAAAAI/AAAAAAAAAAA/LRgrc41CiXA/s88-c-k-no-mo-rj-c0xffffff/photo.jpg',
            platform: AccountType.YOUTUBE,
        },
        {
            id: 'UCBQZwaNPFfJ1gZ1fLZpAEGw',
            name: 'twenty one pilots',
            image:
                'https://yt3.ggpht.com/-Pr2108j6qKs/AAAAAAAAAAI/AAAAAAAAAAA/-cia2SakDYA/s88-c-k-no-mo-rj-c0xffffff/photo.jpg',
            platform: AccountType.YOUTUBE,
        },
        {
            id: 'UCLXo7UDZvByw2ixzpQCufnA',
            name: 'Vox',
            image:
                'https://yt3.ggpht.com/-moy7q66uDVs/AAAAAAAAAAI/AAAAAAAAAAA/3kiAD7O0Q_E/s88-c-k-no-mo-rj-c0xffffff/photo.jpg',
            platform: AccountType.YOUTUBE,
        },
        {
            id: 'UCsXVk37bltHxD1rDPwtNM8Q',
            name: 'Kurzgesagt – In a Nutshell',
            image:
                'https://yt3.ggpht.com/-UwENvFjc4vI/AAAAAAAAAAI/AAAAAAAAAAA/04dXvZ_jl0I/s88-c-k-no-mo-rj-c0xffffff/photo.jpg',
            platform: AccountType.YOUTUBE,
        },
    ]

    await user.save()

    return res.send('done')
})

export default router
