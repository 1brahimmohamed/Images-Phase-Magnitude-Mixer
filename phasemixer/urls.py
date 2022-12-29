from django.urls import path
from . import views


# APIs Application Routes

urlpatterns = [
    path("home", views.home, name="home"),
    path("test", views.test, name='test'),
    path("upload", views.upload, name='upload'),
]
