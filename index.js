const cluster = require('cluster')
const os = require('os')
const numCPUs = os.cpus().length

const PORT = process.env.PORT || 3000

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`)

    for(let i=0; i<numCPUs; i++){
        cluster.fork()
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Starting a new one...`)
        cluster.fork()
    })

} else {

const express = require("express")
const app = express()
// const rateLimit = require("express-rate-limit")
// const { RedisStore } = require("rate-limit-redis")
const { createClient } = require("redis")

const redisClient = createClient()
redisClient.connect().catch(console.error)

{/* This middleware insures no IP can spam the API more than 5 times in a minute */}
// const limiter = rateLimit({
//     windowMs: 60 * 1000,
//     max: 5,
//     message: "To many requests, try again later",
//     store: new RedisStore({
//         sendCommand: (...args) => redisClient.sendCommand(args)
//     })
// })

// app.use(limiter)

const fakeDB = () => new Promise(res => setTimeout(() => {

    console.log(`Fetching from DB - Server ${PORT} - PID ${process.pid}`)
    res({ id: 1, name: "Amit" })

}, 1000))

app.get('/user', async (req, res) => {

    res.json({ id: 1, name: "Amit" })
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}