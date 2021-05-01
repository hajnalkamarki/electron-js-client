    console.log('admin.js -- Employee managemant as an admin user');

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

    async function submit () {
        event.preventDefault();
    
        
        var object = {
              username: document.getElementById('username').value,
              password: document.getElementById('password').value,
              firstname: document.getElementById('firstname').value,
              lastname: document.getElementById('lastname').value,
              email: document.getElementById('email').value,
              phone: document.getElementById('phone').value,
              fax: document.getElementById('fax').value,
              address: document.getElementById('address').value,
              city: document.getElementById('city').value,
              region: document.getElementById('region').value,
              postcode: document.getElementById('postcode').value,
              country: document.getElementById('country').value,
              create: document.getElementById('create').checked,
            };
          
        response = await callApi('http://localhost:5000/add_employee', 'POST', object);
            
        const status = response.status;
        if (status == 200 || status == 201) {              
            console.log(status + ' Employee has been added.');
            alert('Employee has been added.');
        } else {
              console.log( status + ' Server Error');
              alert('Invalid data');
        }
    }

    var submitButton = document.getElementById('submitbutton');
    submitButton.addEventListener('click', submit);

    
    function logout () {    
        event.preventDefault();

        localStorage.clear();
        window.location.href = 'index.html';
    }

    var logoutButton = document.getElementById('logoutbutton');
    logoutButton.addEventListener('click', logout);