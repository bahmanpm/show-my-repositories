// jshint strict: true
// jshint unused: true
// jshint curly: true
// jshint eqeqeq: true
// jshint globals: true
// jshint maxcomplexity: 2
// jshint maxdepth: 2
// jshint nonbsp: true
// jshint browser: true
// jshint devel: true
// global console: true

function publicOrPrivate(prop) {
    if(prop === "public") {
        document.getElementById("basic").setAttribute("disabled", true);
        document.getElementById("token").setAttribute("disabled", true);
        document.getElementById("password").setAttribute("disabled", true);
        document.getElementById("accessToken").setAttribute("disabled", true);
        document.getElementById("username").removeAttribute("disabled");
    } else {
            document.getElementById("basic").removeAttribute("disabled");
            document.getElementById("token").removeAttribute("disabled");
        if (document.getElementById("basic").hasAttribute("checked")) {
            document.getElementById("accessToken").setAttribute("disabled", true);
            document.getElementById("username").removeAttribute("disabled");
            document.getElementById("password").removeAttribute("disabled");
        }
        else if (document.getElementById("token").hasAttribute("checked")) {
            document.getElementById("accessToken").removeAttribute("disabled");
            document.getElementById("username").setAttribute("disabled", true);
            document.getElementById("password").setAttribute("disabled", true);
        }
    }
}

function basicOrToken(prop) {
    if(prop === "basic") {
        document.getElementById("accessToken").setAttribute("disabled", true);
        document.getElementById("username").removeAttribute("disabled");
        document.getElementById("password").removeAttribute("disabled");
    } else {
        document.getElementById("accessToken").removeAttribute("disabled");
        document.getElementById("username").setAttribute("disabled", true);
        document.getElementById("password").setAttribute("disabled", true);
    }
}

function login5() {
    document.getElementById("message").innerHTML = "Waiting For Repos Info ...";
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var accessToken = document.getElementById("accessToken").value

    var requestStatus = true;

    var url = "";
    var header = {}
    var requestedRepos = "public"
    var auth = btoa(username + ":" + password);

    var radios = document.getElementsByName('public-or-private');
    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            if (radios[i].id == "public") {
                url = "https://api.github.com/users/"+username+"/repos";
            }
            else {
                url = "https://api.github.com/user/repos";
                requestedRepos = "private"
            }
    
            break;
        }
    }

    if (requestedRepos === "private") {
        var radios2 = document.getElementsByName('basic-or-token');
        for (var i = 0, length = radios2.length; i < length; i++) {
            if (radios2[i].checked) {
                if (radios2[i].id == "basic") {
                    header = {'Authorization': "Basic " + auth}
                }
                else {
                    header = {'Authorization': "token " + accessToken}
                }
        
                break;
            }
        }
    }

    fetch(url, {
        method: 'GET',
        headers: header
    })
    .then(function(data){
        if (data.status === 200) {
            document.getElementById("message").innerHTML = "Success";
        }
        if (data.status === 404) {
            document.getElementById("message").innerHTML = "User Not Found!";
            document.getElementById("userInfo").innerHTML = "<img src='assets/images/default-avatar.jpg' alt='' class='circle responsive-img'><p>...</p>";
            document.getElementById("publicReposNumber").innerHTML = "Not Available";
            document.getElementById("privateReposNumber").innerHTML = "Not Available";
            document.getElementById("reposInfo").innerHTML = "";
            requestStatus = false;
        }
        if (data.status === 401) {
            document.getElementById("message").innerHTML = "Unauthorized!";
            document.getElementById("userInfo").innerHTML = "<img src='assets/images/default-avatar.jpg' alt='' class='circle responsive-img'><p>...</p>";
            document.getElementById("publicReposNumber").innerHTML = "Not Available";
            document.getElementById("privateReposNumber").innerHTML = "Not Available";
            document.getElementById("reposInfo").innerHTML = "";
            requestStatus = false;
        }
        return data.json()
    })
    .then(function(res){
        if (requestStatus) {
            myObj = res;
            var txt = "";
            var publicReposCount = 0;
            var privateReposCount = 0;
            for (x in myObj) {
                txt += "<tr>"+
                    "<td>" + myObj[x].id + "</td>"+
                    "<td><a href="+ myObj[x].html_url +">" + myObj[x].name + "</a></td>"+
                    "<td>" + myObj[x].stargazers_count + "</td>"+
                    "<td>" + myObj[x].open_issues_count + "</td>"+
                    "<td>" + myObj[x].created_at + "</td>"+
                    "<td>" + myObj[x].private + "</td>"+
                "</tr>";
                if (myObj[x].private == false) {
                    publicReposCount++
                }
                else {
                    privateReposCount++ 
                }
            }
            document.getElementById("reposInfo").innerHTML = txt;
            document.getElementById("userInfo").innerHTML = "<img src="+myObj[0].owner.avatar_url+" alt='' class='circle responsive-img'><p>"+myObj[0].owner.login+"</p>";
            document.getElementById("publicReposNumber").innerHTML = publicReposCount;
            if (requestedRepos === "private") {
                document.getElementById("privateReposNumber").innerHTML = privateReposCount;
            }
            else {
                document.getElementById("privateReposNumber").innerHTML = "Not Available";
            }
        }
    })
}