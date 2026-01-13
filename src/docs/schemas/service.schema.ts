/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - title
 *         - serviceType
 *         - date
 *         - location
 *         - startTime
 *         - endTime
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         serviceType:
 *           type: string
 *           enum: [SUNDAY_SERVICE, BIBLE_STUDY, CHOIR_PRACTICE, PRAYER_MEETING, OTHER]
 *         date:
 *           type: string
 *           format: date
 *         location:
 *           type: string
 *         preacherId:
 *           type: string
 *         choirLeaderId:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         attendanceCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     Attendance:
 *       type: object
 *       required:
 *         - serviceId
 *         - memberId
 *         - method
 *       properties:
 *         id:
 *           type: string
 *         serviceId:
 *           type: string
 *         memberId:
 *           type: string
 *         method:
 *           type: string
 *           description: e.g., QR_CODE, MANUAL
 *         timestamp:
 *           type: string
 *           format: date-time
 */
