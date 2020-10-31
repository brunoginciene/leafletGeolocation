const express = require('express')

const app = express()

app.use(express.static('public'))
app.use(express.json())

app.post('/', (req, res) => {
    console.log(req.body)
    res.json({
        status: 'success'
    })
})

app.listen(3000) 