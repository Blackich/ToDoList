const output = document.querySelector('.output');
const btnAdd = document.querySelector('.btn-add');

const tasks = !localStorage.tasks ? [] : JSON.parse(localStorage.getItem('tasks'));

function TodoTask(text) {
  this.text = text;
  this.done = false;
}

function setId(tasks) {
  return tasks.length > 0
    ? tasks.length
    : 0;
}

function outputTemplate(tasks) {
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

function localRender(tasks) {
  if (tasks.length > 0) {
    tasks.forEach((btnSave, index) => {
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

const btnsSave = document.getElementsByClassName('btn-save');
document.addEventListener('click', (e) => {
  for (const btnSave of btnsSave) {
    if (e.target !== btnSave) continue;

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
  }
}); // <-- btnsSave

const btnsCancel = document.getElementsByClassName('btn-cancel');
document.addEventListener('click', (e) => {
  for (const btnCancel of btnsCancel) {
    if (e.target !== btnCancel) continue;

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
  }
}); // <-- btnsCancel

const tasksList = document.getElementsByClassName('task-list');
const btnsDelete = document.getElementsByClassName('btn-delete');
document.addEventListener('click', (e) => {
  for (const btnDelete of btnsDelete) {
    if (e.target !== btnDelete) continue;

    for (const taskList of tasksList) {
      if (taskList.id > btnDelete.closest('.task-list').id) taskList.id -= 1;
    }

    tasks.splice(btnDelete.closest('.task-list').id, 1);
    updateLocal();
    output.removeChild(btnDelete.closest('.task-list'));
  }
}); // <-- btnsDelete

const btnsChange = document.getElementsByClassName('btn-change');
document.addEventListener('click', (e) => {
  for (const btnChange of btnsChange) {
    if (e.target !== btnChange) continue;

    const parentListBtnChange = btnChange.closest('.task-list');
    btnChange.closest('.btn-menu').hidden = true;

    parentListBtnChange.firstElementChild.contentEditable = true; // task content
    parentListBtnChange.firstElementChild.style.border = '1px solid'; // task border
    parentListBtnChange.children[2].hidden = false; // btnSave
    parentListBtnChange.lastElementChild.hidden = false; // btnCancel
    parentListBtnChange.firstElementChild.focus(); // task focus
  }
}); // <-- btnsChange

// clear Storage
const clear = document.querySelector('.clear');
clear.addEventListener('click', () => {
  localStorage.clear();
});
