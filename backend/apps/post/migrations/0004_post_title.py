# Generated by Django 5.0.4 on 2024-06-25 09:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0003_post_dislikes'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='title',
            field=models.TextField(default='Hello'),
            preserve_default=False,
        ),
    ]
