/**
 * @swagger
 * components:
 *   schemas:
 *     Contribution:
 *       type: object
 *       required:
 *         - amount
 *         - contributionType
 *         - paymentMethod
 *         - transactionId
 *       properties:
 *         id:
 *           type: string
 *         memberId:
 *           type: string
 *         amount:
 *           type: number
 *           format: decimal
 *         contributionType:
 *           type: string
 *           enum: [TITHE, OFFERING, DONATION, PLEDGE]
 *         paymentMethod:
 *           type: string
 *           enum: [MOBILE_MONEY, CREDIT_CARD, BANK_TRANSFER, CASH]
 *         transactionId:
 *           type: string
 *         receiptUrl:
 *           type: string
 *           format: uri
 *         notes:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         verified:
 *           type: boolean
 *         verifiedById:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
