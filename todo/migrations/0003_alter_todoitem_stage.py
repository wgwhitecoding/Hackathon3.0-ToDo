# Generated by Django 5.0.6 on 2024-06-20 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_alter_todoitem_stage_alter_todoitem_tags'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todoitem',
            name='stage',
            field=models.CharField(choices=[('todo', 'To Do'), ('in_progress', 'In Progress'), ('done', 'Done')], default='todo', max_length=20),
        ),
    ]
