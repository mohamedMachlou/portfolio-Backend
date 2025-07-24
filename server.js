const express = require('express')
const db = require('./models')
const cors = require('cors');
const adminRoutes= require('./routes/adminRoutes')
const certificateRoutes = require('./routes/certificateRoutes')
const devopsotherRoutes = require('./routes/devops_otherRoutes')
const frameworkRoutes = require('./routes/frameworks_toolRoutes')
const programming_languageRoutes = require('./routes/programming_languageRoutes')
const projectRoutes = require('./routes/projectRoutes')


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
app.use('/', devopsotherRoutes)
app.use('/', frameworkRoutes)
app.use('/', programming_languageRoutes)
app.use('/', projectRoutes)


const port = process.env.PORT || 3000

db.sequelize.sync().then(() => {
    app.listen(port,  () => console.log(`server is loading on ${port} ...`))
})

