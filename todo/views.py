# todo/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import ToDoItem
from .forms import ToDoItemForm
from django.contrib.auth import login, authenticate

@login_required
def index(request):
    todos = ToDoItem.objects.filter(user=request.user)
    return render(request, 'todo/kanban_board.html', {'todos': todos})

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
            return redirect('index')
    else:
        form = ToDoItemForm()
    return render(request, 'todo/todo_form.html', {'form': form})

@login_required
@csrf_protect
def edit_todo(request, todo_id):
    todo = get_object_or_404(ToDoItem, id=todo_id, user=request.user)
    if request.method == 'POST':
        form = ToDoItemForm(request.POST, instance=todo)
        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form = ToDoItemForm(instance=todo)
    return render(request, 'todo/todo_form.html', {'form': form})

@login_required
@csrf_exempt
def update_stage(request, todo_id, stage):
    if request.method == 'POST':
        todo = get_object_or_404(ToDoItem, id=todo_id, user=request.user)
        todo.stage = stage
        todo.save()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'fail'}, status=400)














