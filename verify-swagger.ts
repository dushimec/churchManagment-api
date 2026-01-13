import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Test",
            version: "1.0.0",
        },
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
    apis: ["src/docs/**/*.ts"],
};

try {
    console.log("Parsing Swagger documentation...");
    const spec = swaggerJsdoc(options);
    console.log("✅ Swagger documentation parsed successfully!");
} catch (error) {
    console.error("❌ Error parsing Swagger documentation:");
    console.error(error);
    process.exit(1);
}
