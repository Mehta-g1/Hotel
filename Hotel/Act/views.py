from django.shortcuts import render
from django.shortcuts import HttpResponse
# Create your views here.
def About(request):
    return HttpResponse("<h1>About Page </h1>")


def Contact(request):
    return HttpResponse("<h1>Contact Page </h1>")



def Home(request):
    return render(request, 'Act/index.html')