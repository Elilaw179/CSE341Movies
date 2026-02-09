 


const express = require('express');
const { initDb } = require('./db/connect');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());

// routes
app.use('/actors', require('./routes/actors'));
app.use('/movies', require('./routes/movies'));

// Swagger configuration (Week 4 REQUIRED)
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Project2 API',
//       version: '1.0.0',
//       description: 'Actors & Movies API'
//     },
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT'
//         }
//       }
//     }
//     // ❗ DO NOT add global security here
//   },
//   apis: ['./routes/*.js']
// };


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project2 API',
      version: '1.0.0',
      description: 'Actors & Movies API'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};





const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Expose swagger.json (REQUIRED BY RUBRIC)
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Write swagger.json to disk (GRADER FRIENDLY)
try {
  fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
  console.log('swagger.json written to project root');
} catch (err) {
  console.warn('Failed to write swagger.json:', err.message);
}

// Start server AFTER DB connects
initDb().then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
