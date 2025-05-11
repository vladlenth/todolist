// project.js
export class Project {
    constructor(name, description, dueDate, priority) {
        this.name = name;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.tasks = []; // Инициализация массива задач
    }

    addTask(task) {
        this.tasks.push(task); // Добавление задачи в массив
    }

    removeTask(taskName) {
        this.tasks = this.tasks.filter(task => task.name !== taskName);
    }
}