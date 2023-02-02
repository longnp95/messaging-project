const list = document.getElementById('list_item');
const list_item = document.querySelectorAll('.list_item');
const list_item_active = document.querySelectorAll(".list_item.active");
const list_item_complete = document.querySelectorAll(".list_item.complete");
const btn_group = document.querySelectorAll(".btn__group");
const btn_all = document.getElementById('btn_all');
const btn_active = document.getElementById('btn_active');
const btn_done = document.getElementById('btn_done');
const count_todolist = document.getElementById('count_todolist');

count_todolist.innerHTML = `${list_item_active.length} more to do, ${list_item_complete.length} done`;

function activeButton(btn) {
  btn_group.forEach((item) => {
    item.classList.remove('active');
  });
  btn.classList.add('active');
}

function getAll() {
  appendListAciveBtn(btn_all, list_item, "Don't have a task! Add a new task!");
}

function getActive() {
  appendListAciveBtn(btn_active, list_item_active, "Don't have a task! Add a new task!");
}

function getDone() {
  appendListAciveBtn(btn_done, list_item_complete, "Don't have a task is complete! Complete a task!");
}

function appendListAciveBtn(btn, items, message) {
  activeButton(btn);
  list.innerHTML = '';
  items.forEach(element => {
    list.appendChild(element);
  });

  if (items.length == 0) {
    list.innerHTML += 
    `<div class="list_item" id="item">
      <p class="list_item-name">` + 
      `${message}` +
      `</p> </div>`;
  }
  // list.appendChild(item);
}

btn_all.addEventListener('click', getAll);
btn_active.addEventListener('click', getActive);
btn_done.addEventListener('click', getDone);