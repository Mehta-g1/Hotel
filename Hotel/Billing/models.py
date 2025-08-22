from django.db import models
from Order.models import Dishes
# Create your models here.
class Cashier(models.Model):
    ch = [("Day","Day"), ("Night", "Night")]
    chashier_name = models.CharField(max_length=100)
    shift = models.CharField(choices=ch, max_length=50)

    def __str__(self):
        return self.chashier_name

class Bill(models.Model):
    cashier_name = models.ForeignKey(Cashier, on_delete=models.SET_NULL, null=True, blank=True)
    items = models.ManyToManyField(Dishes)
    subtotal = models.FloatField()
    bill_date = models.DateTimeField(auto_now_add=True)
    items = models.ManyToManyField(Dishes, through='BillItem')

    def __str__(self):
        return f"{self.cashier_name} -{self.id}"

class BillItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dishes, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.FloatField()  # optional: save price at time of billing

    def get_total(self):
        return self.quantity * self.price

