/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - recipientId
 *         - title
 *         - message
 *         - type
 *       properties:
 *         id:
 *           type: string
 *         recipientId:
 *           type: string
 *         title:
 *           type: string
 *         message:
 *           type: string
 *         type:
 *           type: string
 *           description: e.g., EVENT_ALERT, SYSTEM_MSG
 *         read:
 *           type: boolean
 *           default: false
 *         sentAt:
 *           type: string
 *           format: date-time
 *         relatedEventId:
 *           type: string
 *
 *     Message:
 *       type: object
 *       required:
 *         - senderId
 *         - receiverId
 *         - content
 *       properties:
 *         id:
 *           type: string
 *         senderId:
 *           type: string
 *         receiverId:
 *           type: string
 *         content:
 *           type: string
 *         read:
 *           type: boolean
 *           default: false
 *         timestamp:
 *           type: string
 *           format: date-time
 */
