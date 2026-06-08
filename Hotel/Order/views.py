from django.shortcuts import render, redirect, get_object_or_404
from .models import Dishes, Categories
from django.db.models import Q
from django.contrib import messages

def dishes(request):
    cashier_id = request.session.get('cashier_id')
    is_admin = request.user.is_authenticated and request.user.is_superuser
    if not cashier_id and not is_admin:
        messages.error(request, "Please login first.")
        return redirect('login')
        
    dishes = Dishes.objects.all()
    Category = Categories.objects.all()
    is_search = ''
    is_filter = ''
    ct = [{'category':'ALL','id':0}]
    for c in Category:
        ct.append({'category':c.category_name,'id':c.id})

    if request.method == "POST":
        if request.POST.get("search"):
            search = request.POST.get("search")
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

    dish_list = []
    for dish in dishes:
        dish_list.append({
            'id': dish.id,
            'name': dish.dish_name,
            'image': dish.dish_image,
            'price': dish.price,
            'category': dish.category.category_name,
            'is_available': dish.is_available,
            'receipe': dish.receipe
        })
    
    length = len(dish_list)
    data = {'categories':ct, 'dishes':dish_list,'is_search':is_search,'is_filter':is_filter, 'is_admin':is_admin}
                                                            
    return render(request, 'billing/dish.html', {'title':'Dish manager', 'data':data, 'length':length})


def add_dish(request):
    is_admin = request.user.is_authenticated and request.user.is_superuser
    if not is_admin:
        messages.error(request, "Only Administrators can add dishes.")
        return redirect('dishes')
        
    if request.method == "POST":
        dish_name = request.POST.get('dish_name')
        category_id = request.POST.get('category')
        price = request.POST.get('price')
        receipe = request.POST.get('receipe')
        optional = request.POST.get('optional')
        is_available = request.POST.get('is_available') == 'on'
        
        category = get_object_or_404(Categories, id=category_id)
        Dishes.objects.create(
            dish_name=dish_name,
            category=category,
            price=price,
            receipe=receipe,
            optional=optional,
            is_available=is_available
        )
        messages.success(request, "Dish added successfully!")
        return redirect('dishes')
        
    categories = Categories.objects.all()
    return render(request, 'order/dish_form.html', {'categories': categories, 'title': 'Add Dish', 'is_admin': is_admin})

def edit_dish(request, id):
    is_admin = request.user.is_authenticated and request.user.is_superuser
    if not is_admin:
        messages.error(request, "Only Administrators can edit dishes.")
        return redirect('dishes')
        
    dish = get_object_or_404(Dishes, id=id)
    if request.method == "POST":
        dish.dish_name = request.POST.get('dish_name')
        category_id = request.POST.get('category')
        dish.category = get_object_or_404(Categories, id=category_id)
        dish.price = request.POST.get('price')
        dish.receipe = request.POST.get('receipe')
        dish.optional = request.POST.get('optional')
        dish.is_available = request.POST.get('is_available') == 'on'
        dish.save()
        messages.success(request, "Dish updated successfully!")
        return redirect('dishes')
        
    categories = Categories.objects.all()
    return render(request, 'order/dish_form.html', {'dish': dish, 'categories': categories, 'title': 'Edit Dish', 'is_admin': is_admin})

def delete_dish(request, id):
    is_admin = request.user.is_authenticated and request.user.is_superuser
    if not is_admin:
        messages.error(request, "Only Administrators can delete dishes.")
        return redirect('dishes')
        
    dish = get_object_or_404(Dishes, id=id)
    if request.method == "POST":
        dish.delete()
        messages.success(request, "Dish deleted successfully!")
        return redirect('dishes')
    return render(request, 'order/dish_confirm_delete.html', {'dish': dish, 'is_admin': is_admin})

def add_category(request):
    is_admin = request.user.is_authenticated and request.user.is_superuser
    if not is_admin:
        messages.error(request, "Only Administrators can add categories.")
        return redirect('dishes')
        
    if request.method == "POST":
        category_name = request.POST.get('category_name')
        Categories.objects.create(category_name=category_name)
        messages.success(request, "Category added successfully!")
        return redirect('dishes')
    return render(request, 'order/category_form.html', {'is_admin': is_admin})
