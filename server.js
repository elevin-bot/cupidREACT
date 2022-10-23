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
            res.status(400).json({ message: "User already exists" })
        } else {
            const sql = `insert into users (email, password_hash, name, photo_url, gender, age,
                 pref_age_from, pref_age_to, pref_gender) values($1,$2,$3,$4,$5,$6,$7,$8,$9)`

            db.query(sql, [email, generateHash(password), name, photo, gender, Number(age), pref_age_from, pref_age_to, pref_gender])
            .then(() => {
                res.json({})
            }).catch((err) => {
                console.log(err)
                res.status(500).json({})
            })
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
            req.session.email = email
            req.session.user_id = user.id
            req.session.user_name = user.name
            req.session.user_photo = user.photo_url
            // Return user details to caller
            const userSession = {
                email: req.session.email,
                user_id: req.session.user_id,
                name: req.session.user_name,
                photo: req.session.user_photo,
            }          
            return res.json(userSession)
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
    return res.json(userSession)
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
    } else {res.send()}
})

// Get profile data
app.get("/api/profile", (req, res) => {
    const sql = "SELECT name, photo_url, gender, age, pref_age_from, pref_age_to, pref_gender from users where id = $1"
    db.query(sql, [req.session.user_id])
    .then((dbRes) => {
        const profile = {
            email: '',
            password: '',
            name: dbRes.rows[0].name,
            photo: dbRes.rows[0].photo_url,
            gender: dbRes.rows[0].gender,
            age: dbRes.rows[0].age,
            pref_age_from: dbRes.rows[0].pref_age_from,
            pref_age_to: dbRes.rows[0].pref_age_to,
            pref_gender: dbRes.rows[0].pref_gender
        }            
        res.json(profile)
    }).catch((err) => {
        console.log(err)
        res.status(500).json({})
    })
})

// Update profile
app.put("/api/profile", (req, res) => {
    let {email, password, name, photo, gender, age, pref_age_from, pref_age_to, pref_gender} = req.body
    
    // Replace blanks with NULLs for numeric columns
    if (pref_age_from === '') pref_age_from = null
    if (pref_age_to === '') pref_age_to = null

    const sql = "update users set name=$1, photo_url=$2, gender=$3, age=$4, pref_age_from=$5,pref_age_to=$6, pref_gender=$7 where id =$8"

    db.query(sql, [name, photo, gender, Number(age), pref_age_from, pref_age_to, pref_gender, req.session.user_id])
    .then(() => {
        req.session.user_name = name
        res.json({})
    }).catch((err) => {
        console.log(err)
        res.status(500).json({})
    })
})

// Get all the user info and interests for the main page after user logged in
app.get("/api/main", async (req, res) => {
    let bagel = {'name': 'No more suggestions left. Expand your filters.'}
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

// Update swipe table with a like/not like
app.post("/api/like", (req, res) => {
    const {swiped_user_id, like} = req.body
    db.query("insert into swiped (user_id, swiped_user_id, liked) values($1, $2, $3)", [req.session.user_id, swiped_user_id, like])
    .then((dbRes) => {return res.json({})})
    .catch((err) => {res.status(500).json({})})
})

 // Get all the matches for user
app.get("/api/matches", (req, res) => {
    const sql = `select name, age, photo_url 
                 from swiped s join users u on u.id = s.swiped_user_id and s.liked = True 
                 where s.user_id = $1 
                 and s.user_id in (select swiped_user_id from swiped where liked = True and user_id = s.swiped_user_id)`
    db.query(sql, [req.session.user_id])
    .then((dbRes) => {return res.json(dbRes.rows)})
    .catch((err) => {res.status(500).json({})})
})
    

app.get("*", (req, res) => {
    res.setHeader("content-type", "text/html");
    fs.createReadStream(`${__dirname}/client/build/index.html`).pipe(res);
});

app.listen(port, () => console.log(`Listening at localhost:${port}`));