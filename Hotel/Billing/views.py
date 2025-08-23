from django.shortcuts import render
from .models import *
from django.http import HttpResponse

def Home(request):
    cashier = Cashier.objects.all()[0].chashier_name
    dishes = ['Maggie', 'Pav Bhaji', 'Jalebi', 'Burger']
    return render(request, 'order.html',{'cashier':cashier,'dishes':dishes})

def Reports(request):
    return HttpResponse("Daily Reports")




