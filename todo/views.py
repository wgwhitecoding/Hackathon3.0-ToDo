from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import ToDoItem
from .forms import ToDoItemForm, CustomUserCreationForm
from django.contrib.auth import login, authenticate

def index(request):
    todos = ToDoItem.objects.all()
    return render(request, 'todo/kanban_board.html', {'todos': todos})

def add_todo(request):
    if request.method == 'POST':
        form = ToDoItemForm(request.POST)
        if form.is_valid():
            todo_item = form.save(commit=False)
            todo_item.user = request.user  # set the user to the currently logged-in user
            todo_item.save()
            return redirect('index')
    else:
        form = ToDoItemForm()
    return render(request, 'todo/todo_form.html', {'form': form})

def edit_todo(request, todo_id):
    todo = get_object_or_404(ToDoItem, id=todo_id)
    if request.method == 'POST':
        form = ToDoItemForm(request.POST, instance=todo)
        if form.is_valid():
            form.save()
            return redirect('index')
    else:
        form = ToDoItemForm(instance=todo)
    return render(request, 'todo/todo_form.html', {'form': form})

@csrf_exempt
def update_stage(request, todo_id, stage):
    if request.method == 'POST':
        todo = get_object_or_404(ToDoItem, id=todo_id)
        todo.stage = stage
        todo.save()
        return JsonResponse({'status': 'ok'})
    return JsonResponse({'status': 'fail'}, status=400)

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)
            return redirect('index')
    else:
        form = CustomUserCreationForm()
    return render(request, 'registration/register.html', {'form': form})








