console.log('version.js -- Manage versions');

console.log(localStorage.getItem('username'));
console.log(localStorage.getItem('access_token'));

// function for API call, also handles authorization
async function callApi(url, method, object, download) {
    var request = new XMLHttpRequest();
    
    request.responseType = 'json';
    request.open(method, url, true);
    request.setRequestHeader('Content-type', 'application/json');
    request.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
    if (download){
        request.responseType = 'blob';
    }
    
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

function saveBlob(blob, fileName) {
    var mime = require('mime-types');
    console.log(mime)

    var extension = mime.extension(blob.type);
    blob.type = extension;
    console.log(extension)
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(blob);
    a.download = (fileName + '.txt');
    a.dispatchEvent(new MouseEvent('click'));
}

async function manageVersion (versionID, operation, lockstate) {    
    switch (operation){
        case 'SHOW':                    
            response = await callApi('http://localhost:5000/show_file/' + versionID, 'POST', null, true);
            break;
        case 'RESTORE':
            response = await callApi('http://localhost:5000/restore/' + versionID, 'POST');
            searchRenderer();
            break;
        default:
            alert('Invalid parameter.');
            return;
    }
            
    const status = response.status;
    if (status == 200 || status == 201) {              
        console.log(status + ' Success.');
        console.log(response.response)
        if (operation == 'SHOW')
        {            
            saveBlob(response.response, response.response.type)
        } else{
            searchRenderer();
            alert('Version has been restored.')
        }
    } else {
          console.log( status + ' An error occured.');
          alert('An error occured.');
    }
}

async function searchRenderer () {      
    var itemname = document.getElementById('itemname').value;
    response = await callApi('http://localhost:5000/get_versions/' + itemname, 'GET', null);

    var versionData = `
                    `;

    const status = response.status;
    if (status == 200 || status == 201) {              
        console.log(status + ' Item versions found.');
        console.log(response)
        console.log(response.response)
        response.response.forEach(obj => {
            var validationStatus = "VALIDATED"
            if (obj.lockstate != false){
                validationStatus = "LOCKED"
            }
            versionData += `
                    <div class="card-body">
                        <h5 class="card-title text-muted text-uppercase text-center">${itemname}${obj.version}.0</h5>
                        <hr>
                        <ul class="fa-ul" style="list-style-type:none;">
                            <li>Name: ${obj.filename}&nbsp;</li>
                            <li>Version: ${obj.version}.0</li>
                            <li>Date of creation: ${obj.creadate}</li>
                            <li>Status: ${validationStatus}</li>
                        </ul>
                        
                        <div class="row">
                            <div class="column">
                                <button class="btn btn-outline-primary btn-block text-uppercase"
                                onclick="manageVersion(${obj.item_id},'SHOW')" type="button">DOWNLOAD</button>   
                            </div>
                            <div class="column">
                                <button class="btn btn-outline-primary btn-block text-uppercase"
                                onclick="manageVersion(${obj.item_id},'RESTORE',${obj.lockstate})" type="button">RESTORE</button>
                            </div>
                        </div>
                    </div>  
        `;
        });

        ulClass = document.querySelector(".result");    
        ulClass.innerHTML = versionData;

    } else {
          console.log( status + ' Server Error');
          console.log(response)
          alert('No results found.');
    }
    
}

var searchButton = document.getElementById('searchbutton');
searchButton.addEventListener('click', searchRenderer);


function logout () {    
    event.preventDefault();

    localStorage.clear();
    window.location.href = 'index.html';
}

var logoutButton = document.getElementById('logoutbutton');
logoutButton.addEventListener('click', logout);