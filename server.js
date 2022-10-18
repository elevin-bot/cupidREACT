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
    next();``
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

// Register  
app.post("/register", (req, res) => {
    const {email, password, name, photo_url, gender, age, pref_age_from, pref_age_to, pref_gender} = req.body
    const hashedPassword = generateHash(password)
  
    db.query("SELECT 1 FROM users WHERE email=$1", [email]).then((dbRes) => {
        if (dbRes.rows.length === 1) {
            res.status(400).json({ message: "User already exists" });
        } else {
            const sql = `insert into users (email, password_hash, name, photo_url, gender, age,
                 pref_age_from, pref_age_to, pref_gender) values($1,$2,$3,$4,$5,$6,$7,$8,$9)`

            db.query(sql, [email, hashedPassword, name, photo_url, gender, age, pref_age_from, pref_age_to, pref_gender]).then(() => {
                res.json({})
            }).catch((err) => {res.status(500).json({})})
        }
    })
})

// Login
app.post("/api/session", (req, res) => {
    const { email, password } = req.body
    console.log(db)
    db.query("SELECT id, password_hash, name, photo_url from users where email = $1", [email])
      .then((dbRes) => {
        if (dbRes.rows.length === 0) {
            return res.status(400).json({
                message: "The e-mail address and/or password you specified are not correct."
            });
        }
        const user = dbRes.rows[0];
        const hashedPassword = user.password;
        if (isValidPassword(password, hashedPassword)) {
            req.session.email = email;
            req.session.user_id = user.id;
            req.session.user_name = user.name;
            req.session.user_photo = user.photo_url;
            return res.json({})
        } else {
            return res.status(400).json({
                message:  "The e-mail address and/or password you specified are not correct."
            })
        }
      })
      .catch((err) => {res.status(500).json({})})
  })
  
app.get("/api/test", (req, res) => res.json({result: "ok"}));

app.get("*", (req, res) => {
    res.setHeader("content-type", "text/html");
    fs.createReadStream(`${__dirname}/client/build/index.html`).pipe(res);
});

app.listen(port, () => console.log(`Listening at localhost:${port}`));