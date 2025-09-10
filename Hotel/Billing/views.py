from django.shortcuts import render, redirect
from .models import *
from django.http import HttpResponse
from Order.models import *
from django.db.models import Q

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
    if request.method == "POST":
        if request.POST.get("search"):
            search = request.POST.get("search")
            dishes = Dishes.objects.filter(
                Q(dish_name__icontains=search) | Q(category__icontains=search | Q(id__icontains=search))
            )
            return redirect('/dishes/')
        
        elif request.POST.get("category"):
            category = request.POST.get("category")
            dishes = Dishes.objects.filter(category__category_name__icontains=category)
            return redirect('/dishes/')
        elif request.POST.get("Available"):
            dishes = Dishes.objects.filter(is_available=True)
            return redirect('/dishes/')
        elif request.POST.get("Unavailable"):
            dishes = Dishes.objects.filter(is_available=False)
            return redirect('/dishes/')

        
    dish_list = []
    for dish in dishes:
        id = dish.id
        name = dish.dish_name
        image = dish.dish_image
        print(image)
        price = dish.price
        receipe = dish.receipe
        category = dish.category.category_name
        is_available = dish.is_available
        dish_list.append({'id':id,'name':name,'image':image,'price':price,'category':category,'is_available':is_available, 'receipe':receipe})
    # print(dish_list)
    length = len(dish_list)

    return render(request, 'billing/dish.html', {'title':'Dish manager', 'dishes':dish_list, 'length':length})

