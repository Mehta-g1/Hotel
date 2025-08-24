from django.shortcuts import render
from .models import *
from django.http import HttpResponse
from Order.models import *
def Home(request):
    cashier = Cashier.objects.all()[0].chashier_name
    # dishes = [
    #     { 'id': 1, 'name': "Paneer Butter Masala", 'description': "Creamy paneer curry", 'price': 250, 'category': "Main Course" },
    #     { 'id': 2, 'name': "Veg Biryani", 'description': "Fragrant rice with veggies", 'price': 180, 'category': "Rice" },
    #     { 'id': 3, 'name': "Chicken Biryani", 'description': "Hyderabadi style chicken rice", 'price': 220, 'category': "Rice" },
    #     { 'id': 4, 'name': "Dal Tadka", 'description': "Yellow dal with tadka", 'price': 150, 'category': "Main Course" },
    #     { 'id': 5, 'name': "Chole Bhature", 'description': "Spicy chana with bhature", 'price': 120, 'category': "Snacks" }
    # ]
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




