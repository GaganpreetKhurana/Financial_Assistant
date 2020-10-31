from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import *

app_name = "api"
urlpatterns = [
    # URL's Related to USER
    path("register", RegisterUserView.as_view(), name="register"),  # Register new USER
    path("user", RetrieveUserDetailsView.as_view(), name="user"),  # Retrieve USER details
    path("edit_user", EditUserDetailsView.as_view(), name="edit_user"),  # Edit USER details
    path("change_password", ChangePasswordView.as_view(), name="change_password"),  # Change Password
    path("delete_user/", DeleteUser.as_view(), name="delete_user"),  # Delete USER

    # URL's for Retrieving Transactions
    path("transactions", TransactionList.as_view(), name="transactions"),
    path("transactions/<int:id>/", TransactionListID.as_view(), name="transactionsID"),
    path("transactions/date/<str:date>/", TransactionListDay.as_view(), name="transactions_date"),
    path("transactions/month/<str:month>/", TransactionListMonth.as_view(), name="transactions_month"),
    path("transactions/year/<str:year>/", TransactionListYear.as_view(), name="transactions_year"),
    path("transactions/year/month/<str:year>/<str:month>/", TransactionListYearMonth.as_view(),
         name="transactions_month_year"),
    path("transactions/year/date/<str:year>/<str:date>/", TransactionListYearDay.as_view(),
         name="transactions_date_year"),
    path("transactions/month/date/<str:month>/<str:date>/", TransactionListMonthDay.as_view(),
         name="transactions_month_date"),
    path("transactions/<str:year>/<str:month>/<str:date>/", TransactionListDayMonthYear.as_view(),
         name="transactions_date_month_year"),
    path(
        "transactions/average/"
        + "<int:start_date>/<int:start_month>/<int:start_year>/"
        + "<int:end_date>/<int:end_month>/<int:end_year>/",
        TransactionAverage.as_view(),
        name="transactions_average"),

    # URL's to Create/Update/Delete Transactions
    path("create_transaction", CreateTransaction.as_view(), name="create_transactions"),  # Create
    path("update_transaction/<int:pk>/", UpdateTransaction.as_view(), name="update_transactions"),  # Update
    path("delete_transaction/<int:pk>/", DeleteTransaction.as_view(), name="delete_transactions"),  # Delete

    # URL's related to Details (Monthly Statements)
    path("details/month/<str:month>/", DetailsViewMonth.as_view(), name="details"),
    path("details/year/<str:year>/", DetailsViewYear.as_view(), name="details"),
    path("details/<str:year>/<str:month>/", DetailsViewYearMonth.as_view(), name="details"),
    path("detailslist", DetailsView.as_view(), name="details"),
]
urlpatterns = format_suffix_patterns(urlpatterns)
