export class Task {
    constructor(name) {
        this.name = name;
        this.completed = false;
    }

    toggleCompletion() {
        this.completed = !this.completed;
    }
}