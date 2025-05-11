export class Project {
    constructor(name, description, dueDate, priority) {
        this.name = name; // Название
        this.description = description; // Описание
        this.dueDate = dueDate; // Срок выполнения
        this.priority = priority; // Приоритет
        this.tasks = []; // Массив для хранения задач
    }

    // Добавления новой задачи в проект
    addTask(task) {
        this.tasks.push(task); // Добавляем в массив
    }

    // Удаления задачи
    removeTask(taskName) {
        // Фильтруем массив, оставляем, которые не совпадает с переданным именем
        this.tasks = this.tasks.filter(task => task.name !== taskName);
    }
}