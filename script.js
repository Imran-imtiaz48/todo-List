document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');

    addTaskButton.addEventListener('click', addTask);
    taskList.addEventListener('click', removeTask);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const listItem = document.createElement('li');
            listItem.textContent = taskText;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove';
            listItem.appendChild(removeButton);
            taskList.appendChild(listItem);
            taskInput.value = '';
        }
    }

    function removeTask(event) {
        if (event.target.classList.contains('remove')) {
            const listItem = event.target.parentElement;
            taskList.removeChild(listItem);
        }
    }
});
