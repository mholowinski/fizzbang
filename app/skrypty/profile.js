let sqlite3 = require('sqlite3').verbose();
const { dialog } = require('electron').remote
const jetpack = require('fs-jetpack');
let db = new sqlite3.Database('database.db');

//ODCZYTAJ DZISIEJSZĄ DATĘ
let today = new Date();
let time = today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear()

//Pobieranie ID zalogowanego użytkownika z session storage
let user_id = sessionStorage.getItem("user_id");

//Wczytywanie profilu zalogowanego użytkownika
function loadProfile(){
    console.log(time)
    console.log(sessionStorage.getItem("current_user"));
    let user_id = sessionStorage.getItem("user_id");

 db.get("SELECT * FROM user WHERE id_user = ?",user_id,  function (err, row) {
    if (err) {
      return console.error(err.message);
    }
      if (row){
        console.log(row)
        //Informacje o użytkowniku
        document.getElementById("username").innerHTML = row.login;
        document.getElementById("following").innerHTML = "Following: " + row.following;
        document.getElementById("followers").innerHTML = "Followers: " + row.followers;
        document.getElementById("posts").innerHTML = "Posts: " + row.posts;
        document.getElementById("description").innerHTML = row.opis;
        document.getElementById("enhanced_username").innerHTML = row.login;

        //Zdjęcie profilowe
        let avatar = document.getElementById("avatar")
        let blob = new Blob([row.profile_pic], { type: "image/png" });
        let url = URL.createObjectURL(blob)
        avatar.src = url;
        document.getElementById("enhanced_avatar").src = url;
       
        //Pobieranie zdjęć użytkownika
    (function () {

      db.each("SELECT * FROM photos WHERE id_user = ?",user_id,  function (err, row) {
        if (err) {
          return console.error(err.message);
        }
     
          if (row){
            let blob = new Blob([row.photo], { type: "image/png" });
            let url = URL.createObjectURL(blob)
            let img = document.createElement('img'); 
            //Tworzenie elementów zawierajcych zdjęcie
            img.src = url
            img.width = 330
            img.height = 200
            img.classList.add("ph_profile")
            img.setAttribute("onclick","enhance(this)")
            img.setAttribute("id","photo_id:"+row.id_photo)
            document.getElementById('photos').appendChild(img);            
          }else{
            console.log("Pobieranie zdjęć nie powiodło się")
          }
        })
    //   db.close();
      })();

    }else{
      console.log("Ładowanie użytkownika nie powiodło się")
    }
    });
}

//Wylogowywanie użytkownika
function logout(){
    sessionStorage.clear();
    window.location.href = "index.html";
}

//Przejdź do swojego profilu
function goProfile(){
  window.location.href="profile.html"
}

function goHome(){
  window.location.href="dashboard.html"
}

//Udostępnianie zdjęć
function uploadPhoto(){
  let user_id = sessionStorage.getItem("user_id");
  const file_path = dialog.showOpenDialog();
  const data = jetpack.read(file_path[0],"buffer");
  
    db.serialize(function(){
      let statement = db.prepare("INSERT INTO photos VALUES (?,?,?,?,?)");
      statement.run(null,data,"opis",null,user_id);

      statement.finalize();
    })
}

//Kliknij i powiększ zdjęcie
function enhance(object){
    let enhanced = document.getElementById("enhance")
    let enhanced_photo = document.getElementById("enhanced_photo")
    let ph_profile = document.getElementById("ph_profile")
    let enhanced_description = document.getElementById("enhanced_description")
    let comment_section = document.getElementById("comment_section")

    if (enhanced.style.display === "none") {
      enhanced.style.display = "grid";
    } else {
      enhanced.style.display = "none";
    }

    enhanced_photo.src = object.src // Powiększone zdjęcie src  = kliknięte zdjęcie src
    let photo_id = object.id.split(":").pop();
    enhanced_photo.setAttribute("data-id",photo_id)

    db.get("SELECT * FROM photos WHERE id_photo = ?",photo_id,  function (err, row) {
      if (err) {
        return console.error(err.message);
      }
        if (row){
          enhanced_description.innerText = row.description

            //KOMENTARZE
            db.each("SELECT * FROM comment JOIN user ON comment.id_user = user.id_user WHERE comment.id_photo = ?",photo_id,  function (err, row) {
                  if (err) {
                    return console.error(err.message);
                  }
                    if (row){
                      
                      console.log(row)
                      let comment_section = document.getElementById("comment_section")
                          
                      let comment = document.createElement('div')
                        let profile_picture = document.createElement('img')
                        let content = document.createElement('span')
                        let username = document.createElement('span')
                      
                      let blob = new Blob([row.profile_pic], { type: "image/png" });
                      let url = URL.createObjectURL(blob)

                      profile_picture.src = url
                      profile_picture.width = 65
                      profile_picture.height = 65

                      content.innerText = row.content;
                      username.innerText = row.login;
                      username.setAttribute("onclick","selectTarget(this)")
                      username.setAttribute("data-userid",row.id_user)

                      comment.classList.add("comment")
                      content.classList.add("content")
                      username.classList.add("comment_username")
                      profile_picture.classList.add("comment_avatar")

                      comment.appendChild(profile_picture)
                      comment.appendChild(username)
                      comment.appendChild(content) 
                      comment_section.appendChild(comment) // Przypmnij wszystko

                    }else{
                      console.log("Komentarz nie isnieje")
                    }
              })
        }else{
          console.log("Photo doesn't exist")     
        }
  })
  comment_section.innerHTML = ""
}
//Kliknięcie w zdjęcia minimalizuje je 
function notEnhance(){
  let enhanced = document.getElementById("enhance")

  if (enhanced.style.display === "none") {
    enhanced.style.display = "grid";
  } else {
    enhanced.style.display = "none";
  }

  let comment_section = document.getElementById("comment_section")
  comment_section.innerHTML = ""
}

// Dodawanie komentarza do zdjęcia podczas przybliżania 
function addComment(){
  let comment_content = document.getElementById("add_comment_form").value
  let enhanced_photo = document.getElementById("enhanced_photo")
  let photo_id = enhanced_photo.dataset.id
  
  db.serialize(function(){
      let statement = db.prepare("INSERT INTO comment VALUES (?,?,?,?,?)");
      statement.run(null,comment_content,time,photo_id,user_id)
      statement.finalize();
     })
  comment_content.value = ""
}

//Wybierz użytkownika i załaduj template strony innego użytkownika niż ten co jest zalogowany
function selectTarget(object){
  console.log(object.dataset.userid)
  sessionStorage.setItem("target_id",object.dataset.userid)
  window.location.href = "target.html";
}

//SPRAWDZ CZY MNIE FOLLLOWUJE
function checkFollowing(){ // onLoad
  let target_id = sessionStorage.getItem("target_id");
  let follow_button = document.getElementById("follow_button");
  
  db.get("SELECT * FROM following WHERE id_user = ? AND id_follower = ? ",target_id,user_id, function(err, row) {
    if (err) {
      return console.error(err.message);
    }

    if (row){
      follow_button.disabled = true;
      follow_button.innerText = "Following"
      follow_button.classList.remove("profile_button")
      follow_button.classList.add("profile_button_inverse")
    }else{
      //nie rób nic
    }

  });
}

//Załaduj klikniętego użytkownika
function loadTarget(){
  checkFollowing();
  let target_id = sessionStorage.getItem("target_id");

  if (target_id === user_id) window.location.href = "profile.html";
 
  db.each("SELECT * FROM user WHERE id_user = ?",target_id,  function (err, row) {
    if (err) {
      return console.error(err.message);
    }
      if (row){
        console.log(row)
        document.getElementById("username").innerHTML = row.login;
        document.getElementById("following").innerHTML = "Following: " + row.following;
        document.getElementById("followers").innerHTML = "Followers: " + row.followers;
        document.getElementById("posts").innerHTML = "Posts: " + row.posts;
        document.getElementById("description").innerHTML = row.opis;
        document.getElementById("enhanced_username").innerHTML = row.login;
        
        let avatar = document.getElementById("avatar")
        let blob = new Blob([row.profile_pic], { type: "image/png" });
        let url = URL.createObjectURL(blob)
        avatar.src = url;

        document.getElementById("enhanced_avatar").src = url;
        
       (function () {

        db.each("SELECT * FROM photos WHERE id_user = ?",target_id,  function (err, row) {
          if (err) {
            return console.error(err.message);
          }  
            if (row){
              let blob = new Blob([row.photo], { type: "image/png" });
              let url = URL.createObjectURL(blob)
              let img = document.createElement('img'); 
              img.src = url
              img.width = 330
              img.height = 200
              img.classList.add("ph_profile")
              img.setAttribute("onclick","enhance(this)")
              img.setAttribute("id","photo_id:"+row.id_photo)
              document.getElementById('photos').appendChild(img); 
            }else{
              console.log("user dozynt eksizst")    
            }
      })
   //   db.close();
    })();
      }else{
        console.log("Coś poszło nie tak byku")       
      }
    });
}
//Wyszukiwanie użytkownika
function searchUser(){
  let desired_user = document.getElementById("desired_user").value; //Odczytaj pole 
  sessionStorage.setItem("search_querry",desired_user); //Zapisz wartość pola do session storage
  window.location.href = "search.html" //Załaduj wyniki wyszukiwania
}

//WŁĄCZ EDYTOWANIE PROFILU
function editProfile(){
  console.log("xd")

  let icon_edit = document.getElementById("icon_edit")
  let icon_edit_description = document.getElementById("icon_edit_description")
  
  if (icon_edit.style.display === "none") {
    icon_edit.style.display = "block";
  } else {
    icon_edit.style.display = "none";
  }



}
//ZMIEŃ ZDJĘCIE PROFILOWE
function uploadProfilePicture(){
  
    let user_id = sessionStorage.getItem("user_id");
    const file_path = dialog.showOpenDialog();
    const data = jetpack.read(file_path[0],"buffer");
    
      db.serialize(function(){
        let statement = db.prepare("UPDATE user SET profile_pic = ? WHERE id_user = ?");
        statement.run(data,user_id);
  
        statement.finalize();
      })

  window.location.href = "profile.html"
}


//ZMIEŃ OPIS PROFILU
function editProfileDescription(){

}

function followUser(){
  console.log(sessionStorage.getItem("target_id"));
  
  let target_id = sessionStorage.getItem("target_id");
  

  db.serialize(function(){
    console.log("finna prepare statement")
    let statement = db.prepare("INSERT INTO following VALUES (?,?,?)");
    statement.run(null,target_id,user_id);

    statement.finalize();
  });
  
  window.location.href = "target.html"

}

