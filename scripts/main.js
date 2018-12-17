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
/* exported currentStatus */
/* exported checkRequestedReposType */
/* exported checkRequestedAuthType */
/* exported handleResponseStatus */
/* exported publishFetchedData */

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

let requestStatus = true;
let requestedRepos = "public";
let url = "";
let header = {};

// handle req & res
let getRepos = (username, password, accessToken, ppRadios, btRadios) => {
    "use strict";
    // set message
    currentStatus("message", "Waiting For Repos Info ...");
    
    // user & pass 2 base64
    const auth = btoa(username + ":" + password);

    checkRequestedReposType(ppRadios, username);
    checkRequestedAuthType(btRadios, auth, accessToken);

    // send request
    fetch(url, {
        method: 'GET',
        headers: header
    })
    .then(function(data){
        handleResponseStatus(data);
        return data.json();
    })
    .then(function(res){
        publishFetchedData(res);
    });
};

let currentStatus = (id, status) => {
    "use strict";

    document.getElementById(id).innerHTML = status;
    return true;
}

let checkRequestedReposType = (ppRadios, username) => {
    "use strict"; 

    let i;
    for (i in ppRadios) {
        if (ppRadios[i].checked) {
            if (ppRadios[i].id === "public") {
                url = `https://api.github.com/users/${username}/repos`;
                return true;
            }
            else if (ppRadios[i].id === "private") {
                url = "https://api.github.com/user/repos";
                requestedRepos = "private";
                return true;
            }
            else {
                return false;
            }
        }
    }
}

let checkRequestedAuthType = (btRadios, auth, accessToken) => {
    "use strict";

    if (requestedRepos === "private") {
        let i;
        for (i in btRadios) {
            if (btRadios[i].checked) {
                if (btRadios[i].id === "basic") {
                    header = {'Authorization': "Basic " + auth};
                }
                else if (btRadios[i].id === "token") {
                    header = {'Authorization': "token " + accessToken};
                }
                else {
                    return false;
                }
            }
        }
    }
}

let handleResponseStatus = (data) => {
    "use strict";

    if (data.status === 200) {
        // set message
        currentStatus("message", "Success");
        requestStatus = true;
    }
    if (data.status === 404) {
        // set message
        currentStatus("message", "User Not Found!");
    }
    if (data.status === 401) {
        // set message
        currentStatus("message", "Unauthorized!");
    }
    if (data.status === 404 || data.status === 401) {
        // set some parameters in page if status code is 404 or 401
        currentStatus("userInfo", "<img src='assets/images/default-avatar.jpg' alt='' class='circle responsive-img'><p>...</p>");
        currentStatus("publicReposNumber", "Not Available");
        currentStatus("privateReposNumber", "Not Available");
        currentStatus("reposInfo", "");
        requestStatus = false;
        // return false;
    }
    return true;
}

function publishFetchedData(myObj) {
    "use strict";

    if (requestStatus) {
        let txt = "";
        let publicReposCount = 0;
        let privateReposCount = 0;
        let repoType = "";
        let x;
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
            txt += `<tr>
                <td>${myObj[x].id}</td>+
                <td><a href=${myObj[x].html_url}>${myObj[x].name}</a></td>
                <td>${myObj[x].stargazers_count}</td>
                <td>${myObj[x].open_issues_count}</td>
                <td>${myObj[x].created_at}</td>
                <td>${repoType}</td>
            </tr>`;
        }
        
        currentStatus("reposInfo", txt);
        currentStatus("userInfo", `<img src=${myObj[0].owner.avatar_url} alt='' class='circle responsive-img'><p>${myObj[0].owner.login}</p>`);
        currentStatus("publicReposNumber", publicReposCount);
        (requestedRepos === "private") ? currentStatus("privateReposNumber", privateReposCount) : currentStatus("privateReposNumber", "Not Available");
        return true;
    }
}