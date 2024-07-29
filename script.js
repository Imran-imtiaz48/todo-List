document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const dueDateInput = document.getElementById("dueDateInput");
    const priorityInput = document.getElementById("priorityInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const clearAllButton = document.getElementById("clearAllButton");
    const taskList = document.getElementById("taskList");
    const filterButtons = document.querySelectorAll(".filter-button");
    const searchInput = document.getElementById("searchInput");

    const noteInput = document.getElementById("noteInput");
    const saveNoteButton = document.getElementById("saveNoteButton");
    const notesList = document.getElementById("notesList");

    const apiKey = "your_openweathermap_api_key"; // Replace with your OpenWeatherMap API key

    // Load saved tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Load saved notes from localStorage
    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    // Event listener for adding a task
    addTaskButton.addEventListener("click", function () {
        const task = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (task) {
            tasks.push({ task, dueDate, priority, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
            dueDateInput.value = "";
            priorityInput.value = "Low";
        }
    });

    // Event listener for clearing all tasks
    clearAllButton.addEventListener("click", function () {
        tasks = [];
        saveTasks();
        renderTasks();
    });

    // Event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderTasks();
        });
    });

    // Event listener for searching tasks
    searchInput.addEventListener("input", renderTasks);

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Render tasks
    function renderTasks() {
        const filter = document.querySelector(".filter-button.active").dataset.filter;
        const searchTerm = searchInput.value.toLowerCase();
        taskList.innerHTML = "";
        tasks
            .filter(task => {
                if (filter === "completed" && !task.completed) return false;
                if (filter === "incomplete" && task.completed) return false;
                if (!task.task.toLowerCase().includes(searchTerm)) return false;
                return true;
            })
            .forEach((task, index) => {
                const li = document.createElement("li");
                li.className = task.completed ? "completed" : "";

                const taskInfo = document.createElement("div");
                taskInfo.className = "task-info";
                taskInfo.innerHTML = `
                    <p>${task.task}</p>
                    <small>Due: ${task.dueDate} | Priority: ${task.priority}</small>
                `;
                li.appendChild(taskInfo);

                const actions = document.createElement("div");
                actions.className = "actions";
                actions.innerHTML = `
                    <button class="complete">${task.completed ? "Uncomplete" : "Complete"}</button>
                    <button class="edit">Edit</button>
                    <button class="remove">Remove</button>
                `;
                actions.querySelector(".complete").addEventListener("click", () => {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks();
                });
                actions.querySelector(".edit").addEventListener("click", () => {
                    taskInput.value = task.task;
                    dueDateInput.value = task.dueDate;
                    priorityInput.value = task.priority;
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                });
                actions.querySelector(".remove").addEventListener("click", () => {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks();
                });
                li.appendChild(actions);

                taskList.appendChild(li);
            });
    }

    // Event listener for saving a note
    saveNoteButton.addEventListener("click", function () {
        const note = noteInput.value.trim();

        if (note) {
            notes.push(note);
            saveNotes();
            renderNotes();
            noteInput.value = "";
        }
    });

    // Save notes to localStorage
    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    // Render notes
    function renderNotes() {
        notesList.innerHTML = "";
        notes.forEach((note, index) => {
            const noteItem = document.createElement("div");
            noteItem.className = "note-item";
            noteItem.textContent = note;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "remove";
            deleteButton.addEventListener("click", () => {
                notes.splice(index, 1);
                saveNotes();
                renderNotes();
            });

            noteItem.appendChild(deleteButton);
            notesList.appendChild(noteItem);
        });
    }

    // Fetch weather information
    async function fetchWeather() {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=your_city_name&appid=${apiKey}&units=metric`);
        const data = await response.json();
        const weatherInfo = document.getElementById("weatherInfo");
        weatherInfo.innerHTML = `
            <p>${data.name}: ${data.weather[0].description}, ${data.main.temp}°C</p>
        `;
    }

    // Fetch quote of the day
    async function fetchQuote() {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        const quoteText = document.getElementById("quoteText");
        quoteText.textContent = `"${data.content}" — ${data.author}`;
    }

    // Initial render
    renderTasks();
    renderNotes();
    fetchWeather();
    fetchQuote();
});
