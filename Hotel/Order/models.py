from django.db import models


class Categories(models.Model):
    category_name = models.CharField(max_length=100)
    added_date = models.TimeField(auto_now_add=True)

    def __str__(self):
        return self.category_name


class Dishes(models.Model):
    ch = [("SG", "Signature"), ("SP", "Spicy"), ("SP", "Special")]
    category = models.ForeignKey(Categories, on_delete=models.CASCADE)
    dish_name = models.CharField(max_length=150)
    receipe = models.TextField(blank=True, null=True)
    price = models.IntegerField()
    optional = models.CharField(choices=ch, null=True, blank=True, max_length=100)
    is_available = models.BooleanField(default=True)
    dish_image = models.ImageField(upload_to="Images", null=True, blank=True)
    def __str__(self):
        return f"{self.dish_name} - {self.category},  Available:   {self.is_available}"



