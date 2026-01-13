/**
 * @swagger
 * components:
 *   schemas:
 *     MarriageRequest:
 *       type: object
 *       required:
 *         - brideId
 *         - groomId
 *         - weddingDate
 *         - witness1Name
 *         - witness1Phone
 *         - witness2Name
 *         - witness2Phone
 *       properties:
 *         id:
 *           type: string
 *         brideId:
 *           type: string
 *         groomId:
 *           type: string
 *         weddingDate:
 *           type: string
 *           format: date-time
 *         location:
 *           type: string
 *         witness1Name:
 *           type: string
 *         witness1Phone:
 *           type: string
 *         witness2Name:
 *           type: string
 *         witness2Phone:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         approvedById:
 *           type: string
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     BaptismRequest:
 *       type: object
 *       required:
 *         - childName
 *         - dateOfBirth
 *       properties:
 *         id:
 *           type: string
 *         childName:
 *           type: string
 *         dateOfBirth:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED]
 *         scheduledDate:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 */
