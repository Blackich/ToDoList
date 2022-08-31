const output = document.querySelector('.output');
const btnAdd = document.querySelector('.btn-add');

const tasks = !localStorage.tasks ? [] : JSON.parse(localStorage.getItem('tasks'));

function TodoTask(text) {
  this.text = text;
  this.done = false;
}

function setId(task) {
  return task.length > 0
    ? task.length
    : 0;
}

function outputTemplate() {
  return `
    <div class="task-list" id="${setId(tasks)}">
        <div class="task" contenteditable="true"></div>
        <div class="btn-menu" type="button" hidden>menu
            <div class="menu-content">
                <button class="btn-delete">Delete</button>
                <button class="btn-change">Edit</button>
            </div>
        </div>
        <button class="btn-save">Save</button>
        <button class="btn-cancel">Cancel</button>
    </div>`;
}

function outputTemplateRender(btnSave, index) {
  return `
    <div class="task-list" id="${index}">
        <div class="task" contenteditable="false" style="border: none">${btnSave.text}</div>
        <div class="btn-menu" type="button">menu
            <div class="menu-content">
                <button class="btn-delete">Delete</button>
                <button class="btn-change">Edit</button>
            </div>
        </div>
        <button class="btn-save" hidden>Save</button>
        <button class="btn-cancel" hidden>Cancel</button>
    </div>`;
}

function localRender(task) {
  if (task.length > 0) {
    task.forEach((btnSave, index) => {
      output.insertAdjacentHTML('afterbegin', outputTemplateRender(btnSave, index));
    });
  }
}

localRender(tasks);

function updateLocal() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

btnAdd.addEventListener('click', () => {
  output.insertAdjacentHTML('afterbegin', outputTemplate());
  document.querySelectorAll('.task')[0].focus();
  btnAdd.disabled = true;
});

// btnSave
document.addEventListener('click', (e) => {
  const btnSave = e.target;
  if (btnSave.classList.value !== 'btn-save') return;

  if (!tasks[btnSave.parentElement.id]) {
    if (btnSave.parentElement.firstElementChild.textContent) {
      tasks.push(new TodoTask(btnSave.parentElement.firstElementChild.textContent));
      updateLocal();

      btnSave.parentElement.firstElementChild.textContent = tasks[btnSave.parentElement.id].text;
      btnSave.parentElement.firstElementChild.contentEditable = false; // task
      btnSave.parentElement.firstElementChild.style.border = 'hidden'; // task
      btnSave.nextElementSibling.hidden = true; // btnCancel
      btnSave.previousElementSibling.hidden = false; // btnMenu
      btnSave.hidden = true;
      btnAdd.disabled = false;
    } else {
      btnSave.parentElement.firstElementChild.focus();
    }
  } else if (btnSave.parentElement.firstElementChild.textContent) {
    tasks[btnSave.parentElement.id].text = btnSave.parentElement.firstElementChild.textContent;
    updateLocal();

    btnSave.parentElement.firstElementChild.contentEditable = false; // task
    btnSave.parentElement.firstElementChild.style.border = 'hidden'; // task
    btnSave.nextElementSibling.hidden = true; // btnCancel
    btnSave.previousElementSibling.hidden = false; // btnMenu
    btnSave.hidden = true;
    btnAdd.disabled = false;
  } else {
    btnSave.parentElement.firstElementChild.focus();
  }
});

// btnCancel
document.addEventListener('click', (e) => {
  const btnCancel = e.target;
  if (btnCancel.classList.value !== 'btn-cancel') return;

  if (!tasks[btnCancel.parentElement.id]) {
    output.removeChild(btnCancel.parentElement);
    btnAdd.disabled = false;
  } else {
    btnCancel.parentElement.firstElementChild.textContent = tasks[btnCancel.parentElement.id].text;
    btnCancel.parentElement.firstElementChild.contentEditable = false; // task
    btnCancel.parentElement.firstElementChild.style.border = 'hidden'; // task
    btnCancel.previousElementSibling.hidden = true; // btnSave
    btnCancel.parentElement.children[1].hidden = false; // btnMenu
    btnCancel.hidden = true;
    btnAdd.disabled = false;
  }
});

// btnDelete
document.addEventListener('click', (e) => {
  const btnDelete = e.target;
  if (btnDelete.classList.value !== 'btn-delete') return;

  Array.from(document.querySelectorAll('.task-list'))
    .filter((tlist) => tlist.id > btnDelete.closest('.task-list').id)
    .map((tlist) => tlist.id -= 1);

  tasks.splice(btnDelete.closest('.task-list').id, 1);
  updateLocal();
  output.removeChild(btnDelete.closest('.task-list'));
});

// btnEdit
document.addEventListener('click', (e) => {
  const btnChange = e.target;
  if (btnChange.classList.value !== 'btn-change') return;

  const parentListBtnChange = btnChange.closest('.task-list');
  btnChange.closest('.btn-menu').hidden = true;

  parentListBtnChange.firstElementChild.contentEditable = true; // task content
  parentListBtnChange.firstElementChild.style.border = '1px solid'; // task border
  parentListBtnChange.children[2].hidden = false; // btnSave
  parentListBtnChange.lastElementChild.hidden = false; // btnCancel
  parentListBtnChange.firstElementChild.focus(); // task focus
});

// clear Storage
const clear = document.querySelector('.clear');
clear.addEventListener('click', () => {
  localStorage.clear();
});
