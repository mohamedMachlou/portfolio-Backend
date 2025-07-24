const express = require('express')
const db = require('./models')
const cors = require('cors');
const adminRoutes= require('./routes/adminRoutes')
const certificateRoutes = require('./routes/certificateRoutes')


// Config App
const app = express()
// require('dotenv').config();


// Middlewares
app.use(express.urlencoded({ extended: true }));
// qs : true
// query string : false
app.use(express.json());
app.use(cors())
app.use('/', adminRoutes)
app.use('/', certificateRoutes)


const port = process.env.PORT || 3000

db.sequelize.sync().then(() => {
    app.listen(port,  () => console.log(`server is loading on ${port} ...`))
})

