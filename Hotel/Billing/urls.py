from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('',views.Home,  name='billing'),
    path('checkout/',views.checkout, name = "checkout"),
    path('reports/',views.Reports, name="reports"),
    path('logout/', views.logout, name='logout'),
    path('request_modification/<int:bill_id>/', views.request_modification, name='request_modification'),
]