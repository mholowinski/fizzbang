function print(row){
  console.log(row)
  let search_single = document.createElement("div")
      let search_avatar = document.createElement("img")
      let search_username = document.createElement("span")

  search_single.classList.add("search_single");
  search_avatar.classList.add("search_avatar");
  search_username.classList.add("search_username");
  
  
  search_username.innerText = row.login;

  search_username.setAttribute("data-userid",row.id_user);
  search_username.setAttribute("onclick","selectTarget(this)")

  let blob = new Blob([row.profile_pic], { type: "image/png" });
  let url = URL.createObjectURL(blob)

  search_avatar.src = url;
  search_single.appendChild(search_avatar);
  search_single.appendChild(search_username);
  search_results.appendChild(search_single);
}

function goProfile(){
    window.location.href="profile.html"
  }


function loadSearch(){

    let desired_user = sessionStorage.getItem("search_querry");
    let search_target = document.getElementById("search_target");
    let search_results = document.getElementById("search_results");
    console.log(desired_user)
    desired_user = desired_user + '%';

    search_target.innerText = desired_user.substring(0,desired_user.length -1);
    search_target.innerText = desired_user.substring(0,desired_user.length -1);

    db.each("SELECT * FROM user WHERE login LIKE ? ",desired_user, function(err, row) {
        if (err) {
          return console.error(err.message);
        }
        if(row){
            print(row); //Utwórz elementy
        }else{
            
            console.log("Użytkownik nie istnieje!")
        }
      });
}

function searchUser(){
    let desired_user = document.getElementById("desired_user").value;
  
    sessionStorage.setItem("search_querry",desired_user);
    window.location.reload();
  
  }


  function showFollowers(){
    let user_id = sessionStorage.getItem("user_id")
    db.each("SELECT * FROM user as u join following as f on f.id_follower = u.id_user where f.id_user = ? ",user_id, function(err, row) {
      if (err) {
        return console.error(err.message);
      }
      if(row){
        console.log(row)
        console.log(row)
        let search_single = document.createElement("div")
            let search_avatar = document.createElement("img")
            let search_username = document.createElement("span")
      
        search_single.classList.add("search_single");
        search_avatar.classList.add("search_avatar");
        search_username.classList.add("search_username");
        
        
        search_username.innerText = row.login;
      
        search_username.setAttribute("data-userid",row.id_follower);
        search_username.setAttribute("onclick","selectTarget(this)")
      
        let blob = new Blob([row.profile_pic], { type: "image/png" });
        let url = URL.createObjectURL(blob)
      
        search_avatar.src = url;
        search_single.appendChild(search_avatar);
        search_single.appendChild(search_username);
        search_results.appendChild(search_single);
        let query_type = document.getElementById("query_type")
        let login = sessionStorage.getItem("user_login")
        query_type.innerText = login + "'s followers:"
         
      }else{
          
          console.log("Użytkownik nie istnieje!")
      }
    });
  }
  
  
  function showFollowing(){
    let user_id = sessionStorage.getItem("user_id")
    db.each("SELECT * FROM user as u join following as f on f.id_user = u.id_user where f.id_follower = ? ",user_id, function(err, row) {
      if (err) {
        return console.error(err.message);
      }
      if(row){
        console.log(row)
        print(row);
        let query_type = document.getElementById("query_type")
        let login = sessionStorage.getItem("user_login")
        query_type.innerText = login + " is following:"
      }else{
          
          console.log("Użytkownik nie istnieje!")
      }
    });
  }






