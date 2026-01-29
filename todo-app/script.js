// Todo List 应用主逻辑
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // 添加按钮事件
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        
        // 输入框回车事件
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // 过滤按钮事件
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text) {
            const newTodo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };

            this.todos.unshift(newTodo);
            this.saveToLocalStorage();
            this.render();
            input.value = '';
        }
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveToLocalStorage();
        this.render();
    }

    editTodo(id, newText) {
        if (newText.trim()) {
            this.todos = this.todos.map(todo =>
                todo.id === id ? { ...todo, text: newText.trim() } : todo
            );
            this.saveToLocalStorage();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToLocalStorage();
        this.render();
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    render() {
        this.renderTodoList();
        this.updateStats();
    }

    renderTodoList() {
        const todoList = document.getElementById('todoList');
        const filteredTodos = this.getFilteredTodos();

        todoList.innerHTML = '';

        if (filteredTodos.length === 0) {
            todoList.innerHTML = '<li class="empty-todo">暂无任务</li>';
            return;
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-btn">删除</button>
            `;
            
            // 绑定复选框事件
            li.querySelector('.todo-checkbox').addEventListener('change', (e) => {
                this.toggleTodo(parseInt(e.target.dataset.id));
            });

            // 绑定删除按钮事件
            li.querySelector('.delete-btn').addEventListener('click', () => {
                this.deleteTodo(todo.id);
            });

            // 绑定双击编辑事件
            li.querySelector('.todo-text').addEventListener('dblclick', () => {
                this.startEditing(li, todo);
            });

            todoList.appendChild(li);
        });
    }

    startEditing(listItem, todo) {
        const todoText = listItem.querySelector('.todo-text');
        const checkbox = listItem.querySelector('.todo-checkbox');
        
        // 创建输入框替换文本
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = todo.text;
        input.focus();
        
        // 替换文本节点为输入框
        todoText.replaceWith(input);

        // 处理保存事件
        const saveEdit = () => {
            if (input.value.trim()) {
                this.editTodo(todo.id, input.value);
            } else {
                // 如果内容为空，恢复原内容
                this.render(); // 重新渲染整个列表
            }
        };

        input.addEventListener('blur', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }

    updateStats() {
        const totalCount = this.todos.length;
        const completedCount = this.todos.filter(todo => todo.completed).length;

        document.getElementById('totalCount').textContent = `总计: ${totalCount}`;
        document.getElementById('completedCount').textContent = `已完成: ${completedCount}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// 添加一些实用工具函数
function clearCompletedTodos() {
    const app = new TodoApp();
    app.todos = app.todos.filter(todo => !todo.completed);
    app.saveToLocalStorage();
    app.render();
}

function markAllAsCompleted() {
    const app = new TodoApp();
    app.todos = app.todos.map(todo => ({ ...todo, completed: true }));
    app.saveToLocalStorage();
    app.render();
}