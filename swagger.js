const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express');




const contact = {
    name: "ENONE Idriss",
    email: "enonedjabe@gmail.com",
    url: "https://github.com/DesmondSanctity/node-js-swagger"
}

const license = {
  name: "MIT",
  url: "https://spdx.org/licenses/MIT.html",
}

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-com web site management API',
      version: '1.0.0',
      description: 'A simple Express API with Swagger documentation',
      contact,
      license
    },
    servers: [
      {
        url: 'http://localhost:8081',
      },
    ],
  },
  // looks for configuration in specified directories
  apis: ['./app/routes/*.js'],
  //['**/*.js'],
}

const specs = swaggerJsdoc(options)

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}

/**
 * const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
};
 */