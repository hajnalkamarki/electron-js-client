console.log('validate.js -- For validating items in the system');

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

async function process (decision) {
    event.preventDefault();
    
    var object = {itemname: document.getElementById('itemname').value,
                  username: localStorage.getItem('username')};

    switch(decision) {
        case 'validate':                    
            response = await callApi('http://localhost:5000/validate', 'PUT', object);
            break;
        case 'reject':
            response = await callApi('http://localhost:5000/reject', 'PUT', object);
            break;
        default:
            alert('Invalid parameter.');
            return;
    }
        
    const status = response.status;
    if (status == 200 || status == 201) {              
        console.log(status + ' Success.');
        alert('Success');
    } else {
          console.log( status + ' An error occured.');
          alert('An error occured');
    }
}

async function validate(){
    await process('validate');
}

async function reject(){
    await process('reject');
}

var validateButton = document.getElementById('validatorbutton');
validateButton.addEventListener('click', validate);

var rejectButton = document.getElementById('rejectbutton');
rejectButton.addEventListener('click', reject);

function logout () {    
    event.preventDefault();

    localStorage.clear();
    window.location.href = 'index.html';
}

var logoutButton = document.getElementById('logoutbutton');
logoutButton.addEventListener('click', logout);