const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const categoryInput = document.getElementById("todo-category");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");
const filterButtons = document.querySelectorAll(".filter-btn");

// Load and display saved tasks
let tasks = JSON.parse(localStorage.getItem("todos")) || [];
displayTasks();

// Add task
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  const due = dateInput.value;
  const category = categoryInput.value;

  if (text === "") return;

  const newTask = {
    text,
    due,
    category,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  sortTasks();
  saveAndRender();
  input.value = "";
  dateInput.value = "";
});

// Toggle completion or remove task (event delegation)
todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const idx = e.target.closest("li").dataset.index;
    tasks.splice(idx, 1);
    saveAndRender();
  } else if (e.target.classList.contains("checkbox")) {
    const idx = e.target.closest("li").dataset.index;
    tasks[idx].completed = e.target.checked;
    sortTasks();
    saveAndRender();
  }
});

// Filter tasks
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    displayTasks(btn.dataset.filter);
  });
});

// Theme toggle
themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  document.body.dataset.theme = currentTheme;
  themeToggle.textContent = currentTheme === "light" ? "🌙" : "☀️";
  localStorage.setItem("theme", currentTheme);
});

// Load theme preference
(function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.dataset.theme = savedTheme;
  themeToggle.textContent = savedTheme === "light" ? "🌙" : "☀️";
})();

// Display tasks
function displayTasks(filter = "all") {
  todoList.innerHTML = "";

  const filtered =
    filter === "all"
      ? tasks
      : filter === "completed"
      ? tasks.filter((t) => t.completed)
      : tasks.filter((t) => !t.completed);

  filtered.forEach((task, index) => {
    const li = document.createElement("li");
    li.dataset.index = index;
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""}>
      <div class="task-info">
        <span>${task.text}</span>
        ${
          task.due
            ? `<span class="task-date">📅 ${new Date(task.due).toDateString()}</span>`
            : ""
        }
        <span class="task-category">${task.category}</span>
      </div>
      <button class="remove-btn">&times;</button>
    `;

    todoList.appendChild(li);
  });
}

// Sort tasks (by due date + completed last)
function sortTasks() {
  tasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.due && b.due) return new Date(a.due) - new Date(b.due);
    return 0;
  });
}

// Save to localStorage and re-render
function saveAndRender() {
  localStorage.setItem("todos", JSON.stringify(tasks));
  displayTasks(document.querySelector(".filter-btn.active").dataset.filter);
}

// Reminder notifications
function checkReminders() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
    return;
  }

  const now = new Date();
  tasks.forEach((task) => {
    if (!task.completed && task.due) {
      const dueDate = new Date(task.due);
      const diff = (dueDate - now) / (1000 * 60 * 60); // hours
      if (diff > 0 && diff < 1) {
        new Notification("⏰ Reminder", {
          body: `Task due soon: ${task.text}`,
          icon: "https://cdn-icons-png.flaticon.com/512/907/907717.png",
        });
      }
    }
  });
}
setInterval(checkReminders, 60 * 60 * 1000); // check every hour
