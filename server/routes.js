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
 *         type: string
 *   Event:
 *     properties:
 *       group_id:
 *         type: string
 *       date_time:
 *         type: string
 *       swim_duration:
 *         type: number
 *       co_train_duration:
 *         type: number
 *   Group:
 *     properties:
 *       name:
 *         type: string
 *   GroupJoin:
 *     properties:
 *       group_id:
 *         type: string
 */

/**
* @swagger  
* paths:
*   /api/register:
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
router.post('/register', (req, res) => {
    findUser(req.body.username).then(result => {
        if (result.message != null) {
            res.json({ success: false, error: 'User already exists.' });
        } else {
            api.addUserAndAttachRole(req.body.username, sha256(req.body.password).toString(), req.body.nickname, config.defaultRoleName).then(result => {
                let user = req.body;
                if (result.success === true) {
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 60 * 60 * config.tokenExpiresInHours
                    });

                    res.json({ success: true, token: token, nickname: user.nickname });
                } else {
                    res.json({ success: false, message: result.message });
                }
            })
                .catch(err => {
                    console.log(err);
                    res.json({ success: false, message: err });
                })
        }
    })
});

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
    findUser(req.body.username).then(result => {
        let user = result.message;
        if (user == null) {
            res.json({ success: false, error: 'No user found.' });
        } else {
            if (user.password == sha256(req.body.password).toString()) {
                // Create jwt
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 60 * 60 * config.tokenExpiresInHours
                });

                res.json({ success: true, userId: user.id, token: token, nickname: user.nickname });
            } else {
                res.json({ success: false, error: 'Invalid password.' });
            }
        }
    })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

router.use(function (req, res, next) {
    var token = req.headers.token || req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
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
    api.getUsers().then(result => {
        res.json(result);
    })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

/**
 * @swagger  
 * paths:
 *   /api/users/:email:
 *     get:
 *       tags:
 *         - Users
 *       description: Returns user by email
 *       produces:
 *         - application/json
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: An array of users
*/
router.get('/users/:email', function (req, res) {
    let email = req.params.email;
    let idPromise = api.getPropertyFromToken(req, 'id');
    let userByEmailPromise = api.getUserByEmail(email);
    Promise.all([idPromise, userByEmailPromise]).then(result => {
        let coachId = result[0].message;
        let user = result[1].message;

        api.isCoachOfSwimmer(coachId, user.id).then(result => {
            let isCoachOfSwimmer = result.message;
            if (isCoachOfSwimmer || coachId === user.id) {
                res.json({ success: true, message: user });
            }
            else {
                res.json({ success: false, message: 'Cannot view other users events' })
            }
        })
    })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

/**
 * @swagger  
 * paths:
 *   /api/usersGroups/{id}:
 *     get:
 *       tags:
 *         - Users
 *       description: Returns groups of user
 *       parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *         default: 4f569604-4c57-47b5-81b4-ff2281b26ef3
 *         description: user id
 *       produces:
 *         - application/json
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: An array of users groups
*/
router.get('/usersGroups/:id', function (req, res) {
    let userId = req.params.id;
    api.getUsersGroupsById(userId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

/**
 * @swagger  
 * paths:
 *   /api/groups:
 *     get:
 *       tags:
 *         - Groups
 *       description: Returns all groups
 *       produces:
 *         - application/json
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: An array of groups
*/
router.get('/groups', function (req, res) {
    api.getGroups()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

router.get('/groups/:id', function (req, res) {
    let groupId = req.params.id;
    api.getGroup(groupId)
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

/**
 * @swagger  
 * paths:
 *   /api/groupsUsers/:id:
 *     get:
 *       tags:
 *         - Groups
 *       description: Returns all users in group
 *       produces:
 *         - application/json
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: An array of users in groups
*/
router.get('/groupsUsers/:groupId', function (req, res) {
    let groupId = req.params.groupId;

    // get id of authenticated user (from token)
    api.getPropertyFromToken(req, 'id').then(result => {
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
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

/**
 * @swagger  
 * paths:
 *   /api/userEvents/:groupId/:id:
 *     get:
 *       tags:
 *         - Events
 *       description: Returns all events of user in group
 *       produces:
 *         - application/json
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: An array of events of user in group
*/
router.get('/userEvents/:groupId/:id', function (req, res) {
    let userId = req.params.id;
    let groupId = req.params.groupId;
    let idPromise = api.getPropertyFromToken(req, 'id');
    let isMemberPromise = api.isMemberOfGroup(userId, groupId);
    let isCoachOfGroupPromise = api.isCoachOfGroup(userId, groupId);
    let isAdminPromise = api.isAdmin(userId);
    Promise.all([idPromise, isMemberPromise, isCoachOfGroupPromise, isAdminPromise]).then(result => {
        let id = result[0].message;
        let isMember = result[1].message;
        let isCoachOfGroup = result[2].message;
        let isAdmin = result[3].message;

        if ((id === userId) || isCoachOfGroup || isAdmin) {
            api.getUserEvents(groupId, userId)
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
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

router.get('/groupEvents/:groupId', function (req, res) {
    let groupId = req.params.groupId;
    let idPromise = api.getPropertyFromToken(req, 'id').then(result => {
        let userId = result.message;    
        let isCoachOfGroupPromise = api.isCoachOfGroup(userId, groupId);
        let isAdminPromise = api.isAdmin(userId);
        Promise.all([isCoachOfGroupPromise, isAdminPromise]).then(result => {
            let isCoachOfGroup = result[0].message;
            let isAdmin = result[1].message;
            
            if (isCoachOfGroup || isAdmin) {
                api.getGroupEvents(groupId)
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
    })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

/**
 * @swagger  
 * paths:
 *   /api/events:
 *     post:
 *       tags:
 *         - Events
 *       description: Add new user event in group
 *       produces:
 *         - application/json
 *       parameters:
 *         - name: event
 *           description: Event data
 *           in: body
 *           required: true
 *           schema:
 *             $ref: "#/definitions/Event"
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: Rowid of added event
*/
router.post('/events/:groupId', (req, res) => {
    api.getPropertyFromToken(req, 'id').then(result => {
        let userId = result.message;
        let event = req.body;
        api.addEvent(userId, event)
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
    })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

router.put('/events/:eventId', (req, res) => {
    api.getPropertyFromToken(req, 'id').then(result => {
        let userId = result.message;
        let event = req.body;
        let eventId = req.params.eventId;
        api.updateEvent(eventId, event)
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
    })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

router.delete('/events/:eventId', (req, res) => {
    api.getPropertyFromToken(req, 'id').then(result => {
        let userId = result.message;
        let eventId = req.params.eventId;
        api.deleteEvent(eventId)
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
    })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});
/**
 * @swagger  
 * paths:
 *   /api/event/:id:
 *     get:
 *       tags:
 *         - Events
 *       description: Get event by id
 *       produces:
 *         - application/json
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: Event
*/
router.get('/events/:id', function (req, res) {
    let eventId = req.params.id;
    api.getPropertyFromToken(req, 'id').then(result => {
        api.isUsersEvent(result.message, eventId)
            .then(result => {
                if (result.message) {
                    api.getEvent(eventId)
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
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
});

/**
 * @swagger  
 * paths:
 *   /api/groups:
 *     post:
 *       tags:
 *         - Groups
 *       description: Add new group. Creator becomes a coach of group.
 *       produces:
 *         - application/json
 *       parameters:
 *         - name: groupdata
 *           description: Group data
 *           in: body
 *           required: true
 *           schema:
 *             $ref: "#/definitions/Group"
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: Rowid of new group
*/
router.post('/groups', (req, res) => {
    api.getPropertyFromToken(req, 'id').then(result => {
        let userId = result.message;
        api.addGroupAndSetCoach(userId, req.body)
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
        })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
})

/**
 * @swagger  
 * paths:
 *   /api/addGroup:
 *     post:
 *       tags:
 *         - Groups
 *       description: Add new group. Creator becomes a coach of group.
 *       produces:
 *         - application/json
 *       parameters:
 *         - group: group
 *           description: Group to join
 *           in: body
 *           required: true
 *           schema:
 *             $ref: "#/definitions/GroupJoin"
 *       security:
 *         - api_key: []
 *       responses:
 *         200:
 *           description: Rowid of new group
*/
router.post('/joinGroup', (req, res) => {
    api.getPropertyFromToken(req, 'id').then(result => {
        let userId = result.message;
        api.joinUserToGroupAndSetRole(userId, req.body)
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
    })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
})

router.post('/unJoinGroup', (req, res) => {
    api.getPropertyFromToken(req, 'id').then(result => {
        let userId = result.message;
        api.unJoinUserFromGroupAndRemoveRole(userId, req.body)
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
    })
        .catch(err => {
            console.log(err);
            res.json({ success: false, message: err });
        })
})

function findUser(username) {
    return api.getUserByEmail(username);
}

module.exports = router;
