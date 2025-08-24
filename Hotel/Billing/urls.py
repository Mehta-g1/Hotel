from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('',views.Home, name = "Billing_Home"),
    path('bill/<int:id>',views.PrintBill, name = "Billing")

]