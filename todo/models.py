from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.user.username

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class ToDoItem(models.Model):
    STAGE_CHOICES = [
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('done', 'Done')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=10, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium')
    completed = models.BooleanField(default=False)
    recurring_interval = models.CharField(max_length=50, blank=True, null=True)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default='todo')
    tags = models.ManyToManyField(Tag, blank=True, related_name='todo_items')
    collaborators = models.ManyToManyField(User, through='Collaborator', related_name='collaborations')

    def __str__(self):
        return self.title

class Attachment(models.Model):
    file_path = models.FileField(upload_to='attachments/')
    todoitem = models.ForeignKey(ToDoItem, on_delete=models.CASCADE, related_name='attachments')

    def __str__(self):
        return self.file_path.name

class Subtask(models.Model):
    todoitem = models.ForeignKey(ToDoItem, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message

class Comment(models.Model):
    todoitem = models.ForeignKey(ToDoItem, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comment_text

class Reminder(models.Model):
    todoitem = models.ForeignKey(ToDoItem, on_delete=models.CASCADE)
    reminder_time = models.DateTimeField()

    def __str__(self):
        return f'Reminder for {self.todoitem.title} at {self.reminder_time}'

class ActivityLog(models.Model):
    todoitem = models.ForeignKey(ToDoItem, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    activity = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.activity

class Collaborator(models.Model):
    todoitem = models.ForeignKey(ToDoItem, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.username} collaborating on {self.todoitem.title}'

class SharedList(models.Model):
    list_name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.list_name

class SharedListToDoItems(models.Model):
    shared_list = models.ForeignKey(SharedList, on_delete=models.CASCADE)
    todoitem = models.ForeignKey(ToDoItem, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('shared_list', 'todoitem')

class UserPreference(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    preference_key = models.CharField(max_length=100)
    preference_value = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.user.username} - {self.preference_key}'

class UserTheme(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    theme_name = models.CharField(max_length=100)
    primary_color = models.CharField(max_length=7)
    secondary_color = models.CharField(max_length=7)

    def __str__(self):
        return f'{self.user.username} - {self.theme_name}'







