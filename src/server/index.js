require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// your API calls
app.post('/marsRoverData', async (req, res) => {
    try {
        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${req.body.roverName}/?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            res.send(data)
            
    } catch (err) {
        console.log('error in fetching Rover data:', err);
    }
})

app.post('/marsRoverImage', async (req, res) => {
    try {
        let data = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${req.body.roverName}/latest_photos?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
            res.send(data)

            
    } catch (err) {
        console.log('error in fetching Rover image:', err);
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))