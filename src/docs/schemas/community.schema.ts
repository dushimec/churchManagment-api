/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - eventType
 *         - date
 *         - location
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         eventType:
 *           type: string
 *           enum: [WEDDING, BAPTISM, CONFERENCE, RETREAT, SEMINAR, OTHER]
 *         date:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         organizerId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     EventRegistration:
 *       type: object
 *       required:
 *         - eventId
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *         eventId:
 *           type: string
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
