const express = require("express");
const fs = require("fs");
const app = express();
const pg = require('pg')
const { generateHash, isValidPassword } = require('./util/hash');

require("dotenv").config();
const expressSession = require("express-session"); // Express library to handle sessions

// We need to store sessions in the DB, otherwise it'll forget them all when you restart the server.
const pgSession = require("connect-pg-simple")(expressSession);

const port = process.env.PORT || 3001;

const db = new pg.Pool({database: 'cupid'})

app.use(express.json());
app.use(express.static("./client/build"));

app.use((req, res, next) => {
    console.log(
      `I am getting a request with method: ${req.method} and route: ${
        req.path
      } at ${new Date()}`
    );
    next();
  });
  
  app.use(
    expressSession({
      store: new pgSession({
        pool: db, // Connects to our postgres db
        createTableIfMissing: true, // Creates a session table in your database (go look at it!)
      }),
      secret: process.env.EXPRESS_SESSION_SECRET_KEY,
    })
  ); 


app.get("/api/test", (req, res) => res.json({result: "ok"}));

app.get("*", (req, res) => {
    res.setHeader("content-type", "text/html");
    fs.createReadStream(`${__dirname}/client/build/index.html`).pipe(res);
});

app.listen(port, () => console.log(`Listening at localhost:${port}`));