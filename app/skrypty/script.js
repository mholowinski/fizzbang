let sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('database.db');

/*
db.serialize(function() {
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
    stmt.run("Ipsum " + i);
  }

  stmt.finalize();

  var rows = document.getElementById("database");
  db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
    var item = document.createElement("li");
    item.textContent = "" + row.id + ": " + row.info;
    rows.appendChild(item);
  });
});

db.close();*/


function createUser(){

    if (validateRegister() === true){
      console.log("Wszystko git")

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    console.log("Username: "+username+"Password: "+password)

    db.serialize(function(){
      let statement = db.prepare("INSERT INTO user VALUES (?,?,?,?,?,?,?,?)");
      statement.run(username,password,0,0,0,"Opis",null,null)

      statement.finalize();
    })
   // db.close();
   window.location.href = "index.html";
  }else{
    console.log("Registration error")
  }
}

function auth(){
  if (validateLogin() === true){
    let username = document.getElementById("login_username").value;
    let password = document.getElementById("login_password").value;
    let error_msg = document.getElementById("error_msg");

      db.get("SELECT * FROM user WHERE login = ? AND password = ?",username, password,  function (err, row) {
        if (err) {
          return console.error(err.message);
        }
     
          if (row){
            console.log("user exists")
            console.log(row)
            sessionStorage.setItem("user_id",row.id_user);
            sessionStorage.setItem("user_login",row.login);
            window.location.href = "profile.html";
            
          }else{
            console.log("user dozynt eksizst")
            error_msg.innerText = "Invalid username/password"
          }
    });

  }else{
    console.log("Login error")
  }
   

   // db.close();

  }


