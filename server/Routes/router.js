
const express = require("express");

const mysql = require("mysql2");

const router = express.Router();
const conn = require("../db/conn");


router.post("/create", (req, res) => {
    console.log("REQ BODY 👉", req.body);

    const { name, email, age, gender,mobile, state, district, add,date } = req.body;

    if (!name || !email || !age || !gender || !mobile || !state || !district || !add || !date) {
        return res.status(422).json({ error: "Please fill all the data" });
    }

    conn.query("SELECT * FROM user_manager.users WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.length) {
            return res.status(422).json({ error: "User with this email already exists" });
        } else {
            const newUser = { name, gender,email, age, mobile, state, district, add,date };
            conn.query("INSERT INTO users SET ?", newUser, (err, result) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
                return res.status(201).json(req.body);
            });
        }
    });
});


// get user data


router.get("/getusers",(req,res)=>{
    conn.query("SELECT * FROM user_manager.users",(err,result)=>{
        if(err){
            res.status(500).json({ error: "Internal server error" });
        }
        else{
            res.status(200).json(result);
        }
    })
});


// user delete API 


router.delete("/deleteuser/:id",(req,res)=>{

    const {id}=req.params;

    conn.query("DELETE FROM user_manager.users WHERE id=?",id,(err,result)=>{
        if(err){
            res.status(500).json({ error: "Internal server error" });
        }
        else{
            res.status(200).json(result);
        }
    })
});



// user View API 


router.get("/induser/:id", (req, res) => {
    const { id } = req.params;

    conn.query("SELECT * FROM user_manager.users WHERE id=?", id, (err, result) => {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.status(200).json(result);
        }
    });
});



// limit API


router.get("/lmuser", (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    conn.query("SELECT * FROM user_manager.users LIMIT ? OFFSET ?", [parseInt(limit), offset], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.status(200).json(result);
        }
    });
});


// search api

router.get("/searchusers/:query", (req, res) => {
    const { query } = req.params;
    if (!query) {
        return res.status(400).json({ error: "Search query is required" });
    }

    const encodedQuery = encodeURIComponent(query);
    const searchQuery = `%${encodedQuery}%`; 

    // Use parameterized query to prevent SQL injection
    conn.query(
        "SELECT * FROM user_manager.users WHERE name LIKE ?",
        [searchQuery],
        (err, result) => {
            if (err) {
                console.error("Error searching users:", err);
                return res.status(500).json({ error: "Internal server error" });
            } else {
                return res.status(200).json({ results: result || [] });
            }
        }
    );
});


  



// Update user route
router.patch("/updateuser/:id",(req,res)=>{

    const {id} = req.params;

    const data = req.body;

    conn.query("UPDATE user_manager.users SET ? WHERE id = ? ",[data,id],(err,result)=>{
        if(err){
            res.status(422).json({message:"error"});
        }else{
            res.status(201).json(result);
        }
    })
});




// insert the data in loginsignup page



router.post("/signupadd", (req, res) => {
    const { name, email,mobile,password} = req.body;

    // console.log(req.body);

    if (!name || !email || !mobile || !password) {
        return res.status(422).json({ error: "Please fill all the data" });
    }

    conn.query("SELECT * FROM signup WHERE email = ?", email, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (result.length) {
            return res.status(422).json({ error: "User with this email already exists" });
        } else {
            const newUser = { name,email, mobile,password};
            conn.query("INSERT INTO signup SET ?", newUser, (err, result) => {
                if (err) {
                    console.error("Error executing query:", err);
                    return res.status(500).json({ error: "Internal server error" });
                }
                return res.status(201).json(req.body);
            });
        }
    });
});



// login page

router.post('/loginpg', (req, res) => {
    const sql = "SELECT * FROM crud_app.signup WHERE email = ? AND `password` = ?";
    
     console.log(req.body);
    conn.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if(data.length > 0){
            return res.json("Success");
        }
        else{
            return res.json("Failed");
        }
    });
});


// export to csv file 
//SELECT * FROM user_manager.users
router.get('/export-csv', (req, res) => {
    const query = 'SELECT id, name, `date`, email, age, gender, mobile, state, district, `add` FROM user_manager.users';
    conn.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching data from SQL: ', err);
        res.status(500).send('Error fetching data from SQL');
        return;
      }
      
      const csvData = results.map(row => Object.values(row).join(',')).join('\n');
     
      res.setHeader('Content-disposition', 'attachment; filename=data.csv');
      res.set('Content-Type', 'text/csv');
     
      res.status(200).send(csvData);
    });
  });
  


module.exports = router;
