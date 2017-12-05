'use strict';

const guid = require('guid');

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

    addUserAndAttachRole(email, password, nickname, roleName) {
        return new Promise((resolve, reject) => {
            this.addUser(email, password, nickname).then(result => {
                let userRowid = result;
                this.getIdByRowid('user', userRowid).then(result => {
                    if (result.success === true) {
                        let userId = result.message;
                        this.getRoleByName(roleName).then(result => {
                            let roleId = result.message.id;
                            this.setRole(userId, roleId).then(result => {
                                resolve({ success: true, message: `User added and default role set.` });
                            })
                        })
                    }
                })
            })
                .catch(err => {
                    console.log(err);
                    reject(err);
                })
        })
    }

    getIdByRowid(tableName, rowId) {
        return new Promise((resolve, reject) => {
            var sql = 'select id from ' + tableName + ' where rowid=?';
            this.db.serialize(() => {
                this.db.all(sql, rowId, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows[0].id });
                    }
                })
            })
        })
    }

    addUser(email, password, nickname) {
        return new Promise((resolve, reject) => {
            let id = guid.raw();
            let sql = `insert into userx (id,email,password,nickname)  values(?,?,?,?)`;
            this.db.serialize(() => {
                this.db.run(sql, [id, email, password, nickname], function cb(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                })
            })
        })
    }

    setRole(userId, roleId) {
        return new Promise((resolve, reject) => {
            let id = guid.raw();
            let sql = `insert into user_role (id,user_id,role_id)  values(?,?,?)`;
            this.db.serialize(() => {
                this.db.run(sql, [id, userId, roleId], function cb(err) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: 'Role attached to user' });
                    }
                })
            })
        })
    }

    getUsers() {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
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
                        resolve({ success: true, message: rows });
                    }
                })
            })
        })
    }

    getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT u.* FROM user u  
            where u.email = ?
            `;
            this.db.serialize(() => {
                this.db.all(sql, email, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
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
            join user_training_group ug on ug.user_id=u.id
            join training_group g on g.id=ug.group_id
            where u.id = ?
            `;
            this.db.serialize(() => {
                this.db.all(sql, id, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows });
                    }
                })
            })
        })
    }

    isCoachOfSwimmer(coachId, userId) {
        return new Promise((resolve, reject) => {
            let sql = `select count(*) count from 
        (select u.email,tg.id,tg.name,r.name from user u join user_training_group utg on u.id=utg.user_id
        join user_role_in_group urg on urg.user_id=u.id join training_group tg on tg.id=utg.group_id
        join role r on r.id=urg.role_id where r.name='coach' and u.id=?) a
        join (select u.email,tg.id,tg.name,r.name from user u join user_training_group utg on u.id=utg.user_id
        join user_role_in_group urg on urg.user_id=u.id join training_group tg on tg.id=utg.group_id
        join role r on r.id=urg.role_id where r.name='swimmer' and u.id=?) b
        on a.id=b.id`;
            this.db.serialize(() => {
                this.db.all(sql, [coachId, userId], function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows[0].count > 0 ? true : false });
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
            sql = `select count(*) value from event e`;
            this.db.serialize(() => {
                this.db.all(sql, function cb(err, rows) {
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
            join user_training_group ug on ug.user_id=u.id
            join training_group g on g.id=ug.group_id
            where u.id = ? and g.id = ?
            `;
            this.db.serialize(() => {
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

    isAdmin(userId) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT count(*) value FROM user u  
            join user_role ur on ur.user_id=u.id
            join role r on r.id=ur.role_id
            where u.id = ? and r.name='admin'`;
            this.db.serialize(() => {
                this.db.all(sql, [userId], function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows[0].value > 0 ? true : false });
                    }
                })
            })
        })
    }

    isCoachOfGroup(userId, groupId) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT count(*) value FROM user u  
            join user_role_in_group ur on ur.user_id=u.id
            join role r on r.id=ur.role_id
            where u.id = ? and ur.group_id = ? and r.name='coach'`;
            this.db.serialize(() => {
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
            join user_training_group ug on ug.user_id=u.id
            join training_group g on g.id=ug.group_id
            where g.id = ?
            `;
            this.db.serialize(() => {
                this.db.all(sql, id, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows });
                    }
                })
            })
        })
    }

    getEvent(id) {
        return new Promise((resolve, reject) => {
            var sql = `select * from event e
            where e.id=?`;
            this.db.serialize(() => {
                this.db.all(sql, [id], function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows[0] });
                    }
                })
            })
        })
    }

    updateEvent(eventId, event) {
        return new Promise((resolve, reject) => {
            var sql = `update event set date_time=datetime(?,'localtime'),
            swim_duration=?,co_train_duration=?,stress_level=?,nutrition=?,sleep=?,remarks=?
            where id=?`;
            this.db.run(sql, [event.date_time, event.swim_duration, event.co_train_duration, 
                event.stress_level, event.nutrition, event.sleep, event.remarks, eventId], function cb(err) {
                if (err) {
                    reject({ success: false, message: err });
                } else {
                    resolve({ success: true, message: 'updated' });
                }
            })
        })
    }

    deleteEvent(eventId) {
        return new Promise((resolve, reject) => {
            var sql = `delete from event where id=?`;
            this.db.run(sql, [eventId], function cb(err) {
                if (err) {
                    reject({ success: false, message: err });
                } else {
                    resolve({ success: true, message: 'deleted' });
                }
            })
        })
    }

    getUserEvents(groupId, id) {
        return new Promise((resolve, reject) => {
            var sql = `select e.* from event e
            join user u on u.id=e.user_id
            where u.id = ? and e.group_id=?`;
            this.db.serialize(() => {
                this.db.all(sql, [id, groupId], function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows });
                    }
                })
            })
        })
    }

    addEvent(userId, event) {
        return new Promise((resolve, reject) => {
            let id = guid.raw();
            let sql = `insert into event (id,user_id,group_id,date_time,swim_duration,co_train_duration,
            stress_level,nutrition,sleep,remarks) 
              values(?,?,?,datetime(?,'localtime'),?,?,?,?,?,?)`;
            this.db.serialize(() => {
                this.db.run(sql, [id, userId, event.group_id, event.date_time, event.swim_duration, event.co_train_duration,
                    event.stress_level,event.nutrition,event.sleep,event.remarks], function cb(err) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: this.lastID });
                    }
                })
            })
        })
    }

    getGroups() {
        return new Promise((resolve, reject) => {
            var sql = `SELECT id,name from training_group g`;
            this.db.serialize(() => {
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

    getGroup(groupId) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT id,name from training_group g where id=?`;
            this.db.serialize(() => {
                this.db.all(sql, groupId, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows });
                    }
                })
            })
        })
    }

    getGroupByRowid(rowId) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT id from training_group g where rowid=?`;
            this.db.serialize(() => {
                this.db.all(sql, rowId, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows });
                    }
                })
            })
        })
    }

    getRoleByName(roleName) {
        return new Promise((resolve, reject) => {
            var sql = `SELECT id from role where name=?`;
            this.db.serialize(() => {
                this.db.all(sql, roleName, function cb(err, rows) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: rows[0] });
                    }
                })
            })
        })
    }

    addGroupAndSetCoach(userId, group) {
        return new Promise((resolve, reject) => {
            let idPromise = this.addGroup(group).then(result => {
                this.getGroupByRowid(result.message).then(result => {
                    let groupId = result.message[0].id;
                    this.getRoleByName('coach').then(result => {
                        let roleId = result.message[0].id;
                        this.addRoleInGroup(userId, groupId, roleId).then(result => {
                            resolve({ success: true, message: { id: groupId } });
                        })
                    })
                })
            })
        })
    }

    addGroup(group) {
        return new Promise((resolve, reject) => {
            let id = guid.raw();
            let sql = `insert into training_group (id,name)  values(?,?)`;
            this.db.serialize(() => {
                this.db.run(sql, [id, group.name], function cb(err) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: this.lastID });
                    }
                })
            })
        })
    }

    addRoleInGroup(userId, groupId, roleId) {
        return new Promise((resolve, reject) => {
            let id = guid.raw();
            let sql = `insert into user_role_in_group (id,user_id,group_id,role_id)  values(?,?,?,?)`;
            this.db.serialize(() => {
                this.db.run(sql, [id, userId, groupId, roleId], function cb(err) {
                    if (err) {
                        reject({ success: false, message: err });
                    } else {
                        resolve({ success: true, message: 'Group inserted' });
                    }
                })
            })
        })
    }
}