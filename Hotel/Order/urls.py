from django.urls import path
from . import views

urlpatterns = [
    path('dishes/', views.dishes, name='dishes'),
    path('dishes/add/', views.add_dish, name='add_dish'),
    path('dishes/<int:id>/edit/', views.edit_dish, name='edit_dish'),
    path('dishes/<int:id>/delete/', views.delete_dish, name='delete_dish'),
    path('categories/add/', views.add_category, name='add_category'),
]
