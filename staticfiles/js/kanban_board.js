// static/js/kanban_board.js

document.addEventListener('DOMContentLoaded', function() {
    var todoColumn = document.getElementById('todo-items');
    var inProgressColumn = document.getElementById('inprogress-items');
    var doneColumn = document.getElementById('done-items');

    new Sortable(todoColumn, {
        group: 'kanban',
        animation: 150,
        onEnd: function (evt) {
            updateTaskStage(evt.item, 'todo');
        }
    });

    new Sortable(inProgressColumn, {
        group: 'kanban',
        animation: 150,
        onEnd: function (evt) {
            updateTaskStage(evt.item, 'in_progress');
        }
    });

    new Sortable(doneColumn, {
        group: 'kanban',
        animation: 150,
        onEnd: function (evt) {
            updateTaskStage(evt.item, 'done');
        }
    });

    function updateTaskStage(item, stage) {
        var taskId = item.getAttribute('data-id');
        var xhr = new XMLHttpRequest();
        xhr.open('POST', `/update_stage/${taskId}/${stage}/`);
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.onload = function() {
            if (xhr.status === 200) {
                console.log('Stage updated');
            } else {
                console.error('Failed to update stage');
            }
        };
        xhr.send();
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




