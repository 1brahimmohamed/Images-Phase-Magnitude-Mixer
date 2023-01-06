"""
 *
 * File Name  : urls.py
 * Description: Declaration of project endpoints
 * Author    : Ibrahim Mohamed
 *
 """
from django.urls import path
from . import views


# APIs Application Routes

urlpatterns = [
    path("home", views.home, name="home"),
    path("generate-result", views.generate_result, name='result'),
    path("upload", views.upload, name='upload'),
]
