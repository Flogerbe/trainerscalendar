var request = require("request");
var base_url = "http://localhost:9080/api/"

describe("Coach should see other users in group", ()  => {
  describe("GET /", () => {
    let data = {};
    var options = {
      url: base_url + 'groupsUsers/331f3a31a-fbbe-493d-ba26-acc1cedeff63',
      headers: {
          token: ''
      }
    };

    beforeEach((done) => {
      // authenticate
      request.post(base_url + 'login', {json: true, body: { "username": "timo.pajumaki@live.com", "password": "password" }}, (error, response, body) => {
        options.headers.token = body.token;
        done();
      });

      // get
      request.get(options, (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });

    it("Status 200", () => {
      expect(data.status).toBe(200);
    });

    it("Should not get 'Not a coach of group'", () => {
      console.log(data.body.message);
      expect(data.body.message).not.toEqual('Not a coach of group');
    });
  });
});