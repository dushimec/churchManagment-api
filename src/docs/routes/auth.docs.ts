/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details.
 *      tags:[Authorization]
 * parameters:
 *   - in: query
 *     name: lang
 *     schema:
 *         type: string
 *     description: The language selected by the user, EN/FR
 *     example: EN
 * requestBody:
 *   required: true
 *  content:
 *   application/json:
 *    schema:
 *      type: object
 *    properties:
 *      - firstName
 *      - lastName
 *      - email
 *      - phone
 *      - password
 *      - role
 *    properties:
 *      firstName:
 *        type: string
 *        minLength: 2
 *        maxLength: 50
 *        example: Christian
 *     description: The user's first name.
 *     lastName:
 *       type: string
 *       minLength: 2
 *       maxLength: 50
 *       example: Dushime
 *     description: The user's last name.
 *    email:
 *      type: string
 *      format: email
 *      example: christian.dushime@example.com
 *     description: The user's email address.
 *   phone: 
 *    type: string
 *   pattern: '^\+?[1-9]\d{1,14}$'
 *  minLength: 10
 * maxLength: 15
 *   example: +250788123456
 *   description: The user's phone number.
 * 
 * password:
 *   type: string
 *   minLength: 8
 *   maxLength: 100
 *   example: P@ssw0rd
 *   description: The user's password.
 * 
 */