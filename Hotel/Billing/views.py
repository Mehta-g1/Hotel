from django.shortcuts import render, redirect
from .models import *
from django.http import HttpResponse
from Order.models import *
from django.db.models import Q
from django.contrib import messages

def Home(request):
    cashier_id =  request.session.get('cashier_id')
    if not cashier_id:
        messages.error(request,"Something went wrong ❌")
        return redirect('login')
    cashier = Cashier.objects.get(id = cashier_id)
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
    messages.success(request, "Login Success !")
    return render(request, 'billing/order.html',{'cashier':cashier.chashier_name,'dishes':dishes})

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
    Category = Categories.objects.all()
    is_search = ''
    is_filter = ''
    ct = [{'category':'ALL','id':0}]
    for c in Category:
        ct.append({'category':c.category_name,'id':c.id})

    if request.method == "POST":
        print("\n\n\nFilter button pressed\n\n\n")
        
        if request.POST.get("search"):
            search = request.POST.get("search")
            print(f"\n\n\nSearch Parameter: {search}\n\n\n")
            dishes = Dishes.objects.filter(
                Q(dish_name__icontains=search) |
                Q(category__category_name__icontains=search) |
                Q(id__icontains=search)
            )
            is_search = search

        elif request.POST.get("category"):
            category = request.POST.get("category")
            if category == '0':
                dishes = Dishes.objects.all()
            else:
                dishes = Dishes.objects.filter(category__id=category)
                is_filter = True
        else:
            print("No Search Parameter")
        # elif request.POST.get("Available"):
        #     dishes = Dishes.objects.filter(is_available=True)
        #     return redirect('/dishes/')
        # elif request.POST.get("Unavailable"):
        #     dishes = Dishes.objects.filter(is_available=False)
        #     return redirect('/dishes/')

        
    dish_list = []
    for dish in dishes:
        id = dish.id
        name = dish.dish_name
        image = dish.dish_image
        price = dish.price
        receipe = dish.receipe
        category = dish.category.category_name
        is_available = dish.is_available
        dish_list.append({'id':id,'name':name,'image':image,'price':price,'category':category,'is_available':is_available, 'receipe':receipe})
    # print(dish_list)
    length = len(dish_list)
    
    data = {'categories':ct, 'dishes':dish_list,'is_search':is_search,'is_filter':is_filter}
                                                            
    return render(request, 'billing/dish.html', {'title':'Dish manager', 'data':data, 'length':length})



def Login(request):
    
    chashier_id = request.session.get('cashier_id')
    if chashier_id:
        del request.session['cashier_id']
    return render(request, 'billing/login.html')


def logining(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        cashier = Cashier.objects.filter(email=email).first()

        if cashier and cashier.password == password:   # (better: use hashing)
            print("Login success")
            request.session["cashier_id"] = cashier.id
            return redirect('/billing/')
        else:
            print("Invalid credentials")
            messages.error(request, "Invalid creadential !")
            return redirect('login')
    return render(request, 'billing/login.html')

def logout(request):
    cashier_id = request.session.get('cashier_id')
    if cashier_id:
        del request.session['cashier_id']
        messages.success(request, "Logged out successfully !")
        return redirect('login')
    messages.error(request, "Something went wrong !")
    return redirect('login')



