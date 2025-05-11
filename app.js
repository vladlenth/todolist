import { Task } from './task.js';
import { Project } from './project.js';

const projectInput = document.getElementById('projectInput');
const descriptionInput = document.getElementById('descriptionInput');
const dueDateInput = document.getElementById('dueDateInput');
const priorityInput = document.getElementById('priorityInput');
const addProjectButton = document.getElementById('addProjectButton');
const projectList = document.getElementById('projectList');

let projects = [];

// Инициализация проектов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];
    
    // Создаем экземпляры Project для каждого сохраненного проекта
    projects = storedProjects.map(projectData => {
        const project = new Project(projectData.name, projectData.description, projectData.dueDate, projectData.priority);
        project.tasks = projectData.tasks ? projectData.tasks.map(taskData => new Task(taskData.name, taskData.priority)) : []; // Инициализация задач
        return project;
    });

    renderProjects();
});

addProjectButton.addEventListener('click', () => {
    const projectName = projectInput.value;
    const description = descriptionInput.value;
    const dueDate = dueDateInput.value;
    const priority = priorityInput.value;

    if (projectName) {
        const project = new Project(projectName, description, dueDate, priority);
        projects.push(project);
        saveProjects();
        renderProjects();
        clearInputs();
    }
});

function renderProjects() {
    projectList.innerHTML = '';
    projects.forEach((project, index) => {
        const projectDiv = document.createElement('div');
        const projectTitle = document.createElement('h2');
        const projectDescriptionContainer = document.createElement('p'); // Создаем контейнер для описания
        const deleteDescriptionButton = document.createElement('button'); // Кнопка для удаления описания
        const taskInput = document.createElement('input');
        const addTaskButton = document.createElement('button');
        const deleteProjectButton = document.createElement('button');
        const taskList = document.createElement('ul');

        projectTitle.textContent = `${project.name} (Приоритет: ${project.priority}, Срок: ${project.dueDate})`;
        
        // Устанавливаем текст описания и добавляем кнопку в контейнер
        if (project.description) {
            projectDescriptionContainer.textContent = `Описание: ${project.description}`;
            deleteDescriptionButton.textContent = 'Удалить описание'; // Текст кнопки

            // Обработчик события для кнопки удаления описания
            deleteDescriptionButton.addEventListener('click', () => {
                project.description = ''; // Очищаем описание проекта
                projectDescriptionContainer.textContent = ''; // Удаляем текст описания
                deleteDescriptionButton.style.display = 'none'; // Скрываем кнопку
                saveProjects();
            });
            
            // Добавляем кнопку удаления в контейнер с описанием
            projectDescriptionContainer.appendChild(deleteDescriptionButton); 
        }

        taskInput.placeholder = 'Введите задачу';
        addTaskButton.textContent = 'Добавить задачу';
        
        deleteProjectButton.textContent = 'Удалить проект';
        
        addTaskButton.addEventListener('click', () => {
            const taskName = taskInput.value;
            if (taskName) {
                const taskPriority = project.priority; // Используем приоритет проекта для задач
                const task = new Task(taskName, taskPriority);
                project.addTask(task); // Добавляем задачу к проекту
                saveProjects(); // Сохраняем изменения в localStorage
                renderTasks(taskList, project);
                taskInput.value = '';
            }
        });

        deleteProjectButton.addEventListener('click', () => {
            projects.splice(index, 1);
            saveProjects();
            renderProjects();
        });

        // Добавляем элементы в проектный блок
        projectDiv.appendChild(projectTitle);
        
        if (project.description) { 
            projectDiv.appendChild(projectDescriptionContainer); // Добавляем контейнер с описанием в проектный блок
        }
        
        projectDiv.appendChild(taskInput);
        projectDiv.appendChild(addTaskButton);
        
         // Отображаем задачи для текущего проекта
         renderTasks(taskList, project);
        
         projectDiv.appendChild(taskList); // Добавляем список задач в проектный блок

         // Добавляем кнопку удаления проекта в проектный блок
         projectDiv.appendChild(deleteProjectButton);

         projectList.appendChild(projectDiv);
     });
 }

 function renderTasks(taskList, project) {
     taskList.innerHTML = '';
     if (project.tasks) { // Проверяем наличие задач у проекта
       project.tasks.forEach((task) => {
           const li = document.createElement('li');

           li.textContent = task.name;

           const deleteTaskButton = document.createElement('button');
           deleteTaskButton.textContent = 'Удалить задачу';

           deleteTaskButton.addEventListener('click', () => {
               project.removeTask(task.name);
               saveProjects();
               renderTasks(taskList, project);
           });

           li.appendChild(deleteTaskButton);
           taskList.appendChild(li);
       });
     }
 }

 function saveProjects() {
     localStorage.setItem('projects', JSON.stringify(projects));
 }

 function clearInputs() {
     projectInput.value = '';
     descriptionInput.value = '';
     dueDateInput.value = '';
     priorityInput.value = 'low'; // Сброс приоритета на низкий
 }