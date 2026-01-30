document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clear-completed');

    let todos = JSON.parse(localStorage.getItem('zendo-todos')) || [];
    let currentFilter = 'all';

    // Initial render
    renderTodos();

    // Add Todo
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.push(newTodo);
            saveAndRender();
            todoInput.value = '';
            todoInput.focus();
        }
    });

    // Handle Todo Actions (Toggle/Delete)
    todoList.addEventListener('click', (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        
        const id = parseInt(item.dataset.id);

        if (e.target.closest('.checkbox-container')) {
            toggleTodo(id);
        } else if (e.target.closest('.delete-btn')) {
            deleteTodo(id);
        }
    });

    // Filter Todos
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });

    // Clear Completed
    clearCompletedBtn.addEventListener('click', () => {
        todos = todos.filter(t => !t.completed);
        saveAndRender();
    });

    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveAndRender();
    }

    function deleteTodo(id) {
        const item = document.querySelector(`.todo-item[data-id="${id}"]`);
        item.style.transform = 'translateX(20px)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            todos = todos.filter(todo => todo.id !== id);
            saveAndRender();
        }, 300);
    }

    function saveAndRender() {
        localStorage.setItem('zendo-todos', JSON.stringify(todos));
        renderTodos();
    }

    function renderTodos() {
        let filteredTodos = todos;
        if (currentFilter === 'active') {
            filteredTodos = todos.filter(t => !t.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.completed);
        }

        todoList.innerHTML = '';
        
        if (filteredTodos.length === 0) {
            todoList.innerHTML = `<li class="empty-state" style="text-align: center; color: var(--text-muted); margin-top: 20px;">No tasks found.</li>`;
        }

        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.dataset.id = todo.id;
            li.innerHTML = `
                <div class="checkbox-container">
                    <div class="custom-checkbox">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" aria-label="Delete Task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            todoList.appendChild(li);
        });

        // Update stats
        const activeCount = todos.filter(t => !t.completed).length;
        itemsLeft.textContent = `${activeCount} item${activeCount !== 1 ? 's' : ''} left`;
        
        // Show/hide clear completed button
        const completedCount = todos.length - activeCount;
        clearCompletedBtn.style.display = completedCount > 0 ? 'block' : 'none';
    }
});
