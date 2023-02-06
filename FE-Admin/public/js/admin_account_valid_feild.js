const username = document.getElementById("username");
const username_error = document.getElementById("username_error");
const avatarURL = document.getElementById("avatarURL");
const avatar = document.getElementById("avatar");
const avartar_error = document.getElementById("avartar_error");
const avartar_success = document.getElementById("avartar_success");
const password = document.getElementById("password");
const password_error = document.getElementById("password_error");
const full_name = document.getElementById("full_name");
const full_name_error = document.getElementById("full_name_error");
const gender = document.getElementById("gender");
const roles = document.getElementById("roles");
const submit = document.getElementById("submit");

//pattern
const username_pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const password_pattern = /^(?=.*[0-9])(?=.*[a-z])([a-z0-9]{8,64})$/;
const full_name_pattern = /^[a-zA-Z]+ [a-zA-Z]+$/;
var allowedExtensions = /(\.png)$/i;
// var allowedExtensions = /(\.png|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd)$/i;

async function validated() {
  flag = false;

  // Allowing file type
  const fileInput = document.querySelector('input[type="file"]');
  var filePath = fileInput.value;

  if (filePath && filePath != '') {
    if (!allowedExtensions.exec(filePath)) {
      avartar_error.classList.remove('d-none');
      avartar_success.classList.add('d-none');

      flag = true;
    } else {
      const result = await uploadSingleFile();
      const error = result.error;
      const data = result.data;

      if (error.status == 200) {
        avartar_error.classList.add('d-none');
        avartar_success.classList.remove('d-none');
        avartar_success.innerHTML = `Upload file successfully!`;

        avatarURL.value = data.avatarURL;
      } else {
        avartar_error.innerHTML = `${error.message}`;
        avartar_error.classList.remove('d-none');
        avartar_success.classList.add('d-none');

        flag = true;
      }
    }
  } else {
    avartar_error.classList.remove('d-none');
    avartar_success.classList.add('d-none');

    flag = true;
  }

  if (username.value.toLowerCase().match(username_pattern)) {
    username_error.classList.add('d-none');
  }
  else {
    username_error.classList.remove('d-none');
    flag = true;
  }

  if (password.value.match(password_pattern)) {
    password_error.classList.add('d-none');
  }
  else {
    password_error.classList.remove('d-none');
    flag = true;
  }

  if (full_name.value.match(full_name_pattern)) {
    full_name_error.classList.add('d-none');
  }
  else {
    full_name_error.classList.remove('d-none');
    flag = true;
  }

  if (flag) {
    submit.classList.add("disabled");
    submit.disabled = true;
  } else {
    submit.classList.remove("disabled");
    submit.disabled = false;
  }
}

function findValueCookieByKey(keyCookie) {
  const allcookies = document.cookie;
  const cookiearray = allcookies.split(';');

  const fileField = document.querySelector('input[type="file"]');

  for (var i = 0; i < cookiearray.length; i++) {
    const cookieElement = cookiearray[i].split('=');
    let key = cookieElement[0];
    let value = cookieElement[1];

    if (key === keyCookie) {
      return value;
    }
  }
}

function uploadSingleFile() {
  const apiPort = "http://localhost:3000";
  const path = "/admin/upload_avatar";
  const url = apiPort + path;

  let token = findValueCookieByKey('token');

  const fileField = document.querySelector('input[type="file"]');

  if (fileField.id === 'avatar') {
    return putSingleFile(url, token, fileField.id, fileField)
      .then(response => {
        return response.json();
      })
      .catch(error => console.log('error', error));
  }
}

const putSingleFile = function (url, token, feildName, fileField) {
  var headers = new Headers();
  headers.append("token", token);

  const formData = new FormData();
  formData.append(feildName, fileField.files[0]);

  const requestOption = {
    method: 'POST',
    mode: 'cors',
    headers: headers,
    referrerPolicy: 'same-origin',
    body: formData,
    redirect: 'follow'
  };

  const response = fetch(url, requestOption);

  return response;
};

username.addEventListener('keyup', validated);
avatar.addEventListener('change', validated);
password.addEventListener('keyup', validated);
full_name.addEventListener('keyup', validated);
gender.addEventListener('click', validated);
roles.addEventListener('click', validated);