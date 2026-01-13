/**
 * @swagger
 * /api/v1/certifications/marriage:
 *   post:
 *     summary: Request marriage certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarriageRequest'
 *     responses:
 *       201:
 *         description: Marriage request submitted
 *
 * /api/v1/certifications/baptism:
 *   post:
 *     summary: Request baptism certification
 *     tags: [Certifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BaptismRequest'
 *     responses:
 *       201:
 *         description: Baptism request submitted
 */
