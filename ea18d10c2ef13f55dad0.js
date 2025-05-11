// Импорты задач, проектов, si ass ass(css)
import "./styles.css";
import { Task } from './task.js';
import { Project } from './project.js';

const projectInput = document.getElementById('projectInput'); // Поле для названия
const descriptionInput = document.getElementById('descriptionInput'); // Поле для описания
const dueDateInput = document.getElementById('dueDateInput'); // Поле для срока выполнения
const priorityInput = document.getElementById('priorityInput'); // Поле для приоритета
const addProjectButton = document.getElementById('addProjectButton'); // Кнопка для добавления нового проекта
const projectList = document.getElementById('projectList'); // Контейнер для отображения проекта

let projects = []; // Массив для всех проектов

// При загрузки страницы выполняется код
document.addEventListener('DOMContentLoaded', () => {
    // Получаем сохраненные проекты из localStorage или создаем пустой массив, если их нет
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];

    // Превращаем сохраненные данные в объекты Project и добавляем их в массив projects
    projects = storedProjects.map(projectData => {
        const project = new Project(projectData.name, projectData.description, projectData.dueDate, projectData.priority);
        // Если у проекта есть задачи, создаем объекты Task для каждой задачи
        project.tasks = projectData.tasks ? projectData.tasks.map(taskData => new Task(taskData.name, taskData.priority)) : [];
        return project; // Возвращаем созданный проект
    });
    renderProjects(); // Отображаем проекты на странице
});

// Обработчик события для кнопки добавления нового проекта
addProjectButton.addEventListener('click', () => {
    const projectName = projectInput.value; // Получаем название
    const description = descriptionInput.value; // Получаем описание
    const dueDate = dueDateInput.value; // Получаем срок выполнения
    const priority = priorityInput.value; // Получаем приоритет

    if (projectName) { // Проверяем, что название проекта не пустое
        const project = new Project(projectName, description, dueDate, priority);
        projects.push(project); // Добавляем новый проект в массив проектов
        saveProjects(); // Сохраняем проекты в localStorage
        renderProjects(); // Обновляем отображение проектов на странице
        clearInputs(); // Очищаем поля ввода после добавления проекта
    }
});

// Функция для отображения проектов на странице
function renderProjects() {
    projectList.innerHTML = ''; // Очищаем контейнер с проектами перед обновлением

    projects.forEach((project, index) => { // Проходим по каждому проекту в массиве projects
        const projectDiv = document.createElement('div'); // Создаем контейнер для каждого проекта
        const projectTitle = document.createElement('h2'); // Заголовок для названия проекта
        const projectDescriptionContainer = document.createElement('p'); // Контейнер для описания проекта
        const deleteDescriptionButton = document.createElement('button'); // Кнопка для удаления описания проекта
        const taskInput = document.createElement('input'); // Поле ввода для новой задачи
        const addTaskButton = document.createElement('button'); // Кнопка для добавления новой задачи
        const deleteProjectButton = document.createElement('button'); // Кнопка для удаления всего проекта
        const taskList = document.createElement('ul'); // Список задач текущего проекта

        projectTitle.textContent = `${project.name} (Приоритет: ${project.priority}, Срок: ${project.dueDate})`; 
        // Устанавливаем текст заголовка с названием, приоритетом и сроком выполнения

        if (project.description) { 
            projectDescriptionContainer.textContent = `Описание: ${project.description}`; 
            deleteDescriptionButton.textContent = 'Удалить описание'; 

            deleteDescriptionButton.addEventListener('click', () => { 
                project.description = '';  // Очищаем описание у проекта 
                projectDescriptionContainer.textContent = '';  // Удаляем текст описания из контейнера 
                deleteDescriptionButton.style.display = 'none';  // Скрываем кнопку удаления описания 
                saveProjects();  // Сохраняем изменения в localStorage 
            });            
            projectDescriptionContainer.appendChild(deleteDescriptionButton); 
            // Добавляем кнопку удаления описания в контейнер с описанием
        }
        
        // Кнопки
        taskInput.placeholder = 'Введите задачу';
        addTaskButton.textContent = 'Добавить задачу';
        deleteProjectButton.textContent = 'Удалить проект';
        
        addTaskButton.addEventListener('click', () => { 
            const taskName = taskInput.value;  // Получаем название задачи
            if (taskName) {  // Проверяем, что название не пустое 
                const taskPriority = project.priority;  // Приоритет
                const task = new Task(taskName, taskPriority);  // Новая задача
                project.addTask(task);  // Добавляем задачу
                saveProjects();  // Сохраняем в localStorage 
                renderTasks(taskList, project);  // Отображение задач текущего проекта 
                taskInput.value = '';  // Очищаем поле ввода
            }
        });

        deleteProjectButton.addEventListener('click', () => { 
            projects.splice(index, 1);  // Удаляем проект из массива по индексу 
            saveProjects();  // Сохраняем изменения в localStorage 
            renderProjects();  // Обновляем отображение проектов на странице 
        });

        projectDiv.appendChild(projectTitle);  // Добавляем заголовок проекта в контейнер 
        
        if (project.description) {  
            projectDiv.appendChild(projectDescriptionContainer);  
            // Добавляем контейнер с описанием
        }
        
        projectDiv.appendChild(taskInput);  // Добавляем поле ввода задач
        projectDiv.appendChild(addTaskButton); // Добавляем кнопку
        
         renderTasks(taskList, project); // Отображаем задачи
        
         projectDiv.appendChild(taskList); // Добавляем список       
         projectDiv.appendChild(deleteProjectButton); // Добавляем кнопку
         projectList.appendChild(projectDiv); // Добавляем блок
     });
 }

// Функция для отображения задач текущего проекта
function renderTasks(taskList, project) {
     taskList.innerHTML = '';

     if (project.tasks) {
       project.tasks.forEach((task) => {  
           const li = document.createElement('li');
           li.textContent = task.name;
           const deleteTaskButton = document.createElement('button'); // Создаем кнопку удаления
           deleteTaskButton.textContent = 'Удалить задачу'; // Текс кнопки

           deleteTaskButton.addEventListener('click', () => {
               // Обработчик события нажатия на кнопку удаления задачи
               project.removeTask(task.name); // Удаляем задачу из текущего проекта
               saveProjects(); // Сохраняем в localStorage
               renderTasks(taskList, project); // Обновляем отображение задач
           });

           li.appendChild(deleteTaskButton); // Добавляем кнопку удаления
           taskList.appendChild(li); // Добавляем элемент списка
       });
     }
 }

// Функция для сохранения массива проектов в localStorage.
function saveProjects() {
     localStorage.setItem('projects', JSON.stringify(projects)); // Строкуем в Стетхэма
 }

// Функция для очистки полей ввода после добавления нового проекта
function clearInputs() {
     // Очищаем все
     projectInput.value = '';  
     descriptionInput.value = '';  
     dueDateInput.value = '';  
     priorityInput.value = 'low';  // Приоритет низкий по умолчанию
}