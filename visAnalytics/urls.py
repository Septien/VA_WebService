from django.urls import path

from . import views

urlpatterns = [
    #https://stackoverflow.com/questions/3711349/django-and-query-string-parameters
    # For the histogram
    path(r"histogram", views.HistogramHandler),
]