import zlFetch from "https://cdn.jsdelivr.net/npm/zl-fetch@6.0.0/src/index.js";

const rootendpoint = "https://api.learnjavascript.today";

const auth = {
  username: "anoguchi",
  password: "12345",
};

zlFetch(`${rootendpoint}/tasks`, { auth })
  .then((response) => {
    console.log(response.body);
    const tasks = response.body;
    tasks.forEach((task) => {
      // Append tasks to DOM
      const taskElement = makeTaskElement(task);
      taskList.appendChild(taskElement);
      // Change empty state textAlign: // Change empty state text
      emptyStateDiv.textContent = "Your todo list is empty. Hurray! 🎉";
    });
  })
  .catch((error) => console.log(error));

const todolist = document.querySelector(".todolist");
const taskList = todolist.querySelector(".todolist__tasks");
const emptyStateDiv = todolist.querySelector(".todolist__empty-state");

function generateUniqueString(length) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

// const uniqueID = generateUniqueString(10);

function makeTaskElement({ id, name, done }) {
  // const uniqueID = generateUniqueString(10);
  const taskElement = document.createElement("li");
  taskElement.classList.add("task");
  taskElement.innerHTML = DOMPurify.sanitize(`
    <input type="checkbox" id="${id}" />
    <label for="${id}">
      <svg viewBox="0 0 20 15">
        <path d="M0 8l2-2 5 5L18 0l2 2L7 15z" fill-rule="nonzero" />
      </svg>
    </label>
    <span class="task__name">${name}</span>
    <button type="button" class="task__delete-button">
      <svg viewBox="0 0 20 20">
        <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
      </svg>
    </button>
  `);
  return taskElement;
}

todolist.addEventListener("submit", (event) => {
  event.preventDefault();
  // Get value of task
  const newTaskField = todolist.querySelector("input");
  const inputValue = newTaskField.value.trim();
  console.log(inputValue);
  // Clear the new task field
  newTaskField.value = "";
  // Bring focus back to input field
  newTaskField.focus();
  // Prevent adding of empty task
  if (!inputValue) return;
  // Create task
  const id = generateUniqueString(10);
  const taskElement = makeTaskElement({
    id,
    name: inputValue,
    done: false,
  });
  // Add task element to the DOM
  taskList.appendChild(taskElement);
});

todolist.addEventListener("click", (event) => {
  if (!event.target.matches(".task__delete-button")) return;
  // Delete a task
  const taskElement = event.target.parentElement;
  taskList.removeChild(taskElement);
  // Triggers empty state
  if (taskList.children.length === 0) {
    taskList.innerHTML = "";
  }
});
