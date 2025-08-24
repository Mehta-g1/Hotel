from django.shortcuts import render
from .models import *
from django.http import HttpResponse
from Order.models import *


def Home(request):
    cashier = Cashier.objects.all()[0].chashier_name
    dishes = []
    d = Dishes.objects.all()
    for e in d:
        if e.is_available:
            id = e.id
            name = e.dish_name
            description = e.receipe
            price = e.price
            category = e.category.category_name
            dish = {'id':id,'name':name +" -"+category,'description':description,'price':price, 'category':category }
            dishes.append(dish)
        
    return render(request, 'order.html',{'cashier':cashier,'dishes':dishes})

def Reports(request):
    return HttpResponse("Daily Reports")

def PrintBill(request, bill_no):
    Bill.objects.create()
    id=''
    bill=""
    return render(request, 'order.html',{'GenerateBill':True, 'billID':id,'bill':bill})




