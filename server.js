const express = require('express')
const Datastore = require('nedb')

const app = express()

app.use(express.static('public'))
app.use(express.json())

const database = new Datastore('database.db')
database.loadDatabase()

app.get('/api', (req, res) => {
    database.find({}, (err, data) =>{
        if (err) {
            res.end()
            return
        }
        res.json(data)
    })
})

app.post('/api', (req, res) => {
    database.insert(req.body)
    console.log(req.body)
    res.json({
        status: 'success'
    })
})

app.listen(3000) 