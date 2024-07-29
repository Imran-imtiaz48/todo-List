document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filterButtons = document.querySelectorAll('.filter-button');

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskClick);
    filterButtons.forEach(button => button.addEventListener('click', filterTasks));

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = { text: taskText, completed: false };
            const tasks = getTasksFromLocalStorage();
            tasks.push(task);
            saveTasksToLocalStorage(tasks);
            taskInput.value = '';
            renderTasks();
        }
    }

    function handleTaskClick(event) {
        const target = event.target;
        const listItem = target.closest('li');
        const tasks = getTasksFromLocalStorage();
        const taskIndex = Array.from(taskList.children).indexOf(listItem);

        if (target.classList.contains('remove')) {
            tasks.splice(taskIndex, 1);
        } else if (target.classList.contains('edit')) {
            const newTaskText = prompt('Edit task:', listItem.firstChild.textContent.trim());
            if (newTaskText !== null) {
                tasks[taskIndex].text = newTaskText.trim();
            }
        } else if (target.classList.contains('complete')) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
        }

        saveTasksToLocalStorage(tasks);
        renderTasks();
    }

    function filterTasks(event) {
        filterButtons.forEach(button => button.classList.remove('active'));
        event.target.classList.add('active');
        renderTasks();
    }

    function renderTasks() {
        const tasks = getTasksFromLocalStorage();
        const activeFilter = document.querySelector('.filter-button.active').dataset.filter;
        taskList.innerHTML = '';

        tasks.forEach((task, index) => {
            if (activeFilter === 'completed' && !task.completed) return;
            if (activeFilter === 'incomplete' && task.completed) return;

            const listItem = document.createElement('li');
            if (task.completed) listItem.classList.add('completed');
            listItem.innerHTML = `
                ${task.text}
                <button class="complete">${task.completed ? 'Uncomplete' : 'Complete'}</button>
                <button class="edit">Edit</button>
                <button class="remove">Remove</button>
            `;
            taskList.appendChild(listItem);
        });
    }

    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        if (tasks.length > 0) {
            renderTasks();
        }
    }
});
