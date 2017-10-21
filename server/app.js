/*
    This software is developed by Onni Pajumäki.
    You are free to use this software with on charge.

    TIP: To make this application automatically restart after changes please install 'nodemon'.
    Use 'npm i nodemon -g' to install it globally.
    To install nodemon (and save it to the config) on only this project, run 'npm i nodemon --save'
    To run this software using nodemon, run 'nodemon' or 'npm run nodemon' to start this.
    NODEMON DOES NOT COME WITH THIS SOFTWARE BY DEFAULT

    NOTE: All lines commented with '// FAke //' are part of the fake database system. Please remove or change them dude...
*/

// Preferences //
/*
    Theese are the preferences of this software.
    You can change them to configure this software to run differently.
*/
var port = 9080; // The port which in the software starts running in
var startupMessage = "This server is now running in port " + port + "."; // The message displayed when the application starts
var enableCors = true; // Allow cors
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const sha256 = require("crypto-js/sha256");
const config = require('./config'); // Grab the config file
var request = require('request');
var _ = require('lodash');
var swaggerJSDoc = require('swagger-jsdoc');
var path = require('path');

// Create the 'app' from the express module exports
var app = express();

// api
const restApi = require('./api.js');
let api = new restApi('./db/tc.db', app, jwt);

// swagger definition
var swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:3000',
    basePath: '/',
  };
  
  // options for the swagger docs
  var swaggerOptions = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./app.js'],
  };
  
  // initialize swagger-jsdoc
  var swaggerSpec = swaggerJSDoc(swaggerOptions);
// FAKE //
//const database = require('./fake-database'); // This file emulates the fake database. Remove this line when adding support for a REAL database.


if (enableCors) {
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

app.use(express.static(path.join(__dirname, 'public')));

// Secret stuff...
app.set('secret', config.secret);

// Setup body-parser for reading post request data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup routes: apiRoutes
var apiRoutes = express.Router();

// FAKE //
function findUser(username) {
    return api.getUserByEmail(username);
}

// serve swagger
app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

/**
 * @swagger  
 * info:
 *   description: "This is a sample server Petstore server"
 *   version: "1.0.0"
 *   title: "Swagger Petstore"
 *   termsOfService: "http://swagger.io/terms/"
 *   contact:
 *     email: "apiteam@swagger.io"
 *   license:
 *     name: "Apache 2.0"
 *     url: "http://www.apache.org/licenses/LICENSE-2.0.html"
 * securityDefinitions:
 *   api_key:
 *     type: "apiKey"
 *     name: "Token"
 *     in: "header"
 * definitions:
 *   User:
 *     properties:
 *       id:
 *         type: string
 *       email:
 *         type: string
 *       nickname:
 *         type: integer
 * paths:
 * /api/login:
 *   post:
 *     tags:
 *       - Login
 *     description: Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: loginData
 *         description: loginData
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully created
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Returns all users
 *     produces:
 *       - application/json
 *     security:
 *       - api_key: []
 *     responses:
 *       200:
 *         description: An array of users
*/

apiRoutes.post('/login', (req, res) => {
    findUser(req.body.username)
        .then(result => {
            let user = result.message;
            if (user == null) {
                res.json({ success: false, error: 'No user found.' });
            } else {
                if (user.password == sha256(req.body.password).toString()) {
                    // Create jwt
                    var token = jwt.sign(user, app.get('secret'), {
                        expiresIn: 60* 60* config.tokenExpiresInHours
                    });

                    res.json({ success: true, token: token });
                } else {
                    res.json({ success: false, error: 'Invalid password.' });
                }
            }
        })
});

// A simple tool to quicky hash any string
apiRoutes.get('/hash', (req, res) => {
    res.json({ hash: sha256(req.query.data).toString() });
});

/*
    NOTE: All routes that DO NOT NEED AUTHENTICATION need to go before this function.
    NOTE: All routes that NEED AUTHENTICATION need to go after this function.

    All routes after this function are allowed to use 'req.decoded' to retrive the current user data from the token.
*/
apiRoutes.use(function (req, res, next) {
    var token = req.headers.token || req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, app.get('secret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Invalid token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.send({
            success: false,
            message: 'No token provided.'
        });
    }
});

 apiRoutes.get('/users', function (req, res) {
    api.getUsers()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

apiRoutes.get('/users/:email', function (req, res) {
    let email = req.params.email;
    let idPromise = api.getPropertyFromToken(req, 'id');
    let userByEmailPromise = api.getUserByEmail(email);
    Promise.all([idPromise, userByEmailPromise]).then(result => {
        let id = result[0].message;
        let user = result[1].message;

        if (id === user.id) {
            res.json(user);
        }
        else {
            res.json({ success: false, message: 'Cannot view other users events' })
        }
    })
});

apiRoutes.get('/usersGroups/:id', function (req, res) {
    let userId = req.params.id;
    api.getUsersGroupsById(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

// param id: GUID group id
apiRoutes.get('/groups', function (req, res) {
    api.getGroups()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

// param id: GUID group id
apiRoutes.get('/groupsUsers/:id', function (req, res) {
    let groupId = req.params.id;

    // get id of authenticated user (from token)
    api.getPropertyFromToken(req, 'id')
        .then(result => {
            // userId is auth. user id
            let userId = result.message;
            api.isCoachOfGroup(userId, groupId)
                .then(result => {
                    if (result.message) {
                        api.getGroupUsers(groupId)
                            .then(result => {
                                res.json(result);
                            })
                            .catch(err => {
                                console.log(err);
                                res.json(err);
                            });
                    }
                    else {
                        res.json({ success: false, message: 'Not a coach of group.' })
                    }
                })
        })
});

apiRoutes.get('/userevents/:groupId/:id', function (req, res) {
    let userId = req.params.id;
    let groupId = req.params.groupId;
    let idPromise = api.getPropertyFromToken(req, 'id');
    let isMemberPromise = api.isMemberOfGroup(userId, groupId);
    let isCoachOfGroupPromise = api.isCoachOfGroup(userId, groupId);
    Promise.all([idPromise, isMemberPromise, isCoachOfGroupPromise]).then(result => {
        let id = result[0].message;
        let isMember = result[1].message;
        let isCoachOfGroup = result[2].message;

        if ((id === userId) || isCoachOfGroup) {
            api.getUserEvents(userId)
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    console.log(err);
                    res.json(err);
                })
        }
        else {
            res.json({ success: false, message: 'Cannot view other users events' })
        }
    })
});

apiRoutes.get('/event/:id', function (req, res) {
    let eventId = req.params.id;
    api.getPropertyFromToken(req, 'id')
        .then(result => {
            api.isUsersEvent(result.message, eventId)
                .then(result => {
                    if (result.message) {
                        api.isUsersEvents()
                            .then(result => {
                                res.json(result);
                            })
                            .catch(err => {
                                console.log(err);
                                res.json(err);
                            })
                    }
                })
        })
});

app.use('/api', apiRoutes);

// Create the 'server' from the app
var server = http.createServer(app);

// Start the server using the port defined in the preferences
server.listen(port, () => {
    console.log(startupMessage);
});
