from django.shortcuts import render, redirect
from .models import *
from django.http import HttpResponse
from Order.models import *
from django.db.models import Q
from django.contrib import messages
from django.conf import settings

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
    return render(request, 'billing/order.html',{'cashier':cashier.chashier_name, 'cashier_id': cashier.id, 'dishes':dishes})

from django.contrib.auth.hashers import check_password, make_password

def Reports(request):
    cashier_id = request.session.get('cashier_id')
    if not cashier_id:
        messages.error(request, "Please login first.")
        return redirect('login')
        
    cashier = Cashier.objects.get(id=cashier_id)
    bills = Bill.objects.filter(cashier_name=cashier)
    
    # Filters
    filter_type = request.GET.get('filter', 'today')
    specific_date = request.GET.get('date', '')
    
    from django.utils import timezone
    from datetime import timedelta, datetime
    
    now = timezone.now()
    
    if specific_date:
        try:
            dt = datetime.strptime(specific_date, '%Y-%m-%d').date()
            bills = bills.filter(bill_date__date=dt)
            filter_type = 'custom'
        except ValueError:
            pass
    elif filter_type == 'today':
        bills = bills.filter(bill_date__date=now.date())
    elif filter_type == 'week':
        start_of_week = now - timedelta(days=now.weekday())
        bills = bills.filter(bill_date__gte=start_of_week)
    elif filter_type == 'month':
        bills = bills.filter(bill_date__year=now.year, bill_date__month=now.month)
    elif filter_type == 'all':
        pass
        
    bills = bills.order_by('-bill_date')
    
    total_revenue = 0
    for b in bills:
        total_revenue += float(b.subtotal) + float(b.taxAmt or 0)
        
    context = {
        'cashier': cashier.chashier_name,
        'bills': bills,
        'total_revenue': total_revenue,
        'total_orders': bills.count(),
        'filter_type': filter_type,
        'specific_date': specific_date
    }
    return render(request, 'billing/reports.html', context)


def checkout(request):
    if request.method == "POST":
        cashier_id = request.session.get('cashier_id')
        if not cashier_id:
            messages.error(request, "Please login first.")
            return redirect('login')
        
        try:
            cashier = Cashier.objects.get(id=cashier_id)
        except Cashier.DoesNotExist:
            messages.error(request, "Cashier not found.")
            return redirect('login')
            
        subtotal = 0.0
        bill_items = []
        
        # Dynamically find all submitted item indices
        indices = []
        for key in request.POST.keys():
            if key.startswith("id[") and key.endswith("]"):
                idx = key[3:-1]
                if idx.isdigit():
                    indices.append(int(idx))
                    
        for i in indices:
            id = request.POST.get(f"id[{i}]")
            if id:
                qty_str = request.POST.get(f"item_qty[{i}]")
                if not qty_str or int(qty_str) <= 0:
                    continue
                    
                qty = int(qty_str)
                try:
                    dish = Dishes.objects.get(id=id)
                except Dishes.DoesNotExist:
                    continue
                    
                price = dish.price
                item_total = price * qty
                subtotal += item_total
                
                bill_items.append({
                    'dish': dish,
                    'quantity': qty,
                    'price': price
                })
                
        if subtotal > 0:
            taxAmt = subtotal * settings.HOTEL_TAX_RATE
            total = subtotal + taxAmt
            
            bill = Bill.objects.create(
                cashier_name=cashier,
                subtotal=subtotal,
                taxAmt=taxAmt
            )
            
            for item in bill_items:
                BillItem.objects.create(
                    bill=bill,
                    dish=item['dish'],
                    quantity=item['quantity'],
                    price=item['price']
                )
                
            messages.success(request, f"Bill #{bill.id} generated successfully!")
            context = {
                'bill': bill,
                'items': bill.billitem_set.all(),
                'total': total
            }
            return render(request, 'billing/receipt.html', context)
        else:
            messages.warning(request, "No items selected for checkout.")
            return redirect('billing')
            
    return redirect('billing')


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
    
    length = len(dish_list)
    
    data = {'categories':ct, 'dishes':dish_list,'is_search':is_search,'is_filter':is_filter}
                                                            
    return render(request, 'billing/dish.html', {'title':'Dish manager', 'data':data, 'length':length})


def Login(request):
    chashier_id = request.session.get('cashier_id')
    if chashier_id:
        del request.session['cashier_id']
        
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        cashier = Cashier.objects.filter(email=email).first()

        if cashier:
            if check_password(password, cashier.password) or cashier.password == password:
                if cashier.password == password:
                    cashier.password = make_password(password)
                    cashier.save()
                    
                request.session["cashier_id"] = cashier.id
                return redirect('billing')
            else:
                messages.error(request, "Invalid credentials!")
                return redirect('login')
        else:
            messages.error(request, "Invalid credentials!")
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

def request_modification(request, bill_id):
    cashier_id = request.session.get('cashier_id')
    if not cashier_id:
        return redirect('login')
        
    if request.method == "POST":
        req_type = request.POST.get('request_type')
        reason = request.POST.get('reason')
        try:
            bill = Bill.objects.get(id=bill_id, cashier_name_id=cashier_id)
            ModificationRequest.objects.create(
                bill=bill,
                cashier_id=cashier_id,
                request_type=req_type,
                reason=reason
            )
            messages.success(request, "Request sent to Admin successfully.")
        except Bill.DoesNotExist:
            messages.error(request, "Invalid bill.")
            
    return redirect('reports')
