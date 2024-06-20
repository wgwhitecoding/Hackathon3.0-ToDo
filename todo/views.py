from django.contrib.auth.models import User
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import ToDoItem
from .forms import ToDoItemForm

@login_required
def index(request):
    todos = ToDoItem.objects.filter(user=request.user)
    return render(request, 'todo/kanban_board.html', {'todos': todos, 'users': User.objects.all()})

@login_required
@csrf_protect
def add_todo(request):
    if request.method == 'POST':
        form = ToDoItemForm(request.POST)
        if form.is_valid():
            todo_item = form.save(commit=False)
            todo_item.user = request.user
            todo_item.save()
            form.save_m2m()  # Save many-to-many relationships
            return JsonResponse({'status': 'ok', 'id': todo_item.id, 'title': todo_item.title, 'due_date': todo_item.due_date, 'priority': todo_item.priority})
        else:
            return JsonResponse({'error': form.errors}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required
@csrf_protect
def edit_todo(request, todo_id):
    todo = get_object_or_404(ToDoItem, id=todo_id, user=request.user)
    if request.method == 'POST':
        form = ToDoItemForm(request.POST, instance=todo)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'ok', 'id': todo.id, 'title': todo.title, 'due_date': todo.due_date, 'priority': todo.priority})
        else:
            return JsonResponse({'error': form.errors}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required
@csrf_exempt
def update_stage(request, todo_id, stage):
    if request.method == 'POST':
        todo = get_object_or_404(ToDoItem, id=todo_id, user=request.user)
        todo.stage = stage
        todo.save()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'fail'}, status=400)

@login_required
@csrf_exempt
def delete_todo(request, todo_id):
    if request.method == 'POST':
        todo = get_object_or_404(ToDoItem, id=todo_id, user=request.user)
        todo.delete()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'fail'}, status=400)





















