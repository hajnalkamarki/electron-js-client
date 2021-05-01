console.log('emplist.js -- Listing employee data');

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
    response = await callApi('http://localhost:5000/get_all_employees', 'GET', null);

    var empData = `
                    <li">An error occured</li>
                    `;

    const status = response.status;

    if (status == 200 || status == 201) {              
        console.log(status + ' Employees found.');
        empData = `                    `;
        response.response.forEach(obj => {
            console.log(obj)
            role = ''
            if (obj.username == 'admin'){
                role = 'ADMIN'
            }else if(obj.create == true){
                role = 'VALIDATOR'
            }else{
                role = 'EMPLOYEE'
            }
            empData += `            
                        <div class="card-body">
                            <h5 class="card-title text-muted text-uppercase text-center">${obj.username}<br></h5>
                            <h6 class="card-price text-center">${role}</h6>
                            <hr>
                            <ul class="fa-ul">
                                <li>First name: ${obj.firstname}</li>
                                <li>Last name: ${obj.lastname}</li>
                                <li>E-mail: ${obj.email}</li>
                                <li>Phone: ${obj.phone}</li>
                                <li>Fax: ${obj.fax}</li>                                
                                <li>Country: ${obj.country}</li>
                                <li>Address: ${obj.postcode} ${obj.city}, ${obj.address}</li>
                            </ul>
                        </div>
        `;
        });

    } else {
          console.log( status + ' Server Error');
          alert('An error occured.');
    }
    
    const ulClass = document.querySelector(".result");
    
    ulClass.innerHTML = empData;
}


window.addEventListener('DOMContentLoaded', processData);


function logout () {    
    event.preventDefault();

    localStorage.clear();
    window.location.href = 'index.html';
}

var logoutButton = document.getElementById('logoutbutton');
logoutButton.addEventListener('click', logout);