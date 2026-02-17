const express = require("express")
const app = express()

const fakeDB = () => new Promise(res => setTimeout(() => {

    console.log("Fetching from DB")
    res({ id: 1, name: "Amit" })

}, 1000))

app.get('/user', async (req, res) => {

    const data = await fakeDB()

    res.json(data)
})

app.listen(3000, () => console.log('Server is running on port 3000'))