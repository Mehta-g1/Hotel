from django.db import models
from Order.models import Dishes
# Create your models here.
class Cashier(models.Model):
    ch = [("Day","Day"), ("Night", "Night")]
    chashier_name = models.CharField(max_length=100)
    shift = models.CharField(choices=ch, max_length=50)
    email = models.EmailField(max_length=150, unique=True,null=False,blank=False )
    password = models.CharField(max_length=128, null=False, blank=False)

    def __str__(self):
        return f"{self.chashier_name}  - {self.email}"

class Bill(models.Model):

    cashier_name = models.ForeignKey(Cashier, on_delete=models.SET_NULL, null=True, blank=True)
    subtotal = models.FloatField()
    taxAmt=models.FloatField(null=True , blank=True)
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


class ModificationRequest(models.Model):
    REQ_TYPES = [('Modify', 'Modify'), ('Delete', 'Delete')]
    STATUS_CHOICES = [('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')]
    
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE)
    cashier = models.ForeignKey(Cashier, on_delete=models.CASCADE)
    request_type = models.CharField(max_length=20, choices=REQ_TYPES)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.request_type} Request for Bill #{self.bill.id} - {self.status}"
