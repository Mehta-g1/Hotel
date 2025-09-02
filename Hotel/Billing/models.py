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
    subtotal = models.FloatField()
    bill_date = models.DateTimeField(auto_now_add=True)
    items = models.ManyToManyField(Dishes, through='BillItem')

    def __str__(self):
        return f" {self.id}  Cashier :{self.cashier_name.chashier_name}  Total:{self.subtotal}"

class BillItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    dish = models.ForeignKey(Dishes, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.FloatField() 

    def get_total(self):
        return self.quantity * self.price
    
    def __str__(self):
        return f"{self.dish.dish_name}  -Quantity: {self.quantity}"

