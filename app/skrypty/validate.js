function validateRegister(){
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let email = document.getElementById("email");
    let error = document.getElementById("error");
    console.log("!")

    if (username.value ==""){
        error_msg.innerText = "Name must be filled out!"
        return false;
    }

    if (password.value ==""){
        error_msg.innerText = "Password must be filled out!"
        return false;
    }

    if (email.value ==""){
        error_msg.innerText = "Email must be filled out!"
        return false;
    }

    if (username.value.length < 5 ){
        error_msg.innerText = "Name must be longer than 5 characters"
        return false;
    }

    if (password.value.length < 8 ){
        error_msg.innerText = "Password must be longer than 8 characters"
        return false;
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)){
        console.log("emaeil git")
    }else{
        error_msg.innerText = "Invalid email"
        return false;
    }
  
    // wszystko git ?
    return true;
}


function validateLogin(){
    let username = document.getElementById("login_username");
    let password = document.getElementById("login_password");
    let error_msg = document.getElementById("error_msg");

    if (username.value ==""){
        error_msg.innerText = "Name must be filled out!"
        return false;
    }

    if (password.value ==""){
        error_msg.innerText = "Password must be filled out!"
        return false;
    }
    
return true;
}