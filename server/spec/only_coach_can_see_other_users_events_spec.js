var request = require("request");
var base_url = "http://localhost:9080/api/"

describe("Coach should see other users in group", () => {
    describe("GET /", () => {
        let authData = {};
        let data = {};
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
            options.url = base_url + 'groupsUsers/331f3a31a-fbbe-493d-ba26-acc1cedeff63';
            request.get(options, (error, response, body) => {
                data = JSON.parse(body);
                done();
            });
        });

        it("Auth status success", () => {
            expect(authData.success).toBe(true);
        });

        it("groupsUsers status success", () => {
            expect(data.success).toBe(true);
        });
        
        it("As a coach should not get 'Not a coach of group'", () => {
            let isArray = data.message instanceof Array;
            let msg = 'Not a coach of group.';
            expect(isArray || msg).toBe(true);
        });
    });
});