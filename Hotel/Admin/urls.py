from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('logout/', views.admin_logout, name='admin_logout'),
    path('cashiers/', views.manage_cashiers, name='manage_cashiers'),
    path('cashiers/<int:id>/', views.cashier_profile, name='cashier_profile'),
    path('cashiers/add/', views.add_cashier, name='add_cashier'),
    path('cashiers/edit/<int:id>/', views.edit_cashier, name='edit_cashier'),
    path('cashiers/delete/<int:id>/', views.delete_cashier, name='delete_cashier'),
    path('analytics/', views.analytics, name='analytics'),
    path('bills/', views.manage_bills, name='manage_bills'),
    path('bills/edit/<int:id>/', views.edit_bill, name='edit_bill'),
    path('bills/delete/<int:id>/', views.delete_bill, name='delete_bill'),
    path('requests/<int:req_id>/<str:action>/', views.handle_request, name='handle_request'),
]
