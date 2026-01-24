
const express = require('express');
const { initDb } = require('./db/connect');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
 
app.use('/actors', require('./routes/actors'));
app.use('/movies', require('./routes/movies'));
 
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project2 API',
      version: '1.0.0',
      description: 'Actors & Movies API'
    }
  },
  apis: ['./routes/*.js'] 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

initDb().then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
