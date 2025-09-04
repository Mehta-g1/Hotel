from django.shortcuts import render, redirect
from .models import *
from django.http import HttpResponse
from Order.models import *


def Home(request):
    cashier = Cashier.objects.all()[0].chashier_name
    dishes = []
    d = Dishes.objects.all()
    # print(bill_no)
    for e in d:
        if e.is_available:
            id = e.id
            name = e.dish_name
            description = e.receipe
            price = e.price
            category = e.category.category_name
            dish = {'id':id,'name':name +" -"+category,'description':description,'price':price, 'category':category }
            dishes.append(dish)

    return render(request, 'billing/order.html',{'cashier':cashier,'dishes':dishes})

def Reports(request):
    return HttpResponse("Daily Reports")

def checkout(request):
    if request.method == "POST":
        billData=[]
        for i in range(1,50):
            id = request.POST.get("id["+str(i)+"]")
            if id:
                qty = request.POST.get("item_qty["+str(i)+"]")
                dish = Dishes.objects.get(id=id)
                # {'dish_name':dish.dish_name,'qty':qty,}
                dish.id
                dish.price*int(qty)
                
            else:
                break
    return render(request, 'billing/order.html',{'GenerateBill':True})



def dishes(request):
    dishes = Dishes.objects.all()

    # for dish in dishes:
    #     print(dish.dish_name)
    #     print(dish.price)
    #     print('--------------')

    return render(request, 'billing/dish.html', {'title':'Dish manager'})
