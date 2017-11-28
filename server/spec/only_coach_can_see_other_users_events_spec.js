var request = require("request");
var base_url = "http://localhost:9080/api/"

describe("Coach should see other users in group", () => {
    describe("GET /", () => {
        let authData;
        let data;
        let userData;
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
            request.post(base_url + 'login', { json: true, body: { "username": "timo.pajumaki@live.com", "password": "password" } }, (error, response, body) => {
                authData = body;
                options.headers.token = body.token;
                done();
            });
        });

        beforeAll((done) => {
            // get users from group
            options.url = base_url + 'users/onni.pajumaki@live.fi';
            request.get(options, (error, response, body) => {
                userData = JSON.parse(body).message;
                done();
            });
        });

        beforeAll((done) => {
            // get users from group
            options.url = base_url + 'events/' + userData.id;
            request.get(options, (error, response, body) => {
                data = JSON.parse(body);
                done();
            });
        });

        it("Auth status success", () => {
            expect(authData.success).toBe(true);
        });

        it("Events status success", () => {
            expect(data.success).toBe(true);
        });
        
        it("Should get events", () => {
            expect(data.success).toBe(true);
        });
    });
});