/**
 * @swagger
 * component:
 *   schemas:
 *      Rore:
 *       type: object
 *      enum:
 *        - ADMIN
 *        - MEMBER
 *        - PASTOR
 *        - DEACON
 *      description: The user roles in the system
 *    ProfileImage:
 *       type: object
 *       nullable: true
 *       properties:
 *         url:
 *          type: string
 *          description: The URL of the profile image
 *        example: "https://cloudinary.com/..."
 *   User:
 *      - id
 *      - firstName
 *      - lastName
 *      - email
 *      - password
 *      - phone
 *      - isVerified
 *      - verificationToken
 *      - role
 *      - profileImage
 *   Properties:
 *      id: {
 *         type: string,
 *         description: The unique identifier for the user
 *      }
 *      firstName: {
 *         type: string,
 *         description: The user's first name
 *      }
 *      lastName: {
 *         type: string,
 *         description: The user's last name
 *      }
 *      email: {
 *         type: string,
 *         format: email,
 *         description: The user's email address
 *      }
 *      password: {
 *         type: string,
 *         format: password,
 *         description: The user's password
 *      }
 *      role: {
 *         type: string,
 *         $ref: '#/components/schemas/Role',
 *         description: The user's role in the system
 *      }
 *      profileImage: {
 *         type: object,
 *         nullable: true,
 *         properties: {
 *            url: {
 *               type: string,
 *               description: The URL of the profile image
 *            }
 *         }
 *      }
 *    isVerified: {
 *         type: boolean,
 *         default: false,
 *         description: Indicates if the user's email is verified
 *     }
 *  isEmailVerified: {
 *         type: boolean,
 *         default: false,
 *         description: Indicates if the user's email is verified
 *     }
 *   phone:{
 *      type: string,
 *      description: The user's phone number
 *   }
 *   verificationToken: {
 *     type: string,
 *    nullable: true,
 *     description: The token used for email verification
 *    } 
 *  resetPasswordToken: {
 *     type: string,
 *    nullable: true,
 *     description: The token used for password reset
 *    }
 * 
 *     createdAt: {
 *         type: string,
 *         format: date-time,
 *         description: The date and time when the user was created
 *     }
 *    updatedAt: {
 *         type: string,
 *         format: date-time,
 *         description: The date and time when the user was last updated
 *     }
 */