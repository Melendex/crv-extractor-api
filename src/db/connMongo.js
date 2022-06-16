const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL_CONNECTION, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false
})

mongoose.connection.once('open', () => {

    console.log('MongoDB Connected correctly!... ')
})