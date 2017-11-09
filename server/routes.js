var express = require('express');
var router = express.Router();
//var db = require('../queries');
const restApi = require('./api');
const jwt = require('jsonwebtoken');
const sha256 = require("crypto-js/sha256");
const config = require('./config'); // Grab the config file
const bodyParser = require('body-parser');

//var app = express();
var app = module.parent.exports.app;
let api = new restApi('./db/tc.db', app, jwt);

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
 */

/**
 * @swagger  
 * paths:
 *   /api/login:
 *     post:
 *       tags:
 *         - Login
 *       description: Login
 *       produces:
 *         - application/json
 *       parameters:
 *         - name: loginData
 *           description: loginData
 *           in: body
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Successfully created
*/
router.post('/login', (req, res) => {
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

router.use(function (req, res, next) {
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
 
// after this needs auth token

/**
 * @swagger  
 * paths:
 *   /api/users:
 *     get:
 *       tags:
 *         - Users
 *       description: Returns all users
 *       produces:
 *         - application/json
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: An array of users
*/
router.get('/users', function (req, res) {
    api.getUsers()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        });
});

router.get('/users/:email', function (req, res) {
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

router.get('/usersGroups/:id', function (req, res) {
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
router.get('/groups', function (req, res) {
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
router.get('/groupsUsers/:id', function (req, res) {
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

router.get('/userevents/:groupId/:id', function (req, res) {
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

router.get('/event/:id', function (req, res) {
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

function findUser(username) {
    return api.getUserByEmail(username);
}

module.exports = router;
