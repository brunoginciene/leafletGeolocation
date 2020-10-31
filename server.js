const express = require('express')
const Datastore = require('nedb')

const app = express()

app.use(express.static('public'))
app.use(express.json())

const database = new Datastore('database.db')
database.loadDatabase()

app.post('/', (req, res) => {
    database.insert(req.body)
    console.log(req.body)
    res.json({
        status: 'success'
    })
})

app.listen(3000) 