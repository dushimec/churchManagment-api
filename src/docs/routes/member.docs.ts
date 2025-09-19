/**
 * @swagger
 * tags:
 *   - name: Members
 *     description: Member management
 */

/**
 * @swagger
 * /api/v1/members:
 *   post:
 *     summary: Create a new member
 *     description: Add a new church member.
 *     tags:
 *       - Members
 *     security:
 *       - Authentication: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               names:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: +250788123456
 *               idNumber:
 *                 type: string
 *                 example: 1199999999999999
 *               district:
 *                 type: string
 *                 example: Gasabo
 *               sector:
 *                 type: string
 *                 example: Remera
 *               cell:
 *                 type: string
 *                 example: Nyabisindu
 *               churchCell:
 *                 type: string
 *                 example: Cell A
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
 *               spiritualMaturity:
 *                 type: string
 *                 example: Growing
 *               ministryPreferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Choir", "Youth"]
 *     responses:
 *       201:
 *         description: Member created successfully
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
 *                   example: Member created successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Member'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/members:
 *   get:
 *     summary: Get all members
 *     description: Retrieve a paginated list of all members, with search and sorting.
 *     tags:
 *       - Members
 *   security:
 *     - Authentication: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *         example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *         example: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *         example: desc
 *     responses:
 *       200:
 *         description: List of members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Member'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */

/**
 * @swagger
 * /api/v1/members/{id}:
 *   get:
 *     summary: Get a member by ID
 *     description: Retrieve a single member by their unique ID.
 *     tags:
 *       - Members
 *   security:
 *     - Authentication: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Member'
 *       404:
 *         description: Member not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/members/{id}:
 *   put:
 *     summary: Update a member
 *     description: Update an existing member's information.
 *     tags:
 *       - Members
 *     security:
 *       - Authentication: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               names:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: +250788123456
 *               idNumber:
 *                 type: string
 *                 example: 1199999999999999
 *               district:
 *                 type: string
 *                 example: Gasabo
 *               sector:
 *                 type: string
 *                 example: Remera
 *               cell:
 *                 type: string
 *                 example: Nyabisindu
 *               churchCell:
 *                 type: string
 *                 example: Cell A
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
 *               spiritualMaturity:
 *                 type: string
 *                 example: Growing
 *               ministryPreferences:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Choir", "Youth"]
 *     responses:
 *       200:
 *         description: Member updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Member updated successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Member'
 *       404:
 *         description: Member not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /api/v1/members/{id}:
 *   delete:
 *     summary: Delete a member
 *     description: Permanently delete a member by ID.
 *     tags:
 *       - Members
 *     security:
 *       - Authentication: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                   example: Member deleted successfully.
 *       404:
 *         description: Member not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         names:
 *           type: string
 *         email:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         idNumber:
 *           type: string
 *         district:
 *           type: string
 *         sector:
 *           type: string
 *         cell:
 *           type: string
 *         churchCell:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         maritalStatus:
 *           type: string
 *         nationality:
 *           type: string
 *         occupation:
 *           type: string
 *         address:
 *           type: string
 *         baptismDate:
 *           type: string
 *           format: date
 *         confirmationDate:
 *           type: string
 *           format: date
 *         spiritualMaturity:
 *           type: string
 *         ministryPreferences:
 *           type: array
 *           items:
 *             type: string
 *         dateJoined:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error message
 */