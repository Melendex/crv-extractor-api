const express = require('express');
require('./db/connMongo')

const userRouter = require('./routers/user')

const app = express()
app.use(express.json())
    // app.use(express.urlencoded())
app.use(userRouter)


module.exports = app