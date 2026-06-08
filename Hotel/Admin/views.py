from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.hashers import make_password
from django.contrib.auth.decorators import user_passes_test
from Billing.models import Cashier, Bill, BillItem, ModificationRequest
from Order.models import Dishes, Categories
from django.db.models import Sum, Count, F
from django.db.models.functions import Coalesce
from django.utils import timezone
import datetime
from django.conf import settings

def is_super_admin(user):
    return user.is_superuser

@user_passes_test(is_super_admin, login_url='/admin/login/')
def admin_dashboard(request):
    total_revenue = Bill.objects.aggregate(total=Coalesce(Sum('subtotal'), 0.0) + Coalesce(Sum('taxAmt'), 0.0))['total']
    total_orders = Bill.objects.count()
    total_cashiers = Cashier.objects.count()
    
    context = {
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'total_cashiers': total_cashiers,
    }
    return render(request, 'admin_app/dashboard.html', context)

def admin_logout(request):
    logout(request)
    messages.success(request, "Super Admin logged out successfully.")
    return redirect('login')  # or wherever the initial login page is

@user_passes_test(is_super_admin, login_url='/admin/login/')
def manage_cashiers(request):
    cashiers = Cashier.objects.all()
    return render(request, 'admin_app/manage_cashiers.html', {'cashiers': cashiers})

@user_passes_test(is_super_admin, login_url='/admin/login/')
def cashier_profile(request, id):
    cashier = get_object_or_404(Cashier, id=id)
    bills = Bill.objects.filter(cashier_name=cashier).order_by('-bill_date')
    
    total_revenue = bills.aggregate(total=Coalesce(Sum('subtotal'), 0.0) + Coalesce(Sum('taxAmt'), 0.0))['total']
    total_orders = bills.count()
    
    bill_ids = bills.values_list('id', flat=True)
    top_items = BillItem.objects.filter(bill_id__in=bill_ids).values(
        'dish__dish_name', 'dish__category__category_name'
    ).annotate(total_qty=Sum('quantity')).order_by('-total_qty')[:5]
    
    context = {
        'cashier': cashier,
        'bills': bills,
        'total_revenue': total_revenue,
        'total_orders': total_orders,
        'top_items': top_items,
    }
    return render(request, 'admin_app/cashier_profile.html', context)

@user_passes_test(is_super_admin, login_url='/admin/login/')
def add_cashier(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        password = request.POST.get("password")
        
        Cashier.objects.create(
            chashier_name=name,
            email=email,
            password=make_password(password)
        )
        messages.success(request, "Cashier added successfully.")
        return redirect("manage_cashiers")
    return render(request, 'admin_app/cashier_form.html', {'title': 'Add New Cashier'})

@user_passes_test(is_super_admin, login_url='/admin/login/')
def edit_cashier(request, id):
    cashier = get_object_or_404(Cashier, id=id)
    if request.method == "POST":
        cashier.chashier_name = request.POST.get("name")
        cashier.email = request.POST.get("email")
        password = request.POST.get("password")
        if password:
            cashier.password = make_password(password)
        cashier.save()
        messages.success(request, "Cashier updated successfully.")
        return redirect("manage_cashiers")
    return render(request, 'admin_app/cashier_form.html', {'cashier': cashier, 'title': 'Edit Cashier'})

@user_passes_test(is_super_admin, login_url='/admin/login/')
def delete_cashier(request, id):
    cashier = get_object_or_404(Cashier, id=id)
    if request.method == "POST":
        cashier.delete()
        messages.success(request, "Cashier deleted successfully.")
        return redirect("manage_cashiers")
    return render(request, 'admin_app/confirm_delete.html', {'cashier': cashier})

@user_passes_test(is_super_admin, login_url='/admin/login/')
def manage_bills(request):
    bills = Bill.objects.all().order_by('-bill_date')
    pending_requests = ModificationRequest.objects.filter(status='Pending').order_by('-created_at')
    return render(request, 'admin_app/manage_bills.html', {'bills': bills, 'pending_requests': pending_requests})

@user_passes_test(is_super_admin, login_url='/admin/login/')
def delete_bill(request, id):
    bill = get_object_or_404(Bill, id=id)
    if request.method == "POST":
        bill.delete()
        messages.success(request, "Bill deleted/canceled successfully.")
        return redirect("manage_bills")
    return render(request, 'admin_app/confirm_delete_bill.html', {'bill': bill})

from Billing.models import Cashier, Bill, BillItem, ModificationRequest

@user_passes_test(is_super_admin, login_url='/admin/login/')
def handle_request(request, req_id, action):
    req = get_object_or_404(ModificationRequest, id=req_id)
    if action == 'approve':
        req.status = 'Approved'
        req.save()
        messages.success(request, f"Request to {req.request_type} Bill #{req.bill.id} Approved.")
        if req.request_type == 'Delete':
            req.bill.delete()
            return redirect('manage_bills')
        else:
            return redirect('edit_bill', id=req.bill.id)
    elif action == 'reject':
        req.status = 'Rejected'
        req.save()
        messages.error(request, f"Request to {req.request_type} Bill #{req.bill.id} Rejected.")
    return redirect('manage_bills')

@user_passes_test(is_super_admin, login_url='/admin/login/')
def edit_bill(request, id):
    bill = get_object_or_404(Bill, id=id)
    if request.method == "POST":
        if 'add_dish' in request.POST:
            dish_id = request.POST.get('dish_id')
            qty = int(request.POST.get('qty', 1))
            if dish_id and qty > 0:
                dish = get_object_or_404(Dishes, id=dish_id)
                bill_item, created = BillItem.objects.get_or_create(
                    bill=bill, dish=dish, defaults={'quantity': qty, 'price': dish.price}
                )
                if not created:
                    bill_item.quantity += qty
                    bill_item.save()
                messages.success(request, f"Added {qty}x {dish.dish_name}.")
                
        elif 'remove_item' in request.POST:
            item_id = request.POST.get('item_id')
            item = get_object_or_404(BillItem, id=item_id, bill=bill)
            item.delete()
            messages.success(request, "Item removed.")
            
        subtotal = sum([item.price * item.quantity for item in bill.billitem_set.all()])
        bill.subtotal = subtotal
        bill.taxAmt = subtotal * settings.HOTEL_TAX_RATE
        bill.save()
        return redirect('edit_bill', id=bill.id)
        
    dishes = Dishes.objects.filter(is_available=True)
    return render(request, 'admin_app/edit_bill.html', {'bill': bill, 'dishes': dishes})

@user_passes_test(is_super_admin, login_url='/admin/login/')
def analytics(request):
    bills = Bill.objects.all()
    filter_type = request.GET.get('filter', 'all')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    specific_date = request.GET.get('date')

    today = timezone.now().date()
    
    if filter_type == 'today':
        bills = bills.filter(bill_date__date=today)
    elif filter_type == 'week':
        start_of_week = today - datetime.timedelta(days=today.weekday())
        bills = bills.filter(bill_date__date__gte=start_of_week)
    elif filter_type == 'month':
        bills = bills.filter(bill_date__year=today.year, bill_date__month=today.month)
    elif filter_type == 'year':
        bills = bills.filter(bill_date__year=today.year)
    elif specific_date:
        bills = bills.filter(bill_date__date=specific_date)
    elif start_date and end_date:
        bills = bills.filter(bill_date__date__gte=start_date, bill_date__date__lte=end_date)
        
    bill_ids = bills.values_list('id', flat=True)
    bill_items = BillItem.objects.filter(bill_id__in=bill_ids)
    
    # 1. Cashier Performance
    cashier_perf_qs = bills.values('cashier_name__chashier_name').annotate(
        total_rev=Coalesce(Sum('subtotal'), 0.0) + Coalesce(Sum('taxAmt'), 0.0)
    )
    
    cashier_perf = {}
    for c in cashier_perf_qs:
        name = c['cashier_name__chashier_name'] or "Unknown"
        cashier_perf[name] = c['total_rev']
        
    best_cashier = max(cashier_perf, key=cashier_perf.get) if cashier_perf else "None"
    
    # 2. Item Performance
    items = bill_items.values('dish__dish_name', 'dish__category__category_name').annotate(
        total_qty=Sum('quantity')
    ).order_by('-total_qty')
    most_selling = items.first() if items else None
    least_selling = items.last() if items else None
    
    # 3. Category Wise
    categories = bill_items.values('dish__category__category_name').annotate(
        total_qty=Sum('quantity')
    ).order_by('-total_qty')
    
    # 4. Cashier-Item specific breakdown (Which cashier is selling what)
    cashier_item_breakdown = bill_items.values(
        'bill__cashier_name__chashier_name', 'dish__dish_name'
    ).annotate(
        total_qty=Sum('quantity'),
        total_rev=Sum(F('quantity') * F('price'))
    ).order_by('bill__cashier_name__chashier_name', '-total_qty')

    context = {
        'cashier_perf': cashier_perf,
        'best_cashier': best_cashier,
        'most_selling': most_selling,
        'least_selling': least_selling,
        'categories': categories,
        'filter_type': filter_type,
        'start_date': start_date,
        'end_date': end_date,
        'specific_date': specific_date,
        'cashier_item_breakdown': cashier_item_breakdown,
    }
    return render(request, 'admin_app/analytics.html', context)
