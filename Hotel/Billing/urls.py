from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('',views.Home, name = "Billing_Home"),
    # path('checkout/',views.checkout, name = "checkout/"),
    path('dishes/',views.dishes, name="dishes"),
    # path('reports/',views.Reports, name="reports"),
    path('search-dish/',views.dishes, name="search-dish"),
    path('update-availability/',views.dishes, name="update-availability"),
    # path("login/", views.Login, name='login'),
    
]