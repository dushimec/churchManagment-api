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
      { name: "Authentication", description: "Authorizations endpoints for users" },
      { name: "Admin", description: "Admin management endpoints" },
      { name: "Users", description: "User management endpoints" },
      { name: "Members", description: "Member management endpoints" },
      { name: "Services", description: "Church service and attendance endpoints" },
      { name: "Pastoral", description: "Prayer requests and counseling endpoints" },
      { name: "Finance", description: "Contribution and financial endpoints" },
      { name: "Sermons", description: "Sermon and teaching endpoints" },
      { name: "Media", description: "Church media and asset endpoints" },
      { name: "Certifications", description: "Marriage and baptism request endpoints" },
      { name: "Communication", description: "Notification and messaging endpoints" },
      { name: "Community", description: "Event and registration endpoints" },
      { name: "Forms", description: "Church standard forms endpoints" },

    ],
    servers: [
      {
        url: "https://churchmanagement-ao3w.onrender.com",
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
