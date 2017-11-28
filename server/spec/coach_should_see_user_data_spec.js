var request = require('request');
var base_url = 'http://localhost:9080/api/'

describe('Coach should see users data', () => {
    describe('GET /', () => {
        let authData;
        let data;
        var options = {
            url: '',
            headers: {
                'token': '',
                'content-type': 'application/json'
            }
        };

        beforeAll((done) => {
            // authenticate
            options.url = base_url + 'login'; 
            request.post(base_url + 'login', { json: true, body: { 'username': 'timo.pajumaki@live.com', 'password': 'password' } }, (error, response, body) => {
                authData = body;
                options.headers.token = body.token;
                done();
            });
        });

        beforeAll((done) => {
            // get users from group
            options.url = base_url + 'users/onni.pajumaki@live.fi';
            request.get(options, (error, response, body) => {
                data = JSON.parse(body);
                done();
            });
        });
        
        it('As a coach should get users data', () => {
            expect(data != undefined && data.success == true).toBe(true);
        });
    });
});