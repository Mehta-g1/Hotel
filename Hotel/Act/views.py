from django.shortcuts import render, redirect
from django.shortcuts import HttpResponse
from Billing.models import Cashier
# Create your views here.
def About(request):
    is_admin = request.user.is_authenticated and request.user.is_superuser
    return render(request, 'act/about.html', {'is_admin': is_admin})

def Contact(request):
    is_admin = request.user.is_authenticated and request.user.is_superuser
    return render(request, 'act/contact.html', {'is_admin': is_admin})



def Home(request):
    return render(request, 'Act/index.html')