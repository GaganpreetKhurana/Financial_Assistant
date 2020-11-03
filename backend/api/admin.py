from django.contrib import admin

from .models import *


# Register your models here.
class DetailAdmin(admin.ModelAdmin):
    """
    Admin Model for Detail Model
    """
    readonly_fields = [
        'user',
        'income',
        'savings',
        'totalExpenditure',
        'housing',
        'food',
        'healthcare',
        'transportation',
        'recreation',
        'miscellaneous',
        'others',
        'stock',
        'totalTransactions',
        'date_created'
    ]

    class Meta:
        model = Detail


admin.site.register(Detail, DetailAdmin)  # Register Detail Admin with admin


class TransactionAdmin(admin.ModelAdmin):
    """
    Admin Model for Transaction Model
    """
    readonly_fields = ['time', 'user', 'details', 'last_updated']

    class Meta:
        model = Transaction


admin.site.register(Transaction, TransactionAdmin)  # Register Transaction Admin to admin
