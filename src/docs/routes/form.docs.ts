/**
 * @swagger
 * tags:
 *   - name: Forms
 *     description: Church forms and service requests
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     YouthForm:
 *       type: object
 *       properties:
 *         name: { type: string }
 *         idNumber: { type: string }
 *         phone: { type: string }
 *         district: { type: string }
 *         cell: { type: string }
 *         churchCell: { type: string }
 *         youthFamily: { type: string }
 *     CellRecommendation:
 *       type: object
 *       properties:
 *         names: { type: string }
 *         idNumber: { type: string }
 *         phone: { type: string }
 *         email: { type: string }
 *         district: { type: string }
 *         cell: { type: string }
 *         churchCellName: { type: string }
 *     ChurchRecommendation:
 *       type: object
 *       properties:
 *         type: { type: string, enum: [YOUTH, OLD] }
 *         idNumber: { type: string }
 *         name: { type: string }
 *         email: { type: string }
 *         phone: { type: string }
 *         district: { type: string }
 *         cell: { type: string }
 *         cellRecommendation: { type: string }
 *         youthRecommendation: { type: string }
 *         passportPhoto: { type: string }
 *     BaptismCertification:
 *       type: object
 *       properties:
 *         name: { type: string }
 *         email: { type: string }
 *         phone: { type: string }
 *         baptismDate: { type: string, format: date }
 *     MarriageCertificate:
 *       type: object
 *       properties:
 *         brideName: { type: string }
 *         groomName: { type: string }
 *         brideEmail: { type: string }
 *         groomEmail: { type: string }
 *         bridePhone: { type: string }
 *         groomPhone: { type: string }
 *         brideAddress: { type: string }
 *         groomAddress: { type: string }
 *         marenName: { type: string }
 *         parenName: { type: string }
 *         parentAddress: { type: string }
 *     WeddingServiceRequest:
 *       type: object
 *       properties:
 *         brideName: { type: string }
 *         groomName: { type: string }
 *         brideEmail: { type: string }
 *         groomEmail: { type: string }
 *         bridePhone: { type: string }
 *         groomPhone: { type: string }
 *         marenName: { type: string }
 *         parenName: { type: string }
 *         idCopies: { type: array, items: { type: string } }
 *     ChildDedicationRequest:
 *       type: object
 *       properties:
 *         parentNames: { type: string }
 *         childNames: { type: string }
 *         dateOfBirth: { type: string, format: date }
 *         parentPhone: { type: string }
 *         parentEmail: { type: string }
 *         dedicationDate: { type: string, format: date }
 *         churchService: { type: string }
 */

/**
 * @swagger
 * /api/v1/forms/youth:
 *   post:
 *     summary: Submit a Youth Form
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/YouthForm' }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: Get all Youth Forms
 *     tags: [Forms]
 *     security: [{ Authentication: [] }]
 *     responses:
 *       200: { description: OK }
 *
 * /api/v1/forms/cell-recommendation:
 *   post:
 *     summary: Submit a Cell Recommendation
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CellRecommendation' }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: Get all Cell Recommendations
 *     tags: [Forms]
 *     security: [{ Authentication: [] }]
 *     responses:
 *       200: { description: OK }
 *
 * /api/v1/forms/church-recommendation:
 *   post:
 *     summary: Submit a Church Recommendation
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ChurchRecommendation' }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: Get all Church Recommendations
 *     tags: [Forms]
 *     security: [{ Authentication: [] }]
 *     responses:
 *       200: { description: OK }
 *
 * /api/v1/forms/baptism-certification:
 *   post:
 *     summary: Submit a Baptism Certification
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/BaptismCertification' }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: Get all Baptism Certifications
 *     tags: [Forms]
 *     security: [{ Authentication: [] }]
 *     responses:
 *       200: { description: OK }
 *
 * /api/v1/forms/marriage-certificate:
 *   post:
 *     summary: Submit a Marriage Certificate
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/MarriageCertificate' }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: Get all Marriage Certificates
 *     tags: [Forms]
 *     security: [{ Authentication: [] }]
 *     responses:
 *       200: { description: OK }
 *
 * /api/v1/forms/wedding-request:
 *   post:
 *     summary: Submit a Wedding Service Request
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/WeddingServiceRequest' }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: Get all Wedding Service Requests
 *     tags: [Forms]
 *     security: [{ Authentication: [] }]
 *     responses:
 *       200: { description: OK }
 *
 * /api/v1/forms/child-dedication:
 *   post:
 *     summary: Submit a Child Dedication Request
 *     tags: [Forms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ChildDedicationRequest' }
 *     responses:
 *       201: { description: Created }
 *   get:
 *     summary: Get all Child Dedication Requests
 *     tags: [Forms]
 *     security: [{ Authentication: [] }]
 *     responses:
 *       200: { description: OK }
 */

