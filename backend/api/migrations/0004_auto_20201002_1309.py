# Generated by Django 3.1.1 on 2020-10-02 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20201001_2000'),
    ]

    operations = [
        migrations.AlterField(
            model_name='detail',
            name='income',
            field=models.FloatField(default=0, verbose_name='INCOME'),
        ),
    ]