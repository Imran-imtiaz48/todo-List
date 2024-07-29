document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const filterButtons = document.querySelectorAll('.filter-button');
    const searchInput = document.getElementById('searchInput');
    const clearAllButton = document.getElementById('clearAllButton');
    const taskCountElement = document.createElement('div');
    
    taskCountElement.id = 'taskCount';
    document.querySelector('.container').insertBefore(taskCountElement, taskList);

    loadTasks();

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskClick);
    filterButtons.forEach(button => button.addEventListener('click', filterTasks));
    searchInput.addEventListener('input', renderTasks);
    clearAllButton.addEventListener('click', clearAllTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (taskText !== '') {
            const task = { text: taskText, dueDate, priority, completed: false };
            const tasks = getTasksFromLocalStorage();
            tasks.push(task);
            saveTasksToLocalStorage(tasks);
            taskInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = 'Low';
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
            const newTaskText = prompt('Edit task:', listItem.querySelector('.task-text').textContent.trim());
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
        const searchText = searchInput.value.trim().toLowerCase();
        taskList.innerHTML = '';

        const filteredTasks = tasks
            .filter(task => {
                if (activeFilter === 'completed' && !task.completed) return false;
                if (activeFilter === 'incomplete' && task.completed) return false;
                if (searchText && !task.text.toLowerCase().includes(searchText)) return false;
                return true;
            })
            .sort((a, b) => {
                if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                }
                return 0;
            });

        filteredTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            if (task.completed) listItem.classList.add('completed');
            listItem.innerHTML = `
                <div class="task-info">
                    <span class="task-text">${task.text}</span>
                    <span class="task-due-date">${task.dueDate ? `Due: ${task.dueDate}` : ''}</span>
                    <span class="task-priority">Priority: ${task.priority}</span>
                </div>
                <div class="actions">
                    <button class="complete">${task.completed ? 'Uncomplete' : 'Complete'}</button>
                    <button class="edit">Edit</button>
                    <button class="remove">Remove</button>
                </div>
            `;
            taskList.appendChild(listItem);
        });

        updateTaskCount(tasks);
        showDueDateNotifications(tasks);
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

    function clearAllTasks() {
        localStorage.removeItem('tasks');
        renderTasks();
    }

    function updateTaskCount(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const incomplete = total - completed;
        taskCountElement.innerHTML = `
            <p>Total Tasks: ${total}</p>
            <p>Completed Tasks: ${completed}</p>
            <p>Incomplete Tasks: ${incomplete}</p>
        `;
    }

    function showDueDateNotifications(tasks) {
        const now = new Date();
        tasks.forEach(task => {
            if (task.dueDate) {
                const dueDate = new Date(task.dueDate);
                const daysLeft = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
                if (daysLeft <= 1 && !task.completed) {
                    alert(`Task "${task.text}" is due soon!`);
                }
            }
        });
    }
});
