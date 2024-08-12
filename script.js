document.addEventListener('DOMContentLoaded', () => {
    // Display current date and time
    const currentDateTime = document.getElementById('currentDateTime');
    const updateDateTime = () => {
        const now = new Date();
        currentDateTime.textContent = now.toLocaleString();
    };
    setInterval(updateDateTime, 1000);

    // Fetch weather information
    const weatherInfo = document.getElementById('weatherInfo');
    fetch('https://api.openweathermap.org/data/2.5/weather?q=YourCity&appid=YourAPIKey')
        .then(response => response.json())
        .then(data => {
            const temp = (data.main.temp - 273.15).toFixed(1); // Convert Kelvin to Celsius
            weatherInfo.textContent = `${data.weather[0].description}, ${temp}°C`;
        })
        .catch(error => {
            weatherInfo.textContent = 'Unable to load weather data.';
        });

    // Fetch image of the day
    const inspirationalImage = document.getElementById('inspirationalImage');
    fetch('https://api.nasa.gov/planetary/apod?api_key=YourAPIKey')
        .then(response => response.json())
        .then(data => {
            inspirationalImage.src = data.url;
            inspirationalImage.alt = data.title;
        })
        .catch(error => {
            inspirationalImage.src = '';
            inspirationalImage.alt = 'Unable to load image.';
        });

    // Fetch latest news headlines
    const newsHeadlines = document.getElementById('newsHeadlines');
    fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=YourAPIKey')
        .then(response => response.json())
        .then(data => {
            newsHeadlines.innerHTML = '';
            data.articles.forEach(article => {
                const li = document.createElement('li');
                li.textContent = article.title;
                newsHeadlines.appendChild(li);
            });
        })
        .catch(error => {
            newsHeadlines.innerHTML = '<li>Unable to load news.</li>';
        });

    // To-Do List functionality
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const priorityInput = document.getElementById('priorityInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const clearAllButton = document.getElementById('clearAllButton');
    const filterButtons = document.querySelectorAll('.filter-button');
    const searchInput = document.getElementById('searchInput');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = (filter = 'all', search = '') => {
        taskList.innerHTML = '';
        tasks
            .filter(task => {
                if (filter === 'completed') return task.completed;
                if (filter === 'incomplete') return !task.completed;
                return true;
            })
            .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
            .forEach(task => {
                const li = document.createElement('li');
                li.classList.add(task.completed ? 'completed' : '');
                li.innerHTML = `
                    <div class="task-info">
                        <strong>${task.title}</strong>
                        <small>${task.dueDate} - ${task.priority}</small>
                    </div>
                    <div class="actions">
                        <button class="complete">${task.completed ? 'Undo' : 'Complete'}</button>
                        <button class="edit">Edit</button>
                        <button class="remove">Remove</button>
                    </div>
                `;
                li.querySelector('.complete').addEventListener('click', () => {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks(filter, search);
                });
                li.querySelector('.edit').addEventListener('click', () => {
                    taskInput.value = task.title;
                    dueDateInput.value = task.dueDate;
                    priorityInput.value = task.priority;
                    tasks = tasks.filter(t => t !== task);
                    saveTasks();
                    renderTasks(filter, search);
                });
                li.querySelector('.remove').addEventListener('click', () => {
                    tasks = tasks.filter(t => t !== task);
                    saveTasks();
                    renderTasks(filter, search);
                });
                taskList.appendChild(li);
            });
    };

    addTaskButton.addEventListener('click', () => {
        const task = {
            title: taskInput.value,
            dueDate: dueDateInput.value,
            priority: priorityInput.value,
            completed: false,
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'Low';
    });

    clearAllButton.addEventListener('click', () => {
        tasks = [];
        saveTasks();
        renderTasks();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.dataset.filter, searchInput.value);
        });
    });

    searchInput.addEventListener('input', () => {
        renderTasks(document.querySelector('.filter-button.active').dataset.filter, searchInput.value);
    });

    renderTasks();
});
