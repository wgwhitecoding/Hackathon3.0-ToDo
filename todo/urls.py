from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('add_todo/', views.add_todo, name='add_todo'),
    path('edit_todo/<int:todo_id>/', views.edit_todo, name='edit_todo'),
    path('update_stage/<int:todo_id>/<str:stage>/', views.update_stage, name='update_stage'),
]






