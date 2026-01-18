const mysql=require("mysql2");


const conn=mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"Sarika@123",
    database:"user_manager"
});


conn.connect((err)=>{
    if(err) throw err;
    console.log("DB connected succesfully")
});


module.exports=conn;