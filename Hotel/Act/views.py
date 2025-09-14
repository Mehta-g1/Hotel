from django.shortcuts import render, redirect
from django.shortcuts import HttpResponse
from Billing.models import Cashier
# Create your views here.
def About(request):
    return HttpResponse("<h1>About Page </h1>")


def Contact(request):
    return HttpResponse("<h1>Contact Page </h1>")



def Home(request):
    cashier_id = request.session.get('cashier_id')
    if not cashier_id:
        return redirect('login')
    cashier = Cashier.objects.get(id=cashier_id)

    return render(request, 'Act/index.html', {'cashier':cashier.chashier_name})