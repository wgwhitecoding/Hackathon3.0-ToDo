from django.contrib import admin
from .models import Category, Project, Tag, Attachment, ToDoItem, Subtask, Notification, Comment, Reminder, ActivityLog, Collaborator, SharedList, SharedListToDoItems, UserPreference, UserTheme

admin.site.register(Category)
admin.site.register(Project)
admin.site.register(Tag)
admin.site.register(Attachment)
admin.site.register(ToDoItem)
admin.site.register(Subtask)
admin.site.register(Notification)
admin.site.register(Comment)
admin.site.register(Reminder)
admin.site.register(ActivityLog)
admin.site.register(Collaborator)
admin.site.register(SharedList)
admin.site.register(SharedListToDoItems)
admin.site.register(UserPreference)
admin.site.register(UserTheme)
