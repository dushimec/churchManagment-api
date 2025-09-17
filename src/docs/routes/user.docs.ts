/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a paginated, filtered, and sorted list of users (admin only).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of users per page
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter by user role
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name, email, or phone
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort by field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user
 *     description: Get the authenticated user's profile.
 *     tags:
 *       - Users
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
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a user's profile by ID (self or admin).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User profile
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *   patch:
 *     summary: Update user profile
 *     description: Update a user's profile (self or admin).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               language:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       403:
 *         description: Access denied
 *       409:
 *         description: Email or phone already in use
 */

/**
 * @swagger
 * /api/v1/users/{id}/avatar:
 *   post:
 *     summary: Upload or change user avatar
 *     description: Upload or change a user's avatar (self or admin).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 description: Base64 image data or name for avatar generation
 *     responses:
 *       200:
 *         description: Avatar updated
 *       400:
 *         description: Invalid avatar format
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/v1/users/{id}/resend-code:
 *   post:
 *     summary: Resend verification code
 *     description: Resend verification code to user's email and phone (self or admin).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Verification code sent
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/users/{id}/role:
 *   patch:
 *     summary: Update user role
 *     description: Update a user's role (admin only).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: New role
 *     responses:
 *       200:
 *         description: User role updated
 *       400:
 *         description: Invalid role
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/v1/users/{id}/delete:
 *   patch:
 *     summary: Soft delete user
 *     description: Soft delete a user account (admin or self).
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User account soft deleted
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */