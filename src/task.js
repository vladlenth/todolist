// класс Task
export class Task {
    constructor(name) {
        this.name = name;
        this.completed = false; // Статус задачи по умолчанию
    }
    
    toggleCompletion() {
        this.completed = !this.completed; // Статус - противоположный
    }
}