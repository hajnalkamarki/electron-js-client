console.log('eventmng.js -- For managing events in the system');

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

async function createEvent () {
    event.preventDefault();

    public = 1;
    if (document.getElementById('publicity').checked != true)
    {
        public = 0;
    }
    console.log(document.getElementById('duedate').value)
    var object = {name: document.getElementById('name').value,
                  desc: document.getElementById('desc').value,
                  publicity: public,
                  state: 'INPROGRESS',
                  duedate: document.getElementById('duedate').value,
                  responsible_id: localStorage.getItem('username')};

    response = await callApi('http://localhost:5000//add_event', 'POST', object);

    const status = response.status;
    if (status == 200 || status == 201) {              
        console.log(status + ' Success.');
        alert('Event has been created.');
    } else {
          console.log( status + ' An error occured.');
          alert('An error occured');
    }
}

var createButton = document.getElementById('createbutton');
createButton.addEventListener('click', createEvent);

async function addRole () {
    event.preventDefault();

    var object = {username: document.getElementById('username').value,
                  event_id: document.getElementById('event_id').value,
                  perm_id: document.getElementById('permission').value};

    response = await callApi('http://localhost:5000//add_role', 'POST', object);

    const status = response.status;
    if (status == 200 || status == 201) {              
        console.log(status + ' Success.');
        alert('Role has been created.');
    } else {
          console.log( status + ' An error occured.');
          alert('An error occured');
    }
}

var addButton = document.getElementById('addbutton');
addButton.addEventListener('click', addRole);

function viewModEvent () {
    event.preventDefault();
    
    window.location.href = 'eventlist_page.html';
}

var viewModButton = document.getElementById('viewmodbutton');
viewModButton.addEventListener('click', viewModEvent);


function viewEmployees () {
    event.preventDefault();
    
    window.location.href = 'emplist_page.html';
}

var viewButton = document.getElementById('viewbutton');
viewButton.addEventListener('click', viewEmployees);

function logout () {    
    event.preventDefault();

    localStorage.clear();
    window.location.href = 'index.html';
}

var logoutButton = document.getElementById('logoutbutton');
logoutButton.addEventListener('click', logout);