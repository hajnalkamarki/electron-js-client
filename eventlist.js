console.log('eventlist.js -- Listing events');

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

async function manageEvent (eventID, operation) {    
    switch (operation){
        case 'FINISH':   
        console.log(eventID)                 
            response = await callApi('http://localhost:5000/set_finished/' + eventID, 'PUT');
            renderEvents();
            break;
        case 'CANCEL':
            response = await callApi('http://localhost:5000/delete_event/' + eventID, 'PUT');
            renderEvents();
            break;
        default:
            alert('Invalid parameter.');
            return;
    }
            
    const status = response.status;
    if (status == 200 || status == 201 || status == 202) {              
        console.log(status + ' Success.');
    } else {
          console.log( status + ' An error occured.');
          alert('An error occured.');
    }
}

async function renderEvents () {      
    response = await callApi('http://localhost:5000/get_all_events', 'GET');

    var eventData = `
                    `;

    const status = response.status;
    if (status == 200 || status == 201) {              
        console.log(status + ' Events found.');
        response.response.forEach(obj => {
            eventData += `
                    <div class="card-body">
                        <h5 class="card-title text-muted text-uppercase text-center">${obj.name}</h5>
                        <hr>
                        <ul class="fa-ul" style="list-style-type:none;">
                            <li>Identifier: ${obj.event_id}&nbsp;</li>
                            <li>Description: ${obj.desc}</li>
                            <li>State: ${obj.state}</li>
                            <li>Due date: ${obj.duedate}</li>
                        </ul>
                        
                        <div class="row">
                            <div class="column">
                                <button class="btn btn-outline-primary btn-block text-uppercase"
                                onclick="manageEvent(${obj.event_id},'FINISH')" type="button">SET FINISHED</button>   
                            </div>
                            <div class="column">
                                <button class="btn btn-outline-primary btn-block text-uppercase"
                                onclick="manageEvent(${obj.event_id},'CANCEL')" type="button">CANCEL</button>
                            </div>
                        </div>
                    </div>  
        `;
        });

        ulClass = document.querySelector(".result");    
        ulClass.innerHTML = eventData;

    } else {
          console.log( status + ' Server Error');
          console.log(response)
          alert('No results found.');
    }
    
}

window.addEventListener('DOMContentLoaded', renderEvents);


function logout () {    
    event.preventDefault();

    localStorage.clear();
    window.location.href = 'index.html';
}

var logoutButton = document.getElementById('logoutbutton');
logoutButton.addEventListener('click', logout);