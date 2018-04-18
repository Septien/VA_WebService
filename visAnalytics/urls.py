from django.urls import path

from . import views

urlpatterns = [
    #https://stackoverflow.com/questions/3711349/django-and-query-string-parameters
    # The main entry point
    path('', views.index),
    # For requesting a script
    path('script', views.getScript),
    # For teh ||-coord
    path(r'pcoordinates', views.parallelCoordinatesHandler),
    # For the histogram
    path(r"histogram", views.HistogramHandler),
]
