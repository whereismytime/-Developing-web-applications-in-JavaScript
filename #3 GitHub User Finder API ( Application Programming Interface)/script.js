document.addEventListener('DOMContentLoaded', function() {
    let userLoginInput = document.getElementById("user-login");
    let searchButton = document.getElementById("search-button");
    let userInfo = document.getElementById("user-info");
    let userPhoto = document.getElementById("user-photo");
    let userName = document.getElementById("user-name");
    let userLoginDisplay = document.getElementById("user-login-display");
    let userUrl = document.getElementById("user-url");
    let userLocation = document.getElementById("user-location");
    let userEmail = document.getElementById("user-email");
    let userFollowers = document.getElementById("user-followers");
    let userFollowing = document.getElementById("user-following");
    let loader = document.getElementById("loader");

    searchButton.addEventListener("click", function(){
        let userLoginValue = userLoginInput.value;
        if(userLoginValue === "") {
            alert("Enter GitHub username");
            return;
        }

        loader.style.display = "block";  
        userInfo.style.display = "none"; 

        setTimeout(function() {
            let request = new XMLHttpRequest();
            request.open("GET", "https://api.github.com/users/" + userLoginValue);
            request.onload = function() {
                loader.style.display = "none"; 

                if(request.status === 200){
                    let response = JSON.parse(request.responseText);
                    
                    userPhoto.src = response.avatar_url;
                    userName.textContent = response.name ? "Name: " + response.name : "No name available";
                    userLoginDisplay.textContent = "Login: " + response.login;
                    userUrl.innerHTML = `URL: <a href="${response.html_url}" target="_blank">${response.html_url}</a>`;
                    userLocation.textContent = response.location ? "Location: " + response.location : "No location";
                    userEmail.textContent = response.email ? "Email: " + response.email : "No email";
                    userFollowers.textContent = response.followers ? response.followers : "0";
                    userFollowing.textContent = response.following ? response.following : "0";
                    userInfo.style.display = "flex"; 
                }
                else {
                    alert("User not found");
                    userInfo.style.display = "none";
                }
            };
            request.send();
        }, 3000); // Задержка
    });
});
