from django.urls import path, include
from . import views



urlpatterns = [
    path('',views.Home, name='Home' ),
    path('contact/', views.Contact, name='Contact'),
    path('about/',views.About, name="About")
]