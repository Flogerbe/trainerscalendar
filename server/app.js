 // The port which in the software starts running in
 var port = 9080;
// The message displayed when the application starts
var startupMessage = "This server is now running in port " + port + ".";
// Allow cors
var enableCors = true; 

// import modules
const express = require('express');
const http = require('http');
const  path = require('path');
const bodyParser = require('body-parser');

// Grab the config file
 const config = require('./config');

 // swagger documents
const swaggerJSDoc = require('swagger-jsdoc');

// Create the 'app' from the express module exports
const app = express();

// export app
module.exports = {
    app: app
}

if (enableCors) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
        next();
    });
}

app.use(express.static(path.join(__dirname, 'public')));

// Secret stuff...
app.set('secret', config.secret);

// Setup body-parser for reading post request data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// serve swagger
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  
const routes = require('./routes');
app.use('/api', routes);//apiRoutes);

// Create the 'server' from the app
var server = http.createServer(app);

// Start the server using the port defined in the preferences
server.listen(port, () => {
    console.log(startupMessage);
});

