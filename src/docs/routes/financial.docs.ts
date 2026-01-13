/**
 * @swagger
 * /api/v1/finance:
 *   post:
 *     summary: Submit a new contribution
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contribution'
 *     responses:
 *       201:
 *         description: Contribution submitted
 *
 *   get:
 *     summary: Get all contributions (Admin/Treasurer only)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: memberId
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [TITHE, OFFERING, DONATION, PLEDGE]
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of contributions
 *
 * /api/v1/finance/{id}/verify:
 *   patch:
 *     summary: Verify a contribution (Admin/Treasurer only)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution verified
 */
