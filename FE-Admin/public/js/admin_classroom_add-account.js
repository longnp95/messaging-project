const accounts = document.getElementById('accounts');
const submit = document.getElementById('submit');

function validated() {
  flag = false;

  if (flag) {
    submit.classList.add('disabled');
    submit.disabled = true;
  } else {
    submit.classList.remove('disabled');
    submit.disabled = false;
  }
}

accounts.addEventListener('click', validated);