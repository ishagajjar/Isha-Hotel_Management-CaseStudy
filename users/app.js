const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const Role = db.role;

const app = express();

var corsOptions = {
  origin: "http://localhost:4200"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

db.mongoose
  .connect('mongodb+srv://IshaGajjar:Eternity1998@ishacluster1.qlt2o.mongodb.net/Hotel-Management-Staff?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });


function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "receptionist"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'receptionist' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

const swaggerOptions = {
  swaggerDefinition: {
    info:{
      title: "User Api",
      description: "User Authentication",
      contact: {
        name: "Isha Gajjar"
      },
      servers: ['http://localhost:8080']

    }
  },
  apis: ['./routes/*.js']
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// simple route
/**
 * @swagger
 * /api/test/all:
 * get:
 *  description To allow public access
 * responses:
 *    '200':
 *        description: Success
 */
app.get("/", (req, res) => {
  res.json({ message: "Hotel Management" });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
