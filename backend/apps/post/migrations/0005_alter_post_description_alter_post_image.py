# Generated by Django 5.0.4 on 2024-06-25 09:06

import apps.post.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0004_post_title'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=apps.post.models.upload_to),
        ),
    ]
