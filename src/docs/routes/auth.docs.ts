/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with extended profile and family members.
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
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: Dushime
 *               email:
 *                 type: string
 *                 format: email
 *                 example: christian.dushime@example.com
 *               phone:
 *                 type: string
 *                 pattern: '^\\+?[1-9]\\d{1,14}$'
 *                 minLength: 10
 *                 maxLength: 15
 *                 example: +250788123456
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 100
 *                 example: P@ssw0rd
 *               role:
 *                 type: string
 *                 example: MEMBER
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               gender:
 *                 type: string
 *                 example: Male
 *               maritalStatus:
 *                 type: string
 *                 example: Married
 *               nationality:
 *                 type: string
 *                 example: Rwandan
 *               occupation:
 *                 type: string
 *                 example: Engineer
 *               address:
 *                 type: string
 *                 example: Kigali, Rwanda
 *               baptismDate:
 *                 type: string
 *                 format: date
 *                 example: "2010-05-20"
 *               confirmationDate:
 *                 type: string
 *                 format: date
 *                 example: "2011-06-15"
 *               spouseName:
 *                 type: string
 *                 example: Jane Doe
 *               spousePhone:
 *                 type: string
 *                 example: +250788654321
 *               numberOfChildren:
 *                 type: integer
 *                 example: 2
 *               emergencyContactName:
 *                 type: string
 *                 example: John Doe
 *               emergencyContactPhone:
 *                 type: string
 *                 example: +250788111222
 *               spiritualMaturity:
 *                 type: string
 *                 example: Growing
 *               ministryPreferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Choir", "Youth"]
 *               familyMembers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Child One
 *                     relationship:
 *                       type: string
 *                       example: Child
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "2015-03-10"
 *                     isMember:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       201:
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
 *                   example: "Registration successful. Please check your email for verification."
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     role:
 *                       type: string
 *                     language:
 *                       type: string
 *                     avatarUrl:
 *                       type: string
 *                     isEmailVerified:
 *                       type: boolean
 *                     status:
 *                       type: string
 *                     is2FAEnabled:
 *                       type: boolean
 *                     phoneVerified:
 *                       type: boolean
 *                     memberProfile:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: string
 *                         dateOfBirth:
 *                           type: string
 *                           format: date
 *                         gender:
 *                           type: string
 *                         maritalStatus:
 *                           type: string
 *                         nationality:
 *                           type: string
 *                         occupation:
 *                           type: string
 *                         address:
 *                           type: string
 *                         baptismDate:
 *                           type: string
 *                           format: date
 *                         confirmationDate:
 *                           type: string
 *                           format: date
 *                         dateJoined:
 *                           type: string
 *                           format: date-time
 *                         spouseName:
 *                           type: string
 *                         spousePhone:
 *                           type: string
 *                         numberOfChildren:
 *                           type: integer
 *                         emergencyContactName:
 *                           type: string
 *                         emergencyContactPhone:
 *                           type: string
 *                         spiritualMaturity:
 *                           type: string
 *                         ministryPreferences:
 *                           type: array
 *                           items:
 *                             type: string
 *                         familyMembers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               relationship:
 *                                 type: string
 *                               dateOfBirth:
 *                                 type: string
 *                                 format: date
 *                               isMember:
 *                                 type: boolean
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation failed. Possible reasons include invalid data, duplicate email/phone, or bad request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email or phone already in use
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
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Get the authenticated user's profile.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       404:
 *         description: User not found
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
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Phone number verified successfully
 *       400:
 *         description: Invalid or expired code
 */