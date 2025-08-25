const express = require('express')
const db = require('./models')
const cors = require('cors');
const adminRoutes= require('./routes/adminRoutes')
const certificateRoutes = require('./routes/certificateRoutes')
const devopsotherRoutes = require('./routes/devops_otherRoutes')
const frameworkRoutes = require('./routes/frameworks_toolRoutes')
const programming_languageRoutes = require('./routes/programming_languageRoutes')
const projectRoutes = require('./routes/projectRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const path = require('path')



// Config App
const app = express()
require('dotenv').config();


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
app.use('/', serviceRoutes)  

//Sert les images depuis uploads/adminphoto sous /adminphoto
app.use('/adminphoto', express.static(path.join(__dirname, 'uploads/adminphoto')));

//Sert les images depuis uploads/projectphoto sous /projectphoto
app.use('/projectphoto', express.static(path.join(__dirname, 'uploads/projectphoto')));

//Sert les images depuis uploads/certificatephoto sous /certificatephoto
app.use('/certificatephoto', express.static(path.join(__dirname, 'uploads/certificatephoto')));

//Sert les images depuis uploads/serviceicon sous /serviceicon
app.use('/serviceicon', express.static(path.join(__dirname, 'uploads/serviceicon')));


// CORS Middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', '*'); // Allowed HTTP methods : GET, POST, PUT, PATCH, DELETE, OPTIONS
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
    res.setHeader('Access-Control-Allow-Credentials', true); // Allow cookies (optional)
    next();
});

 
const port = process.env.PORT || 3000 

db.sequelize.sync().then(() => {
    app.listen(port,  () => console.log(`server is loading on ${port} ...`))
})

