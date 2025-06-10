// DOM Elements
const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput = document.getElementById('due-date');
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const priorityFilter = document.getElementById('priority-filter');
const sortBy = document.getElementById('sort-by');
const clearCompletedBtn = document.getElementById('clear-completed');
const tasksStats = document.getElementById('tasks-stats');
const themeToggle = document.getElementById('theme-toggle');

// Tasks array to store todo items
let tasks = [];
let filteredTasks = [];

// Theme management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadTasks();
    applyFiltersAndSort();
    updateTaskStats();
});

// Add event listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
searchInput.addEventListener('input', applyFiltersAndSort);
statusFilter.addEventListener('change', applyFiltersAndSort);
priorityFilter.addEventListener('change', applyFiltersAndSort);
sortBy.addEventListener('change', applyFiltersAndSort);
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
themeToggle.addEventListener('click', toggleTheme);

// Function to format date for display
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// Function to get priority badge symbol
function getPrioritySymbol(priority) {
    switch(priority) {
        case 'high': return '⚠️';
        case 'medium': return '⚡';
        case 'low': return '🔹';
        default: return '';
    }
}

// Function to check if a task is overdue
function isOverdue(dueDate) {
    if (!dueDate) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const taskDueDate = new Date(dueDate);
    taskDueDate.setHours(0, 0, 0, 0);
    
    return taskDueDate < today;
}

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    if (taskText === '') {
        return; // Don't add empty tasks
    }
    
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        dateAdded: new Date().toISOString(),
        priority: priority,
        dueDate: dueDate
    };
    
    tasks.push(newTask);
    taskInput.value = ''; // Clear input field
    saveTasks();
    applyFiltersAndSort();
    updateTaskStats();
}

// Function to toggle task completion status
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasks();
    applyFiltersAndSort();
    updateTaskStats();
}

// Function to delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    applyFiltersAndSort();
    updateTaskStats();
}

// Function to clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    applyFiltersAndSort();
    updateTaskStats();
}

// Function to enter edit mode for a task
function editTask(id) {
    const taskItem = document.querySelector(`[data-id="${id}"]`);
    const taskTextElement = taskItem.querySelector('.task-text');
    
    taskItem.classList.add('editing');
    
    // Make text editable
    const originalText = taskTextElement.textContent;
    taskTextElement.classList.add('editable');
    taskTextElement.contentEditable = true;
    taskTextElement.focus();
    
    // Set up event listeners for save and cancel buttons
    const saveBtn = taskItem.querySelector('.save-btn');
    const cancelBtn = taskItem.querySelector('.cancel-btn');
    
    const saveFn = () => saveEdit(id, taskTextElement);
    const cancelFn = () => cancelEdit(taskTextElement, originalText);
    
    saveBtn.addEventListener('click', saveFn, { once: true });
    cancelBtn.addEventListener('click', cancelFn, { once: true });
    
    // Also allow Enter to save and Escape to cancel
    taskTextElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveFn();
        } else if (e.key === 'Escape') {
            cancelFn();
        }
    });
}

// Function to save task edit
function saveEdit(id, taskTextElement) {
    const newText = taskTextElement.textContent.trim();
    
    if (newText === '') {
        return cancelEdit(taskTextElement); // Don't save empty tasks
    }
    
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, text: newText };
        }
        return task;
    });
    
    exitEditMode(taskTextElement);
    saveTasks();
    applyFiltersAndSort();
}

// Function to cancel task edit
function cancelEdit(taskTextElement, originalText = '') {
    taskTextElement.textContent = originalText;
    exitEditMode(taskTextElement);
    renderTasks(filteredTasks);
}

// Helper function to exit edit mode
function exitEditMode(taskTextElement) {
    const taskItem = taskTextElement.closest('.task-item');
    taskItem.classList.remove('editing');
    taskTextElement.classList.remove('editable');
    taskTextElement.contentEditable = false;
}

// Function to apply filters and sorting
function applyFiltersAndSort() {
    const searchText = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const priorityValue = priorityFilter.value;
    const sortByValue = sortBy.value;
    
    // First, filter the tasks
    filteredTasks = tasks.filter(task => {
        // Search text filter
        const matchesSearch = task.text.toLowerCase().includes(searchText);
        
        // Status filter
        let matchesStatus = true;
        if (statusValue === 'active') {
            matchesStatus = !task.completed;
        } else if (statusValue === 'completed') {
            matchesStatus = task.completed;
        }
        
        // Priority filter
        let matchesPriority = true;
        if (priorityValue !== 'all') {
            matchesPriority = task.priority === priorityValue;
        }
        
        return matchesSearch && matchesStatus && matchesPriority;
    });
    
    // Then, sort the filtered tasks
    filteredTasks.sort((a, b) => {
        switch(sortByValue) {
            case 'due':
                // Sort by due date, tasks without due dates at the end
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
                
            case 'priority':
                // Sort by priority (high → medium → low)
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
                
            case 'alphabetical':
                // Sort alphabetically
                return a.text.localeCompare(b.text);
                
            case 'added':
            default:
                // Sort by date added (newest first)
                return new Date(b.dateAdded) - new Date(a.dateAdded);
        }
    });
    
    renderTasks(filteredTasks);
}

// Function to update task statistics
function updateTaskStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeTasks = totalTasks - completedTasks;
    
    tasksStats.textContent = `${totalTasks} total · ${activeTasks} active · ${completedTasks} completed`;
}

// Function to save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
}

// Function to render tasks in the DOM
function renderTasks(tasksToRender) {
    taskList.innerHTML = '';
    
    if (tasksToRender.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = 'No tasks to display';
        emptyMessage.className = 'empty-message';
        taskList.appendChild(emptyMessage);
        return;
    }
    
    tasksToRender.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.id = task.id;
        
        const isTaskOverdue = !task.completed && isOverdue(task.dueDate);
        const dueDateText = task.dueDate ? formatDate(task.dueDate) : '';
        const overdueClass = isTaskOverdue ? 'overdue' : '';
        
        taskItem.innerHTML = `
            <div class="task-header">
                <div class="task-info">
                    <span class="task-text">${task.text}</span>
                    <div class="task-meta">
                        ${task.priority ? `<span class="priority-badge">${getPrioritySymbol(task.priority)} ${task.priority}</span>` : ''}
                        ${dueDateText ? `<span class="due-date ${overdueClass}">📅 ${dueDateText}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="complete-btn" title="Mark as ${task.completed ? 'incomplete' : 'complete'}">
                        ${task.completed ? '↩' : '✓'}
                    </button>
                    <button class="edit-btn" title="Edit">✎</button>
                    <button class="delete-btn" title="Delete">×</button>
                    <button class="save-btn" title="Save">✓</button>
                    <button class="cancel-btn" title="Cancel">×</button>
                </div>
            </div>
        `;
        
        taskList.appendChild(taskItem);
        
        // Add event listeners to buttons
        const completeBtn = taskItem.querySelector('.complete-btn');
        const editBtn = taskItem.querySelector('.edit-btn');
        const deleteBtn = taskItem.querySelector('.delete-btn');
        
        completeBtn.addEventListener('click', () => toggleComplete(task.id));
        editBtn.addEventListener('click', () => editTask(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
    });
} 