from django.urls import path
from . import views


# APIs Application Routes

urlpatterns = [
    path("test", views.test, name='test'),
]
