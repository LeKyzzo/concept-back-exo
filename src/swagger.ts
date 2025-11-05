
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Concept Back Exo API',
      version: '1.0.0',
      description: 'Documentation générée par swagger-jsdoc'
    }
    ,
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123' },
            name: { type: 'string', example: 'Alice' },
            email: { type: 'string', format: 'email', example: 'alice@example.com' }
          },
          required: ['id']
        }
        ,
        UserCreate: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Alice' },
            email: { type: 'string', format: 'email', example: 'alice@example.com' }
          },
          required: ['name', 'email']
        }
        ,
        Error: {
          type: 'object',
          properties: {
            code: { type: 'integer', example: 404 },
            message: { type: 'string', example: 'User not found' },
            details: { type: 'string', example: 'Additional error details (optional)' }
          },
          required: ['message']
        }
      ,
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
      }
    }
  },
  apis: ['./src/**/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
