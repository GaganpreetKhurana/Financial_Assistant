from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import *

app_name = "api"
urlpatterns = [
    path("transactions", TransactionList.as_view(), name="transactions"),
    path("register",RegisteredUserView.as_view(),name="register"),
    path("", DetailList.as_view(), name="details"),
]
urlpatterns = format_suffix_patterns(urlpatterns)
