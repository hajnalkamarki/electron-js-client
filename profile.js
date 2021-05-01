console.log('profile.js -- Logged in as a validator');

console.log(localStorage.getItem('username'));
console.log(localStorage.getItem('access_token'));

// function for API call, also handles authorization
async function callApi(url, method, object) {
    var request = new XMLHttpRequest();
    
    request.responseType = 'json';
    request.open(method, url, true);
    request.setRequestHeader('Content-type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    
    if (object) {
    request.send(JSON.stringify(object));
    }
    else {
    request.send();
    }
    
    if (request.readyState === XMLHttpRequest.DONE) {
    return request;
    }
    
    let res;
    const p = new Promise((r) => res = r);
    request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
        res(request);
    }
    }
    
    return p;
}

async function processData () {      
    response = await callApi('http://localhost:5000/get_profile/' + localStorage.getItem('username'), 'GET', null);

    var profileData = `
                    <li">An error occured</li>
                    `;

    const status = response.status;
    if (status == 200 || status == 201) {              
        console.log(status + ' Profile found.');
        profileData = `
                    <li id="username">Username: ${localStorage.getItem('username')}&nbsp;</li>
                    <li id="firstname">First name: ${response.response.firstname}</li>
                    <li id="lastname">Last name: ${response.response.lastname}</li>
                    <li id="email">E-mail: ${response.response.email}</li>
                    <li id="phone">Phone: ${response.response.phone}</li>
                    <li id="fax">Fax: ${response.response.fax}</li>
                    <li id="address">Address: ${response.response.address}</li>
                    `;
    } else {
          console.log( status + ' Server Error');
          alert('An error occured.');
    }
    
    const ulClass = document.querySelector(".fa-ul");
    
    ulClass.innerHTML = profileData;
}


window.addEventListener('DOMContentLoaded', processData);

function view () {
    event.preventDefault();
    
    window.location.href = 'emplist_page.html';
}

var viewButton = document.getElementById('viewbutton');
viewButton.addEventListener('click', view);


function logout () {    
    event.preventDefault();

    localStorage.clear();
    window.location.href = 'index.html';
}

var logoutButton = document.getElementById('logoutbutton');
logoutButton.addEventListener('click', logout);