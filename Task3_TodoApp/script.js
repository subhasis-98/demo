let editMode = false;
let currentEditingRow = null;

document.getElementById('taskForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const desc = document.getElementById('description').value.trim();

  if (!title || !desc) {
    alert('Please fill in both fields.');
    return;
  }

  if (editMode && currentEditingRow) {
    currentEditingRow.children[0].innerText = title;
    currentEditingRow.children[1].innerText = desc;
    resetForm();
  } else {
    addPendingTask(title, desc);
    this.reset();
  }
});

function addPendingTask(title, desc) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${title}</td>
    <td>${desc}</td>
    <td>
      <button onclick="markComplete(this)">✔</button>
      <button onclick="editTask(this)">✏</button>
      <button onclick="deleteTask(this)">❌</button>
    </td>
  `;
  document.getElementById('pendingList').appendChild(row);
}

function markComplete(btn) {
  const row = btn.parentElement.parentElement;
  const title = row.children[0].innerText;
  const desc = row.children[1].innerText;

  const completedRow = document.createElement('tr');
  completedRow.innerHTML = `
    <td>${title}</td>
    <td>${desc}</td>
    <td><button onclick="deleteTask(this)">❌</button></td>
  `;

  document.getElementById('completedList').appendChild(completedRow);
  row.remove();
}

function deleteTask(btn) {
  btn.parentElement.parentElement.remove();
  if (btn.parentElement.parentElement === currentEditingRow) {
    resetForm();
  }
}

function editTask(btn) {
  const row = btn.parentElement.parentElement;
  const title = row.children[0].innerText;
  const desc = row.children[1].innerText;

  document.getElementById('title').value = title;
  document.getElementById('description').value = desc;

  document.getElementById('submitBtn').textContent = '🔄 Update Task';
  editMode = true;
  currentEditingRow = row;
}

function resetForm() {
  document.getElementById('taskForm').reset();
  document.getElementById('submitBtn').textContent = '➕ Add Task';
  editMode = false;
  currentEditingRow = null;
}