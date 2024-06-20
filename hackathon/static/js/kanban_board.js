document.addEventListener('DOMContentLoaded', function() {
    var todoColumn = document.getElementById('todo-items');
    var inProgressColumn = document.getElementById('inprogress-items');
    var doneColumn = document.getElementById('done-items');

    var addTodoButton = document.querySelector('.add-todo');
    var todoForm = document.querySelector('.todo-form');
    var newTodoForm = document.getElementById('new-todo-form');
    var todoIdField = document.getElementById('todo-id');

    new Sortable(todoColumn, {
        group: 'kanban',
        animation: 150,
        onEnd: function(evt) {
            updateTaskStage(evt.item, 'todo');
        }
    });

    new Sortable(inProgressColumn, {
        group: 'kanban',
        animation: 150,
        onEnd: function(evt) {
            updateTaskStage(evt.item, 'in_progress');
        }
    });

    new Sortable(doneColumn, {
        group: 'kanban',
        animation: 150,
        onEnd: function(evt) {
            updateTaskStage(evt.item, 'done');
        }
    });

    addTodoButton.addEventListener('click', function() {
        todoForm.classList.remove('d-none');
        newTodoForm.reset();
        todoIdField.value = '';
        moveToTop(todoForm, addTodoButton.parentElement);
    });

    document.querySelector('.cancel-todo').addEventListener('click', function() {
        todoForm.classList.add('d-none');
    });

    newTodoForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(newTodoForm);
        var xhr = new XMLHttpRequest();
        var id = todoIdField.value;
        var url = id ? `/edit_todo/${id}/` : '/add_todo/';
        xhr.open('POST', url);
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.onload = function() {
            if (xhr.status === 200) {
                var newTodo = JSON.parse(xhr.responseText);
                var newTodoHtml = `
                    <div class="kanban-item" data-id="${newTodo.id}">
                        <div class="kanban-summary">
                            <strong>${newTodo.title}</strong>
                            <p>Due: ${new Date(newTodo.due_date).toLocaleString()}</p>
                            <div class="priority-circle ${newTodo.priority}" data-id="${newTodo.id}"></div>
                            <div class="priority-options d-none">
                                <button class="low" data-priority="low">Low Priority</button>
                                <button class="medium" data-priority="medium">Medium Priority</button>
                                <button class="high" data-priority="high">High Priority</button>
                            </div>
                        </div>
                        <div class="kanban-details d-none">
                            <form>
                                {% csrf_token %}
                                <input type="hidden" name="id" value="${newTodo.id}">
                                <div class="form-group">
                                    <label for="title">Title</label>
                                    <input type="text" class="form-control" name="title" value="${newTodo.title}" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <textarea class="form-control" name="description" readonly style="height: 100px;">${newTodo.description}</textarea>
                                </div>
                                <div class="form-group">
                                    <label for="due_date">Due Date</label>
                                    <input type="datetime-local" class="form-control" name="due_date" value="${new Date(newTodo.due_date).toISOString().slice(0, 16)}" readonly>
                                </div>
                                <div class="form-group">
                                    <label for="priority">Priority</label>
                                    <select class="form-control ${newTodo.priority}" name="priority" disabled>
                                        <option value="low" ${newTodo.priority === 'low' ? 'selected' : ''}>Low</option>
                                        <option value="medium" ${newTodo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                        <option value="high" ${newTodo.priority === 'high' ? 'selected' : ''}>High</option>
                                    </select>
                                </div>
                                <div class="btn-group">
                                    <button type="button" class="btn btn-primary edit-todo">Edit</button>
                                    <button type="button" class="btn btn-success save-todo d-none">Save</button>
                                    <button type="button" class="btn btn-secondary close-todo">Close</button>
                                    <button type="button" class="btn btn-danger delete-todo">Delete</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;
                if (id) {
                    var existingItem = document.querySelector(`.kanban-item[data-id="${id}"]`);
                    existingItem.outerHTML = newTodoHtml;
                } else {
                    todoColumn.insertAdjacentHTML('beforeend', newTodoHtml);
                }
                todoForm.classList.add('d-none');
                newTodoForm.reset();
            } else {
                console.error('Failed to add todo', xhr.responseText);
                alert('Failed to add todo: ' + xhr.responseText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
            alert('Network error');
        };
        xhr.send(formData);
    });

    document.addEventListener('click', function(event) {
        if (event.target.closest('.kanban-summary')) {
            var itemId = event.target.closest('.kanban-item').getAttribute('data-id');
            toggleTaskDetails(itemId);
        }
        if (event.target.classList.contains('edit-todo')) {
            event.preventDefault();
            var itemId = event.target.closest('.kanban-item').getAttribute('data-id');
            enableTaskEditing(itemId);
        }
        if (event.target.classList.contains('save-todo')) {
            event.preventDefault();
            var itemId = event.target.closest('.kanban-item').getAttribute('data-id');
            saveTaskDetails(itemId);
        }
        if (event.target.classList.contains('close-todo')) {
            event.preventDefault();
            var itemId = event.target.closest('.kanban-item').getAttribute('data-id');
            closeTaskDetails(itemId);
        }
        if (event.target.classList.contains('delete-todo')) {
            event.preventDefault();
            var itemId = event.target.closest('.kanban-item').getAttribute('data-id');
            deleteTask(itemId);
        }
        if (event.target.classList.contains('priority-circle')) {
            event.preventDefault();
            togglePriorityOptions(event.target);
        }
        if (event.target.closest('.priority-options button')) {
            event.preventDefault();
            changePriority(event.target);
        }
    });

    function toggleTaskDetails(id) {
        var item = document.querySelector(`.kanban-item[data-id="${id}"]`);
        var details = item.querySelector('.kanban-details');
        details.classList.toggle('d-none');
        moveToTop(item, item.closest('.kanban-column'));
    }

    function enableTaskEditing(id) {
        var item = document.querySelector(`.kanban-item[data-id="${id}"]`);
        var inputs = item.querySelectorAll('.form-control');
        var saveButton = item.querySelector('.save-todo');
        var editButton = item.querySelector('.edit-todo');
        inputs.forEach(function(input) {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
        });
        saveButton.classList.remove('d-none');
        editButton.classList.add('d-none');
    }

    function saveTaskDetails(id) {
        var item = document.querySelector(`.kanban-item[data-id="${id}"]`);
        var form = item.querySelector('form');
        var formData = new FormData(form);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `/edit_todo/${id}/`);
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.onload = function() {
            if (xhr.status === 200) {
                var updatedTodo = JSON.parse(xhr.responseText);
                item.querySelector('.kanban-summary strong').innerText = updatedTodo.title;
                item.querySelector('.kanban-summary p').innerText = `Due: ${new Date(updatedTodo.due_date).toLocaleString()}`;
                item.querySelector('.priority-circle').className = `priority-circle ${updatedTodo.priority}`;
                item.querySelector('.form-control[name="priority"]').className = `form-control ${updatedTodo.priority}`;
                item.querySelector('.form-control[name="priority"]').value = updatedTodo.priority;
                closeTaskDetails(id);
            } else {
                console.error('Failed to update todo', xhr.responseText);
                alert('Failed to update todo: ' + xhr.responseText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
            alert('Network error');
        };
        xhr.send(formData);
    }

    function closeTaskDetails(id) {
        var item = document.querySelector(`.kanban-item[data-id="${id}"]`);
        var details = item.querySelector('.kanban-details');
        var inputs = item.querySelectorAll('.form-control');
        var saveButton = item.querySelector('.save-todo');
        var editButton = item.querySelector('.edit-todo');
        inputs.forEach(function(input) {
            input.setAttribute('readonly', true);
            input.setAttribute('disabled', true);
        });
        saveButton.classList.add('d-none');
        editButton.classList.remove('d-none');
        details.classList.add('d-none');
    }

    function deleteTask(id) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `/delete_todo/${id}/`);
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.onload = function() {
            if (xhr.status === 200) {
                document.querySelector(`.kanban-item[data-id="${id}"]`).remove();
            } else {
                console.error('Failed to delete task', xhr.responseText);
                alert('Failed to delete task: ' + xhr.responseText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
            alert('Network error');
        };
        xhr.send();
    }

    function updateTaskStage(item, stage) {
        var taskId = item.getAttribute('data-id');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `/update_stage/${taskId}/${stage}/`);
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('Stage updated');
            } else {
                console.error('Failed to update stage', xhr.responseText);
                alert('Failed to update stage: ' + xhr.responseText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
            alert('Network error');
        };
        xhr.send();
    }

    function togglePriorityOptions(circle) {
        var options = circle.nextElementSibling;
        options.classList.toggle('d-none');
    }

    function changePriority(button) {
        var priority = button.getAttribute('data-priority');
        var circle = button.closest('.kanban-summary').querySelector('.priority-circle');
        var itemId = circle.getAttribute('data-id');

        // Instantly update the UI
        circle.className = `priority-circle ${priority}`;
        var prioritySelect = circle.closest('.kanban-item').querySelector('.form-control[name="priority"]');
        prioritySelect.className = `form-control ${priority}`;
        prioritySelect.value = priority;
        button.closest('.priority-options').classList.add('d-none');

        // Send the priority change to the server
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `/change_priority/${itemId}/`);
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('Priority changed');
            } else {
                console.error('Failed to change priority', xhr.responseText);
                alert('Failed to change priority: ' + xhr.responseText);
            }
        };
        xhr.onerror = function() {
            console.error('Network error');
            alert('Network error');
        };
        xhr.send(JSON.stringify({ priority: priority }));
    }

    function moveToTop(element, container) {
        container.insertBefore(element, container.firstChild);
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});

























