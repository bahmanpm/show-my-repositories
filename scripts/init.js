function initializeApp() {
    var radios = document.getElementsByName('public-or-private');
    document.getElementById("userInfo").innerHTML = "<img src='assets/images/default-avatar.jpg' alt='' class='circle responsive-img'><p>...</p>";
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            if (radios[i].id == "public") {
                document.getElementById("password").setAttribute("disabled", true);
                document.getElementById("accessToken").setAttribute("disabled", true);
                document.getElementById("basic").setAttribute("disabled", true);
                document.getElementById("token").setAttribute("disabled", true);
            }
            else {
                if (document.getElementById("basic").hasAttribute("checked")) {
                    document.getElementById("accessToken").setAttribute("disabled", true);
                }
                else if (document.getElementById("token").hasAttribute("checked")) {
                    document.getElementById("username").setAttribute("disabled", true);
                    document.getElementById("password").setAttribute("disabled", true);
                }
            }
    
            break;
        }
    }
}

window.onload = initializeApp;