const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const Connection = require("./config/db");

const userRouter = require("./routes/user.route");
const jobRouter = require("./routes/job.route");
const companyRouter = require("./routes/company.route");
const applicationRouter = require("./routes/application.route");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Portal By NextHire',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8000'
      },
      {
        url: "https://digitalpaani-book-management.onrender.com"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));


app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(cors());

Connection();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/application", applicationRouter);

console.log(app.listenerCount("connection"));
app.get("/", (req, res) => {
  res.send("Server is Running! 🚀");
});

module.exports = app;
