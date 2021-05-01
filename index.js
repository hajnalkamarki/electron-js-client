console.log('index.js -- Authentication for logging in');

// function for API call
async function callApi(url, method, object) {
  var request = new XMLHttpRequest();
    
  request.responseType = 'json';
  request.open(method, url, true);
  request.setRequestHeader('Content-type', 'application/json');
  
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

async function logIn () {
    event.preventDefault();

    
    var object = {
          username: document.getElementById('username').value,
          password: document.getElementById('password').value,
        };
      
    response = await callApi('http://localhost:5000/login', 'POST', object);
        
    const status = response.status;
    if (status == 200) {
          console.log(response);          
          console.log(response.response);
          
          localStorage.setItem('username',document.getElementById('username').value);
          localStorage.setItem('access_token',response.response.access_token);

          let redirect = response.response.message;
          
          switch(redirect) {
            case 'admin':          
                window.location.href = 'admin_page.html';
                break;
            case 'worker':
                window.location.href = 'upload_page.html';
                break;
            default:
                window.location.href = 'profile_page.html';
          }
    } else {
          console.log('Server Error: ${response.status} ${response.response.message}');
          alert('Wrong username or password.');
    }
  }
  var button = document.getElementById('loginbutton');
  button.addEventListener('click', logIn);