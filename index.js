const express = require("express")
const app = express()
const rateLimit = require("express-rate-limit")
const { RedisStore } = require("rate-limit-redis")
const { createClient } = require("redis")

const redisClient = createClient()
redisClient.connect().catch(console.error)

{/* This middleware insures no IP can spam the API more than 5 times in a minute */}
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: "To many requests, try again later",
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args)
    })
})

app.use(limiter)

const fakeDB = () => new Promise(res => {

    console.log("Fetching from DB")
    res({ id: 1, name: "Amit" })

})

app.get('/user', async (req, res) => {

    const cachekey = 'user:1'
    const cached = await redisClient.get(cachekey)

    if(cached){

        console.log('Returning from cache..')
        return res.json(JSON.parse(cached))
    }

    const data = await fakeDB()
    await redisClient.setEx(cachekey, 60, JSON.stringify(data))

    res.json(data)
})

app.listen(3000, () => console.log('Server is running on port 3000'))