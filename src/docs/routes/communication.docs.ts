/**
 * @swagger
 * /api/v1/communication/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Communication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *
 * /api/v1/communication/notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Communication]
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
 *         description: Notification updated
 *
 * /api/v1/communication/messages:
 *   post:
 *     summary: Send a message to another user
 *     tags: [Communication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - content
 *             properties:
 *               receiverId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message sent
 */
