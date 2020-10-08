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
    # path("transactions/<int:id>/", TransactionListID.as_view(), name="transactionsID"),
    path("transactions/<str:month>/", TransactionListMonth.as_view(), name="transactions_month"),
    path("transactions/<int:year>/", TransactionList.as_view(), name="transactions_year"),
    path("transactions/<int:year>/<int:month>/", TransactionList.as_view(), name="transactions_month_year"),
    path("transactions/<int:year>/<int:month>/<int:date>/", TransactionList.as_view(), name="transactions_month_year"),

    path("create_transaction", CreateTransaction.as_view(), name="create_transactions"),
    path("update_transaction/<int:pk>/", UpdateTransaction.as_view(), name="update_transactions"),
    path("delete_transaction/<int:pk>/", DeleteTransaction.as_view(), name="delete_transactions"),

    path("details/<int:month>/", DetailsView.as_view(), name="details"),
    path("details/<int:year>/", DetailsView.as_view(), name="details"),
    path("details/<int:year>/<int:month>/", DetailsView.as_view(), name="details"),
    path("", DetailsView.as_view(), name="details"),
]
urlpatterns = format_suffix_patterns(urlpatterns)
