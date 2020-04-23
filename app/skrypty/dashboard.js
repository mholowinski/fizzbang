function loadPosts(){

    let posts = document.getElementById("posts")

db.each("select * from photos as p join following as f on f.id_follower = p.id_user join user as u on u.id_user = p.id_user where f.id_user = ? order by p.date_added desc", user_id,  function (err, row) {
    if (err) {
      return console.error(err.message);
    }
 
      if (row){
        console.log(row)
        let dash_post = document.createElement("div");
        let dash_banner = document.createElement("div");
        let dash_avatar = document.createElement("img");
        let dash_username = document.createElement("span");
        let dash_image = document.createElement("img");

        dash_post.classList.add("dash_post");
        dash_banner.classList.add("dash_banner");
        dash_avatar.classList.add("dash_avatar");
        dash_username.classList.add("dash_username");
        dash_post.classList.add("dash_post");

        dash_image.width = 960;
        dash_image.height = 650;

        dash_avatar.width = 65;
        dash_avatar.height = 65;

        (function () {
            let blob = new Blob([row.profile_pic], { type: "image/png" });
            let url = URL.createObjectURL(blob)
            dash_avatar.src = url;
        })();

        let blob = new Blob([row.photo], { type: "image/png" });
        let url = URL.createObjectURL(blob);
        dash_image.src = url;
        dash_username.innerText = row.login;

        dash_banner.appendChild(dash_avatar);
        dash_banner.appendChild(dash_username);
        
        dash_post.appendChild(dash_banner);
        dash_post.appendChild(dash_image);

        posts.appendChild(dash_post)


        
      }else{
        console.log("user dozynt eksizst")
      }
})

}