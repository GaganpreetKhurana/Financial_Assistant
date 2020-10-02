from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import *

app_name = "api"
urlpatterns = [
    path("transactions", TransactionList.as_view(), name="transactions"),
    path("register", RegisterUserView.as_view(), name="register"),
    path("change_password", ChangePasswordView.as_view(), name="change_password"),
    path("user", ViewUserView.as_view(), name="user"),
    path("", DetailsView.as_view(), name="details"),
]
urlpatterns = format_suffix_patterns(urlpatterns)
