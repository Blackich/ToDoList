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
                <button class="btn-done">Done</button>
            </div>
        </div>
        <button class="btn-save">Save</button>
    </div>`;
}

function outputTemplateRender(btnSave, index) {
  return `
    <div class="task-list ${(btnSave.done === true) ? 'done' : ''}" id="${index}">
        <div class="task" contenteditable="false" style="border: none">${btnSave.text}</div>
        <div class="btn-menu" type="button">menu
            <div class="menu-content">
                <button class="btn-delete">Delete</button>
                <button class="btn-done" ${(btnSave.done === true) ? 'hidden' : ''}>Done</button>
            </div>
        </div>
        <button class="btn-save" hidden>Save</button>
    </div>`;
}

function localRender(task) {
  if (task.length > 0) {
    task.forEach((description, index) => {
      if (description.done === true) {
        output.insertAdjacentHTML('beforeend', outputTemplateRender(description, index));
      } else {
        output.insertAdjacentHTML('afterbegin', outputTemplateRender(description, index));
      }
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
    btnSave.previousElementSibling.hidden = false; // btnMenu
    btnSave.hidden = true;
    btnAdd.disabled = false;
  } else {
    btnSave.parentElement.firstElementChild.focus();
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

// taskEdit
document.addEventListener('click', (e) => {
  const divEdit = e.target;
  if (divEdit.classList.value !== 'task') return;

  divEdit.contentEditable = true; // task content
  divEdit.style.border = '1px solid'; // task border
  divEdit.parentElement.children[1].hidden = true; // btnMenu
  divEdit.parentElement.children[2].hidden = false; // btnSave
  divEdit.focus(); // task focus
  btnAdd.disabled = true;
});

// taskBlur
document.addEventListener('focusout', (e) => {
  const blurTask = e.target;
  if (blurTask.classList.value !== 'task') return; // task
  if (e.relatedTarget === blurTask.parentElement.children[2]) return; // btnSave

  if (!tasks[blurTask.parentElement.id]) {
    output.removeChild(blurTask.parentElement);
    btnAdd.disabled = false;
  } else {
    blurTask.textContent = tasks[blurTask.parentElement.id].text;
    blurTask.contentEditable = false; // task
    blurTask.style.border = 'hidden'; // task
    blurTask.parentElement.children[1].hidden = false; // btnMenu
    blurTask.parentElement.children[2].hidden = true; // btnSave
    btnAdd.disabled = false;
  }
});

// btnDone
document.addEventListener('click', (e) => {
  const btnDone = e.target;
  if (btnDone.classList.value !== 'btn-done') return;

  tasks[btnDone.closest('.task-list').id].done = true;
  updateLocal();

  btnDone.closest('.task-list').classList.add('done');

  const clone = btnDone.closest('.task-list').cloneNode(true);
  if (document.querySelectorAll('.task-list.done')[1]) {
    document.querySelectorAll('.task-list.done')[1].before(clone);
  } else {
    output.append(clone);
  }

  btnDone.closest('.task-list').remove();
  clone.children[1].children[0].children[1].hidden = true; // btnDone
});

// clear Storage
const clear = document.querySelector('.clear');
clear.addEventListener('click', () => {
  localStorage.clear();
});
