import zlFetch from "https://cdn.jsdelivr.net/npm/zl-fetch@6.0.0/src/index.js";

/* globals DOMPurify zlFetch */
// ========================
// Variables
// ========================
const rootendpoint = "https://api.learnjavascript.today";
const auth = {
  // REPLACE WITH YOUR USERNAME AND PASSWORD
  username: "anoguchi",
  password: "12345",
};

const todolist = document.querySelector(".todolist");
const taskList = todolist.querySelector(".todolist__tasks");
const emptyStateDiv = todolist.querySelector(".todolist__empty-state");

// ========================
// Functions
// ========================
/**
 * Generates a unique string
 * @param {Number} length - Length of string
 * @returns {String}
 */
function generateUniqueString(length) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Creates a task element
 * @param {Object} task - Task object
 * @param {String} task.id - Task id
 * @param {String} name - Task
 * @param {Boolean} done - Whether the task is complete
 * @returns {HTMLElement}
 */
function makeTaskElement({ id, name, done }) {
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
    </button>`);
  return taskElement;
}

// ========================
// Execution
// ========================

// Getting and fetching tasks
zlFetch(`${rootendpoint}/tasks`, { auth })
  .then((response) => {
    // Append tasks to DOM
    const tasks = response.body;
    tasks.forEach((task) => {
      const taskElement = makeTaskElement(task);
      taskList.appendChild(taskElement);
    });

    // Change empty state text
    emptyStateDiv.textContent = "Your todo list is empty. Hurray! 🎉";
  })
  .catch((error) => console.error(error));

// Adding a task to the DOM
todolist.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get value of task
  const newTaskField = todolist.querySelector("input");
  const inputValue = DOMPurify.sanitize(newTaskField.value.trim());

  // Prevent adding of empty task
  if (!inputValue) return;

  // Disable button
  const newTaskButton = todolist.querySelector("button");
  newTaskButton.setAttribute("disabled", true);

  // Give indication that we're adding a task
  const buttonTextElement = newTaskButton.querySelector("span");
  buttonTextElement.textContent = "Adding task...";

  zlFetch
    .post(`${rootendpoint}/tasks`, {
      auth,
      body: {
        name: inputValue,
      },
    })
    .then((response) => {
      // Append task to DOM
      const task = response.body;
      const taskElement = makeTaskElement(task);
      taskList.appendChild(taskElement);

      // Clear the new task field
      newTaskField.value = "";

      // Bring focus back to input field
      newTaskField.focus();
    })
    .catch((error) => console.error(error))
    .finally((_) => {
      // Enables button
      newTaskButton.removeAttribute("disabled");

      // Change button text back to original text
      buttonTextElement.textContent = "Add task";
    });
});

// Deleting a task from the DOM
taskList.addEventListener("click", (event) => {
  if (!event.target.matches(".task__delete-button")) return;

  // Removes the task
  const taskDiv = event.target.parentElement;
  taskList.removeChild(taskDiv);

  // Triggers empty state
  if (taskList.children.length === 0) taskList.innerHTML = "";
});
