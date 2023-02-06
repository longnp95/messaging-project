const class_name = document.getElementById('name');
const class_name_error = document.getElementById('name_error');
const submit = document.getElementById('submit');

const class_name_pattern = /^(?=.*[0-9])(?=.*[A-Z])([A-Z0-9]{6,8})$/;

function validated() {
  flag = false;

  if (class_name.value.match(class_name_pattern)) {
    class_name_error.classList.add('d-none');
  }
  else {
    class_name_error.classList.remove('d-none');
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

class_name.addEventListener('keyup', validated);