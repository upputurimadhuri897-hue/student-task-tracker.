
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const taskFilter = document.getElementById("taskFilter");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

let tasks = [];

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("studentTasks") || "[]"
    );

    tasks = Array.isArray(savedTasks) ? savedTasks : [];
} catch {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function updateSummary() {
    totalTasks.textContent = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    completedTasks.textContent = completed;
    pendingTasks.textContent = tasks.length - completed;
}

function renderTasks() {
    taskList.replaceChildren();

    const filter = taskFilter.value;

    const filteredTasks = tasks.filter(task => {
        if (filter === "Pending") return !task.completed;
        if (filter === "Completed") return task.completed;
        return true;
    });

    if (filteredTasks.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent =
            tasks.length === 0
                ? "No tasks yet. Add your first task!"
                : "No tasks match this filter.";

        taskList.appendChild(message);
        updateSummary();
        return;
    }

    filteredTasks.forEach(task => {
        const card = document.createElement("article");
        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }

        const title = document.createElement("h3");
        title.textContent = task.title;

        const subject = document.createElement("p");
        subject.textContent = `Subject: ${task.subject}`;

        const deadline = document.createElement("p");
        deadline.textContent = `Deadline: ${task.deadline}`;

        const priority = document.createElement("span");
        priority.className = `priority ${task.priority}`;
        priority.textContent = `${task.priority} Priority`;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-btn";
        completeButton.textContent = task.completed
            ? "Mark Pending"
            : "Mark Completed";

        completeButton.addEventListener("click", () => {
            tasks = tasks.map(item =>
                item.id === task.id
                    ? { ...item, completed: !item.completed }
                    : item
            );

            saveTasks();
            renderTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            const confirmed = confirm(
                `Delete the task "${task.title}"?`
            );

            if (!confirmed) return;

            tasks = tasks.filter(item => item.id !== task.id);

            saveTasks();
            renderTasks();
        });

        actions.append(completeButton, deleteButton);
        card.append(title, subject, deadline, priority, actions);
        taskList.appendChild(card);
    });

    updateSummary();
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const subject = document.getElementById("taskSubject").value.trim();
    const deadline = document.getElementById("taskDeadline").value;
    const priority = document.getElementById("taskPriority").value;

    if (!title || !subject || !deadline) {
        alert("Please fill in all required fields.");
        return;
    }

    if (deadline < new Date().toLocaleDateString("en-CA")) {
        alert("Please select today or a future deadline.");
        return;
    }

    const newTask = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        title,
        subject,
        deadline,
        priority,
        completed: false
    };

    tasks.unshift(newTask);

    saveTasks();
    taskForm.reset();
    renderTasks();
});

taskFilter.addEventListener("change", renderTasks);

renderTasks();
