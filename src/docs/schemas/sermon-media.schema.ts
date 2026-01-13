/**
 * @swagger
 * components:
 *   schemas:
 *     Sermon:
 *       type: object
 *       required:
 *         - title
 *         - preacherId
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         preacherId:
 *           type: string
 *         serviceId:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         theme:
 *           type: string
 *         scripture:
 *           type: string
 *         audioUrl:
 *           type: string
 *           format: uri
 *         videoUrl:
 *           type: string
 *           format: uri
 *         text:
 *           type: string
 *         tags:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     Media:
 *       type: object
 *       required:
 *         - url
 *         - type
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         url:
 *           type: string
 *           format: uri
 *         type:
 *           type: string
 *           enum: [IMAGE, DOCUMENT, VIDEO]
 *         sermonId:
 *           type: string
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
