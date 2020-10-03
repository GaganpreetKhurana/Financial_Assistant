from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import *

app_name = "api"
urlpatterns = [
    path("register", RegisterUserView.as_view(), name="register"),
    path("user", RetrieveUserDetailsView.as_view(), name="user"),
    path("edit_user", EditUserDetailsView.as_view(), name="edit_user"),
    path("change_password", ChangePasswordView.as_view(), name="change_password"),
    path("delete_user/", DeleteUser.as_view(), name="delete_user"),

    path("transactions", TransactionList.as_view(), name="transactions"),
    path("create_transaction", CreateTransaction.as_view(), name="create_transactions"),
    path("update_transaction/<int:pk>/", UpdateTransaction.as_view(), name="update_transactions"),
    path("delete_transaction/<int:pk>/", DeleteTransaction.as_view(), name="delete_transactions"),

    path("", DetailsView.as_view(), name="details"),
]
urlpatterns = format_suffix_patterns(urlpatterns)
