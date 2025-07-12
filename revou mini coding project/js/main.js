document.addEventListener('DOMContentLoaded', function() {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task');
    const dateInput = document.getElementById('date');
    const todoItems = document.getElementById('todo-items');
    const filterSelect = document.getElementById('filter-select');
    const deleteAllBtn = document.getElementById('delete-all');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function renderTodos() {
        const filter = filterSelect.value;
        const filteredTodos = todos.filter(todo => {
            if (filter === 'completed') return todo.completed;
            if (filter === 'pending') return !todo.completed;
            return true;
        });

        if (filteredTodos.length === 0) {
            todoItems.innerHTML = '<div class="no-tasks">No Task Found</div>';
            return;
        }

        todoItems.innerHTML = '';

        filteredTodos.forEach((todo, index) => {
            const todoItem = document.createElement('div');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            todoItem.innerHTML = `
                <span class="task">${todo.task}</span>
                <span class="date">${formatDate(todo.dueDate)}</span>
                <span class="status">${todo.completed ? 'Completed' : 'Pending'}</span>
                <span class="actions">
                    <button class="complete-btn" data-id="${index}">${todo.completed ? 'Undo' : 'Complete'}</button>
                    <button class="delete-btn" data-id="${index}">Delete</button>
                </span>
            `;
            
            todoItems.appendChild(todoItem);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }

    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!taskInput.value.trim()) {
            alert('Please enter a task');
            return;
        }
        
        if (!dateInput.value) {
            alert('Please select a due date');
            return;
        }
        
        const newTodo = {
            task: taskInput.value.trim(),
            dueDate: dateInput.value,
            completed: false
        };
        
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        
        taskInput.value = '';
        dateInput.value = '';
    });
    
    todoItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('complete-btn')) {
            const index = e.target.getAttribute('data-id');
            todos[index].completed = !todos[index].completed;
            saveTodos();
            renderTodos();
        }
        
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.getAttribute('data-id');
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
        }
    });

    filterSelect.addEventListener('change', renderTodos);

    deleteAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    });

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    renderTodos();
});