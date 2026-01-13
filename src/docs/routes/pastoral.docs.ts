/**
 * @swagger
 * /api/v1/pastoral/prayer-requests:
 *   post:
 *     summary: Create a new prayer request
 *     tags: [Pastoral]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - request
 *             properties:
 *               request:
 *                 type: string
 *                 minLength: 10
 *               isPrivate:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Prayer request created successfully
 *       400:
 *         description: Validation error
 *
 *   get:
 *     summary: Get all prayer requests
 *     tags: [Pastoral]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: string
 *       - in: query
 *         name: responded
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of prayer requests
 *
 * /api/v1/pastoral/prayer-requests/{id}/respond:
 *   patch:
 *     summary: Respond to a prayer request (Pastor/Admin only)
 *     tags: [Pastoral]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *                 minLength: 5
 *     responses:
 *       200:
 *         description: Response recorded successfully
 *
 * /api/v1/pastoral/counseling-appointments:
 *   post:
 *     summary: Schedule a counseling appointment
 *     tags: [Pastoral]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CounselingAppointment'
 *     responses:
 *       201:
 *         description: Appointment scheduled successfully
 *
 *   get:
 *     summary: Get counseling appointments
 *     tags: [Pastoral]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pastorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: List of appointments
 */
