document.addEventListener('DOMContentLoaded', function () {
    const todoColumn = document.getElementById('todo-items');
    const inProgressColumn = document.getElementById('inprogress-items');
    const doneColumn = document.getElementById('done-items');

    [todoColumn, inProgressColumn, doneColumn].forEach(column => {
        new Sortable(column, {
            group: 'kanban',
            animation: 150,
            onEnd: function (evt) {
                const itemId = evt.item.dataset.id;
                let newStage;
                if (evt.to.id === 'todo-items') {
                    newStage = 'todo';
                } else if (evt.to.id === 'inprogress-items') {
                    newStage = 'in_progress';
                } else if (evt.to.id === 'done-items') {
                    newStage = 'done';
                }
                updateStage(itemId, newStage);
            }
        });
    });

    function updateStage(itemId, newStage) {
        fetch(`/update_stage/${itemId}/${newStage}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({ stage: newStage }),
        });
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


