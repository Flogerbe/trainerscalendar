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
