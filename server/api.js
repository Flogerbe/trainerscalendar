'use strict';
module.exports = class Api {
    constructor(dbName, app, jwt) {
        this.dbName = dbName;
        this.jwt = jwt;
        this.app = app;
        this.openDb();
    }

    openDb() {
        var sqlite3 = require('sqlite3').verbose();

        this.db = new sqlite3.Database(this.dbName, (err) => {

            if (err) {
                console.error(err.message);
            }

            console.log('Connected tc database.');
        });
    }

    closeDb() {
        this.db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }

    idTrainer() {
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
    }

    getPropertyFromToken(req, propertyName) {
        return new Promise((resolve, reject) => {
            var token = req.headers.token || req.body.token || req.query.token || req.headers['x-access-token'];
            if (token) {
                this.jwt.verify(token, this.app.get('secret'), function (err, decoded) {
                    if (err) {
                        reject({ success: false, message: 'Invalid token.' });
                    } else {
                        resolve({ success: true, message: decoded[propertyName] });
                    }
                });
            } else {
                reject({ success: false, message: 'Invalid token.' });
            }
        });
    }

    /*
    print() {
        this.db.serialize(() => {
            this.db.each(`SELECT id as id, nickname as name FROM user`, (err, row) => {
                if (err) {
                    console.error(err.message);
                }

                console.log(row.id + "\t" + row.name);
            });
        });
    }
    */

    getUsers() {
        return new Promise((resolve, reject) => {
            return this.db.serialize(() => {
                this.db.all("SELECT id,email,nickname FROM user", function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows });
                    }
                })
            })
        })
    }

    getUserById(id) {
        return new Promise((resolve, reject) => {
            //var st = db.prepare(sql);
            this.db.serialize(() => {
                this.db.all("SELECT id,email,nickname FROM user where id = ?", id, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows});
                    }
                })
            })
        })
    }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT u.*,r.name role FROM user u  
            join user_role ur on ur.user_id=u.id
            join role r on r.id=ur.role_id
            where u.email = ?
            `;
            return this.db.serialize(() => {
                this.db.all(sql, email, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err});
                    } else {
                        resolve({ success: true, message: rows[0] });
                    }
                })
            })
        })
    }

    getUsersGroupsById(id) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT g.id,g.name FROM user u  
            join user_group ug on ug.user_id=u.id
            join training_group g on g.id=ug.group_id
            where u.id = ?
            `;
            return this.db.serialize(() => {
                this.db.all(sql, id, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows});
                    }
                })
            })
        })
    }

    isUsersEvent(userId, eventId) {
        return new Promise((resolve, reject) => {
            var sql = `select count(*) value from event e
            join user u on u.id=e.user_id;
            where u.id = ? and e.id = ?`;
            return this.db.serialize(() => {
                this.db.all(sql, [userId, groupId], function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows.length > 0 ? true : false });
                    }
                })
            })
        })
    }

    isMemberOfGroup(userId, groupId) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT count(*) value FROM user u  
            join user_group ug on ug.user_id=u.id
            join training_group g on g.id=ug.group_id
            where u.id = ? and g.id = ?
            `;
            return this.db.serialize(() => {
                this.db.all(sql, [userId, groupId], function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows.length > 0 ? true : false });
                    }
                })
            })
        })
    }

    isCoachOfGroup(userId, groupId) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT count(*) value FROM user u  
            join user_group ug on ug.user_id=u.id
            join training_group g on g.id=ug.group_id
            join user_role ur on ur.user_id=u.id
            join role r on r.id=ur.role_id
            where u.id = ? and g.id = ? and r.name='coach'`;
            return this.db.serialize(() => {
                this.db.all(sql, [userId, groupId], function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows[0].value > 0 ? true : false });
                    }
                })
            })
        })
    }

    getGroupUsers(id) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT u.id,u.email,u.nickname FROM user u  
            join user_group ug on ug.user_id=u.id
            join training_group g on g.id=ug.group_id
            where g.id = ?
            `;
            return this.db.serialize(() => {
                this.db.all(sql, id, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err});
                    } else {
                        resolve({ success: true, message: rows});
                    }
                })
            })
        })
    }

    getUserEvents(id) {
        return new Promise((resolve, reject) => {
            var sql = `select * from event e
            join user u on u.id=e.user_id
            where u.id = ?`;
            return this.db.serialize(() => {
                this.db.all(sql, id, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err});
                    } else {
                        resolve({ success: true, message: rows});
                    }
                })
            })
        })
    }

    getGroups() {
        return new Promise((resolve, reject) => {
            var sql = `SELECT id,name from training_group g`;
            return this.db.serialize(() => {
                this.db.all(sql, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows });
                    }
                })
            })
        })
    }
}