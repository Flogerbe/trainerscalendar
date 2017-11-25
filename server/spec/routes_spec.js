var request = require("request");
var base_url = "http://localhost:9080/api/"

describe("Should get users", ()  => {
  describe("GET /", () => {
    let data = {};
    var options = {
      url: base_url + 'users',
      headers: {
          token: ''
      }
    };

    beforeAll((done) => {
      // authenticate
      request.post(base_url + 'login', {json: true, body: { "username": "onni.pajumaki@live.fi", "password": "password" }}, (error, response, body) => {
        options.headers.token = body.token;
        done();
      });
    });

    beforeAll((done) => {
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

    it("Body success", () => {
      expect(data.body.success).toBe(true);
    });
  });
});