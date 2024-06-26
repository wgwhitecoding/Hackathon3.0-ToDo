"""
URL configuration for hackathon project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# hackathon/urls.py

from django.contrib import admin
from django.urls import path, include
from todo import views as todo_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('', todo_views.index, name='index'),
    path('add_todo/', todo_views.add_todo, name='add_todo'),
    path('edit_todo/<int:todo_id>/', todo_views.edit_todo, name='edit_todo'),
    path('update_stage/<int:todo_id>/<str:stage>/', todo_views.update_stage, name='update_stage'),
    path('delete_todo/<int:todo_id>/', todo_views.delete_todo, name='delete_todo'),
]















