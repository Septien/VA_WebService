from django.urls import path

from . import views

urlpatterns = [
    # For the histogram
    path("hitogram/$", view.HistogramHandler),
]