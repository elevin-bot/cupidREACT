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
app.post("/api/register", (req, res) => {
    let {email, password, name, photo, gender, age, pref_age_from, pref_age_to, pref_gender} = req.body
    
    // Replace blanks with NULLs for numeric columns
    if (pref_age_from === '') pref_age_from = null
    if (pref_age_to === '') pref_age_to = null

    db.query("SELECT 1 FROM users WHERE email=$1", [email]).then((dbRes) => {
        if (dbRes.rows.length === 1) {
            res.status(400).json({ message: "User already exists" });
        } else {
            const sql = `insert into users (email, password_hash, name, photo_url, gender, age,
                 pref_age_from, pref_age_to, pref_gender) values($1,$2,$3,$4,$5,$6,$7,$8,$9)`

            db.query(sql, [email, generateHash(password), name, photo, gender, Number(age), pref_age_from, pref_age_to, pref_gender])
            .then(() => {
                res.json({})
            }).catch((err) => {
                console.log(err)
                res.status(500).json({})})
        }
    })
})

// Login
app.post("/api/login", (req, res) => {
    const { email, password } = req.body

    db.query("SELECT id, password_hash, name, photo_url from users where email = $1", [email])
      .then((dbRes) => {
        if (dbRes.rows.length === 0) {
            return res.status(400).json({
                message: "The e-mail address and/or password you specified are not correct."
            });
        }
        const user = dbRes.rows[0];
        const hashedPassword = user.password_hash;
        if (isValidPassword(password, hashedPassword)) {
            // Save user info in the local storage
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

// Get user info from local storage if exists (if user still logged in, returns user details or empty object if user not in session)
app.get("/api/session", (req, res) => {
    const userSession = {
        email: req.session.email,
        user_id: req.session.user_id,
        name: req.session.user_name,
        photo: req.session.user_photo,
    }  
    return res.json({userSession})
})
  
// Logout: destroy session
app.delete("/api/session", (req, res) => {
if (req.session) {
    req.session.destroy((err) => {
        if (err) {
            res.status(400).json({ message: "Unable to log out" })
        } else {
            res.json({ message: "Logout successfull" })
        }
    })
} else {
    res.end()
}
})

// Return all the user info and interests for the main page after user logged in
app.get("/api/main", async (req, res) => {
    let bagel = {'name': 'No more bagels left'}
    if (req.session.user_id) {
        try {
          // Get next match satisfying user criteria (one match at a time)
            let sql = `select m.name, m.id, m.age, m.photo_url from users u 
                              join users m on (u.pref_gender = m.gender or u.pref_gender = 'o') 
                              and (m.age >= u.pref_age_from or u.pref_age_from is null) and (m.age <= u.pref_age_to or u.pref_age_to is null)
                              where u.id = $1 and m.id <> u.id and not exists (select 1 from swiped where user_id = u.id and swiped_user_id = m.id) limit 1`
            let dbRes = await db.query(sql, [req.session.user_id])
            
            if (dbRes.rows.length > 0) {
                bagel = {
                    name: dbRes.rows[0].name,
                    id: dbRes.rows[0].id,
                    age: dbRes.rows[0].age,
                    photo_url: dbRes.rows[0].photo_url
                }
                // Get interests for bagel
                sql = "select distinct i.code, i.description from interests i join user_interests u on i.code = u.interest_code and u.user_id = $1"
                dbRes = await db.query(sql , [bagel.id])
                bagel.interests = dbRes.rows
        }
        res.json({bagel})
        }
        catch(err) {
          res.status(500).json({})
        }
    }
})
      
    //   return render_template("index.html", user=user, bagel=bagel, user_interests=user_interests)
  
    
app.get("/api/test", (req, res) => res.json({result: "ok"}));

app.get("*", (req, res) => {
    res.setHeader("content-type", "text/html");
    fs.createReadStream(`${__dirname}/client/build/index.html`).pipe(res);
});

app.listen(port, () => console.log(`Listening at localhost:${port}`));