import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Real-Time Log Processing Microservice API',
            version: '1.0.0',
            description: 'API documentation for the log processing microservice using BullMQ, Next.js, and Supabase.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['./app/api/**/*.ts'], // Path to the API docs
};

export const spec = swaggerJsdoc(options);
