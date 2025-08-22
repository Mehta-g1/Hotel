from django.shortcuts import render
from .models import *
from django.http import HttpResponse

def Home(request):
    cashier = Cashier.objects.all()[0].chashier_name
    data = f"<h2>This is Billing Page: {cashier} </h2>"
    return HttpResponse(data)

def Reports(request):
    return HttpResponse("Daily Reports")




