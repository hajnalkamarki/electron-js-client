console.log('upload.js -- Uploading file as a worker');

console.log(localStorage.getItem('username'));
console.log(localStorage.getItem('access_token'));

// function for API call, also handles authorization
async function callApi(url, method, object) {
  var request = new XMLHttpRequest();
    
  request.responseType = 'json';
  request.open(method, url, true);
  request.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('access_token'));
  if (object) {  
    request.send(object);
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
    
    var uploadInput = document.getElementById('uploadbutton');
    var inputFile = uploadInput.files[0];    
    var uploadForm = new FormData();

    uploadForm.append('name', document.getElementById('name').value);
    uploadForm.append('desc', document.getElementById('desc').value);
    uploadForm.append('extension', document.getElementById('extension').value);
    uploadForm.append('type', document.getElementById('type').value);
    uploadForm.append('project_id', document.getElementById('project_id').value);
    uploadForm.append('creator_id', localStorage.getItem('username'));

    uploadForm.append('file2upload', inputFile);

    response = await callApi('http://localhost:5000/add_version', 'POST', uploadForm);
        
    const status = response.status;
    if (status == 200 || status == 201) {
          console.log(response.response);          
          alert('File has been uploaded.');
    } else {
          console.log('Server Error: ' + response.status);
          alert('Something went wrong, please try again.');
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