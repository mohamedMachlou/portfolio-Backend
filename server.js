const express = require('express')
const db = require('./models')
const adminRoutes= require('./routes/adminRoutes')
const cors = require('cors');


// Config App
const app = express()
// require('dotenv').config();


// Middlewares
app.use(express.urlencoded({extends: true}))
// qs : true
// query string : false
app.use(express.json())
app.use(cors())
app.use('/', adminRoutes)


const port = process.env.PORT || 3000

db.sequelize.sync().then(() => {
    app.listen(port,  () => console.log(`server is loading on ${port} ...`))
})

