/**
 * @swagger
 * components:
 *   schemas:
 *     PrayerRequest:
 *       type: object
 *       required:
 *         - request
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the prayer request
 *         memberId:
 *           type: string
 *           description: ID of the member who made the request
 *         request:
 *           type: string
 *           description: The content of the prayer request
 *         isPrivate:
 *           type: boolean
 *           default: true
 *           description: Whether the request is private
 *         responded:
 *           type: boolean
 *           default: false
 *           description: Whether a pastor has responded
 *         response:
 *           type: string
 *           description: The pastor's response
 *         pastorId:
 *           type: string
 *           description: ID of the pastor who responded
 *         respondedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     CounselingAppointment:
 *       type: object
 *       required:
 *         - pastorId
 *         - date
 *         - duration
 *         - purpose
 *       properties:
 *         id:
 *           type: string
 *         memberId:
 *           type: string
 *         pastorId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: integer
 *           description: Duration in minutes
 *         purpose:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
