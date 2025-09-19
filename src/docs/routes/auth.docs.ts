/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: query
 *         name: lang
 *         schema:
 *           type: string
 *         description: The language selected by the user, EN/FR
 *         example: EN
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Christian
 *                 description: The user's first name.
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Dushime
 *                 description: The user's last name.
 *               email:
 *                 type: string
 *                 format: email
 *                 example: christian.dushime@example.com
 *                 description: The user's email address.
 *               phone:
 *                 type: string
 *                 pattern: '^\\+?[1-9]\\d{1,14}$'
 *                 minLength: 10
 *                 maxLength: 15
 *                 example: +250788123456
 *                 description: The user's phone number.
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 100
 *                 example: P@ssw0rd
 *                 description: The user's password.
 *               role:
 *                 type: string
 *                 example: user
 *                 description: The user's role.
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Registration successful. Please verify your phone number."
 *       400:
 *         description: |
 *           Validation failed. Possible reasons:
 *           - User already exists
 *           - Invalid name format (must be first and last name)
 *           - Invalid email format
 *           - Password doesn't meet strength requirements
 *           - Invalid phone number format (E.164)
 *           - Phone number already in use
 *           - Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized or phone verification required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticate user and return tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: christian.dushime@example.com
 *               password:
 *                 type: string
 *                 example: P@ssw0rd
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Incorrect email or password
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using a valid refresh token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Refresh token required
 *       401:
 *         description: Invalid or expired refresh token
 */

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Send a password reset link to the user's email.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: christian.dushime@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset the user's password using a token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "reset-token"
 *               password:
 *                 type: string
 *                 example: "NewP@ssw0rd"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired reset token
 */

/**
 * @swagger
 * /api/v1/auth/enable-2fa:
 *   post:
 *     summary: Enable 2FA
 *     description: Enable two-factor authentication for the user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: +250788123456
 *     responses:
 *       200:
 *         description: Verification code sent
 *       400:
 *         description: Phone number required
 *       409:
 *         description: Phone already in use
 */

/**
 * @swagger
 * /api/v1/auth/verify-2fa:
 *   post:
 *     summary: Verify 2FA code
 *     description: Verify the code sent to enable 2FA.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: christian.dushime@example.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 *       400:
 *         description: Invalid or expired code
 */

/**
 * @swagger
 * /api/v1/auth/verify-2fa-code:
 *   post:
 *     summary: Verify 2FA code (alternate endpoint)
 *     description: Verify the code sent to enable 2FA (alternate endpoint).
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 *       400:
 *         description: Invalid or expired code
 */

/**
 * @swagger
 * /api/v1/auth/send-verification-sms:
 *   post:
 *     summary: Send phone verification SMS
 *     description: Send a verification code to the user's phone.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: +250788123456
 *     responses:
 *       200:
 *         description: Verification code sent via SMS
 *       400:
 *         description: Phone number required
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logout the user (client-side token deletion).
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logged out successfully
 */

/**
 * @swagger
 * /api/v1/auth/verify-email:
 *   post:
 *     summary: Verify email
 *     description: Verify the user's email using a code.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "christian.dushime@example.com"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired code
 */

/**
 * @swagger
 * /api/v1/auth/verify-phone:
 *   post:
 *     summary: Verify phone
 *     description: Verify the user's phone number using a code.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+250788123456"
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Phone number verified successfully
 *       400:
 *         description: Invalid or expired code
 */