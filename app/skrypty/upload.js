const remote = require('electron').remote;
let win = remote.getCurrentWindow();
let image_to_upload = document.getElementById("small_image");
let description_content = document.getElementById("small_description");
let upload_button = document.getElementById("small_upload_button");
const ipc = require('electron').ipcRenderer;


ipc.on('user_id', (event, user_id) => {
    console.log("W ipc" +user_id); // logs out "Hello second window!"
    sessionStorage.setItem("user_id",user_id);
    
})

let current_user = sessionStorage.getItem("user_id");
console.log("Poza ipc: " +current_user);


function imageSelected(){ //Wyłącz przycisk jeśli zdjęcie nie jest wybrane

    //console.log("W funkcji "+ current_user)
    if (image_to_upload.dataset.status === "waiting"){
        upload_button.disabled = true
        upload_button.classList.add("small_upload_button_disabled")
       // console.log("off przycisk")
    }else{
        upload_button.disabled = false
        upload_button.classList.remove("small_upload_button_disabled");
        upload_button.classList.add("small_upload_button");
      //  console.log("on przycisk")
    }
}

function selectImage(){
    
    const file_path = dialog.showOpenDialog();
    const data = jetpack.read(file_path[0],"buffer");
    sessionStorage.setItem("fp", file_path[0]);
    let blob = new Blob([data], { type: "image/png" });
    let url = URL.createObjectURL(blob)
    image_to_upload.src = url;
    image_to_upload.dataset.status = "selected"
    imageSelected();
}


function uploadImage(){
    console.log("upload image")
   let description = description_content.value;
   const data = jetpack.read(sessionStorage.getItem("fp"),"buffer");

   

        db.serialize(function(){
            console.log("databased")
            let statement = db.prepare("INSERT INTO photos VALUES (?,?,?,?,?)");
            statement.run(null,data,description,time,user_id);
        
            statement.finalize();
             });
    
  // win.close();
}



// function uploadPhoto(){
//     let user_id = sessionStorage.getItem("user_id");
//     const file_path = dialog.showOpenDialog();
//     const data_new = jetpack.read(file_path[0],"buffer");
    
    

//         db.serialize(function(){
//             let statement = db.prepare("INSERT INTO photos VALUES (?,?,?,?,?)");
//             statement.run(null,data,description,time,user_id);
      
//             statement.finalize();
//           });
  
      
//   }