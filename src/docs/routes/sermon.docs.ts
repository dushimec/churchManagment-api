/**
 * @swagger
 * /api/v1/sermons:
 *   post:
 *     summary: Create a new sermon
 *     tags: [Sermons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sermon'
 *     responses:
 *       201:
 *         description: Sermon created
 *
 *   get:
 *     summary: Get all sermons
 *     tags: [Sermons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: preacherId
 *         schema:
 *           type: string
 *       - in: query
 *         name: theme
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of sermons
 *
 * /api/v1/sermons/{id}:
 *   get:
 *     summary: Get sermon by ID
 *     tags: [Sermons]
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
 *         description: Sermon details
 *   put:
 *     summary: Update sermon
 *     tags: [Sermons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sermon'
 *     responses:
 *       200:
 *         description: Sermon updated
 *   delete:
 *     summary: Delete sermon
 *     tags: [Sermons]
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
 *         description: Sermon deleted
 */
