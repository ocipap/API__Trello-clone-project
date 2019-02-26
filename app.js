const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const routes = require('./routes')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extends: false
}))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token')
    next()
})
app.use(express.static('public'))

app.use(routes)

app.use((req, res, next) => {
    res.statusCode = 404
    next(Error('not found'))
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(res.statusCode || 500)
    res.json({
        result: false,
        error: err.message || 'internal server error'
    })
})

module.exports = app