import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "church management API Documentation",
      version: "1.1.0",
      description:
        "Comprehensive API documentation for churchmanagement Backend.\n\nchurchmanagement is a church management platform. All users are verified . This documentation covers authentication, church management, and more.",
    },
    tags: [
      { name: "Public", description: "These are accessible by any user" },
      {
        name: "Authentication",
        description: "Authorizations endpoints for users",
      },

      { name: "Admin", description: "Admin management endpoints" },
      { name: "Users", description: "User management endpoints" },
      
    ],
    servers: [
      {
        url: "https://churchmanagement.onrender.com",
        description: "Staging server",
      },
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/docs/**/*.ts", "src/docs/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
