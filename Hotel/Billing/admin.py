from django.contrib import admin
from .models import *

# class BillItemInline(admin.TabularInline):
#     model = BillItem
#     extra = 1  # kitne empty rows initially dikhen

# class BillAdmin(admin.ModelAdmin):
#     inlines = [BillItemInline]
#     list_display = ('id', 'cashier_name', 'subtotal', 'bill_date')

admin.site.register(Cashier)
admin.site.register(BillItem)
# admin.site.register(Bill, BillAdmin)

admin.site.register(Bill)





