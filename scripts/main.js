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

/* exported publicOrPrivate */
/* exported basicOrToken */
/* exported getRepos */

// control public and private radio buttons
function publicOrPrivate(prop) {
    "use strict";
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

// control basic and token radio buttons
function basicOrToken(prop) {
    "use strict";
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

// handle req & res
function getRepos() {
    "use strict";
    // set message
    document.getElementById("message").innerHTML = "Waiting For Repos Info ...";

    // set input values
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var accessToken = document.getElementById("accessToken").value;

    // set radio values
    var ppRadios = document.getElementsByName('public-or-private');
    var btRadios = document.getElementsByName('basic-or-token');
    
    // user & pass 2 base64
    var auth = btoa(username + ":" + password);
    
    // default values
    var requestStatus = true;
    var url = "";
    var header = {};
    var requestedRepos = "public";
    var i, j;

    for (i = 0; i < ppRadios.length; i++) {
        if (ppRadios[i].checked) {
            if (ppRadios[i].id === "public") {
                url = "https://api.github.com/users/"+username+"/repos";
            }
            else {
                url = "https://api.github.com/user/repos";
                requestedRepos = "private";
            }
    
            break;
        }
    }

    if (requestedRepos === "private") {
        for (j = 0; j < btRadios.length; j++) {
            if (btRadios[j].checked) {
                if (btRadios[j].id === "basic") {
                    header = {'Authorization': "Basic " + auth};
                }
                else {
                    header = {'Authorization': "token " + accessToken};
                }
        
                break;
            }
        }
    }

    // send request
    fetch(url, {
        method: 'GET',
        headers: header
    })
    .then(function(data){
        if (data.status === 200) {
            // set message
            document.getElementById("message").innerHTML = "Success";
        }
        if (data.status === 404) {
            // set message
            document.getElementById("message").innerHTML = "User Not Found!";
        }
        if (data.status === 401) {
            // set message
            document.getElementById("message").innerHTML = "Unauthorized!";
        }
        if (data.status === 404 || data.status === 401) {
            // set some parameters in page if status code is 404 or 401
            document.getElementById("userInfo").innerHTML = "<img src='assets/images/default-avatar.jpg' alt='' class='circle responsive-img'><p>...</p>";
            document.getElementById("publicReposNumber").innerHTML = "Not Available";
            document.getElementById("privateReposNumber").innerHTML = "Not Available";
            document.getElementById("reposInfo").innerHTML = "";
            requestStatus = false;
        }
        return data.json();
    })
    .then(function(res){
        if (requestStatus) {
            var myObj = res;
            var txt = "";
            var publicReposCount = 0;
            var privateReposCount = 0;
            var repoType = "";
            var x;
            for (x in myObj) {
                // count public & private repos
                if (myObj[x].private === false) {
                    publicReposCount++; 
                    repoType = "Public";
                }
                else {
                    privateReposCount++;
                    repoType = "Private";
                }

                // add data to table
                txt += "<tr>"+
                    "<td>" + myObj[x].id + "</td>"+
                    "<td><a href="+ myObj[x].html_url +">" + myObj[x].name + "</a></td>"+
                    "<td>" + myObj[x].stargazers_count + "</td>"+
                    "<td>" + myObj[x].open_issues_count + "</td>"+
                    "<td>" + myObj[x].created_at + "</td>"+
                    "<td>" + repoType + "</td>"+
                "</tr>";

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
    });
}