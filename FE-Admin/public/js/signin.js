const username = document.getElementById('username');
const username_error = document.getElementById('username_error');
const password = document.getElementById('password');
const password_error = document.getElementById('password_error');
const show_hide_password = document.getElementById('show_hide_password');
const submit = document.getElementById('submit');

//pattern
const username_pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const password_pattern = /^(?=.*[0-9])(?=.*[a-z])([a-z0-9]{8,64})$/;

function validated() {
  flag = false;

  if (username.value.toLowerCase().match(username_pattern)) {
    username_error.classList.add('none');
  }
  else {
    username_error.classList.remove('none');
    flag = true;
  }

  if (password.value.match(password_pattern)) {
    password_error.classList.add('none');
  }
  else {
    password_error.classList.remove('none');
    flag = true;
  }

  submit.disabled = flag;
}

function showHidePassword() {
  if (password.type === "password") {
    password.type = "text";
  }
  else {
    password.type = "password";
  }
}

username.addEventListener('keyup', validated);
password.addEventListener('keyup', validated);
show_hide_password.addEventListener('click', showHidePassword);