import { Router } from 'express'
import { connection } from 'mongoose'
const router = Router()

// routes for test only
router.get('/clean-db', async (_, res) => {
    await connection.db.dropDatabase()
    return res.send('done')
})

export default router
