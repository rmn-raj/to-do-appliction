# Advanced To-Do List App

A feature-rich to-do list application built with HTML, CSS, and JavaScript.

![To-Do App Screenshot](./Screenshot%202025-06-11%20003939.png)

## Features

- Add, edit, and delete tasks
- Mark tasks as complete
- Set priority levels (low, medium, high)
- Add due dates to tasks
- Filter tasks by status and priority
- Sort tasks by different criteria
- Search tasks by text
- Dark/light theme toggle
- Task statistics
- Persistent storage (localStorage)
- Responsive design

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- localStorage API

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rmn-raj/to-do-appliction.git
   ```

2. Navigate to the project directory:
   ```bash
   cd to-do-appliction
   ```

3. Open `index.html` in your web browser.

## Git Workflow

### Initial Setup

If you want to create your own version of this project, follow these steps:

1. Fork this repository by clicking the Fork button on GitHub.

2. Clone your forked repository:
   ```bash
   git clone https://github.com/your-username/to-do-appliction.git
   ```

3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/rmn-raj/to-do-appliction.git
   ```

### Making Changes

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the code.

3. Commit your changes:
   ```bash
   git add .
   git commit -m "Add your detailed commit message here"
   ```

4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Create a Pull Request from your forked repository to the original repository.

### Syncing with Upstream

To keep your fork up to date with the original repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Project Structure

```
to-do-appliction/
├── index.html      # Main HTML file
├── style.css       # CSS styles
├── script.js       # JavaScript functionality
├── README.md       # This file
└── .gitignore      # Git ignore file
```

## Usage

1. Add a new task by typing in the input field and clicking "Add"
2. Set priority and due date before adding a task
3. Use the filters to sort and filter tasks
4. Mark tasks as complete by clicking the checkmark
5. Edit tasks by clicking the edit button
6. Delete tasks by clicking the delete button
7. Toggle between dark and light mode with the theme button
8. Search for specific tasks using the search bar

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons and design inspiration from various sources
- Special thanks to all contributors 
