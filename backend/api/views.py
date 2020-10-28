import requests
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Detail, Transaction
from .serializers import UserDetailsSerializer, TransactionSerializer, RegisterSerializer, FinancialDetailsSerializer, \
    ChangePasswordSerializer, CreateTransactionSerializer, UpdateTransactionSerializer, DestroyTransactionSerializer


# Create your views here.


class RegisterUserView(CreateAPIView):
    """
    View for registering new user
    Method:POST
    """
    serializer_class = RegisterSerializer
    model = User
    permission_classes = []


class RetrieveUserDetailsView(ListAPIView):
    """
    View for retrieving details for user
    Details: username,first_name,last_name,email
    """
    serializer_class = UserDetailsSerializer
    permission_classes = [IsAuthenticated]
    model = User

    def get_queryset(self):
        """
        Function to return user details
        Method:GET
        :return:     Details: username,first_name,last_name,email
        """
        return User.objects.filter(id=self.request.user.id)


class ChangePasswordView(UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        """
        Function to update password
        Method:PATCH
        :param request:
        :param args:
        :param kwargs:
        :return: Response-Message,Code
        """
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():  # Check for valid data
            # Check old password
            if not self.request.user.check_password(request.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]},
                                status=status.HTTP_400_BAD_REQUEST)  # Response for invalid old_password

            # Validate Password
            try:
                validate_password(request.data.get("new_password"), request.user)
            except ValidationError as error:
                message = "Invalid Password. "
                for error_object in error.error_list:
                    if error_object.code == "password_too_short":
                        message += error_object.message % {'min_length': error_object.params['min_length']}
                    elif error_object.code == "password_too_similar":
                        message += error_object.message % {'verbose_name': error_object.params['verbose_name']}
                    else:
                        message += error_object.message
                response = {
                    'status': 'failed',
                    'code': status.HTTP_400_BAD_REQUEST,
                    'message': message,
                    'data': []
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)  # Response for invalid password

            # Check if new_password and password_confirm match
            if request.data.get("new_password") \
                    != request.data.get("password_confirm"):
                response = {
                    'status': 'failed',
                    'code': status.HTTP_400_BAD_REQUEST,
                    'message': 'Password do not Match',
                    'data': []
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)  # Response for Password do not match

            # Set password and save user
            request.user.set_password(request.data.get("new_password"))
            request.user.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response, status=status.HTTP_200_OK)  # Response for successful operation

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Response for invalid Serializer


class EditUserDetailsView(UpdateAPIView):
    """
    View for editing details of user
    """
    serializer_class = UserDetailsSerializer
    model = User
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        """
        Function to update user details
        Method:PATCH
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():  # Check for valid data
            # Try to change the details
            try:
                # USER wants to change First Name
                if request.data.get("first_name") is not None and request.data.get("first_name") != "":
                    request.user.first_name = request.data.get("first_name")
                # USER wants to change Last Name
                if request.data.get("last_name") is not None and request.data.get("last_name") != "":
                    request.user.last_name = request.data.get("last_name")
                # USER wants to change Username
                if request.data.get("username") is not None and request.data.get("username") != "":
                    request.user.username = request.data.get("username")
                # USER wants to change Email
                if request.data.get("email") is not None and request.data.get("email") != "":
                    # Validate Email
                    try:
                        validate_email(request.data.get("email"))
                    except ValidationError as error:
                        message = "Invalid Email."
                        for error_object in error.error_list:
                            message += error_object.message
                        response = {
                            'status': 'failed',
                            'code': status.HTTP_400_BAD_REQUEST,
                            'message': message,
                            'data': []
                        }
                        return Response(response, status=status.HTTP_400_BAD_REQUEST)  # Invalid Email Response
                    request.user.email = request.data.get("email")

                # Save USER details
                request.user.save()

                # Get refreshed jwt token
                refresh_token = requests.post(url="http://127.0.0.1:8000/api/token/refresh/",
                                              data={"token": request.auth})
                # Check if refreshing token failed
                if refresh_token.status_code != 200:
                    response = {
                        'status': 'failed',
                        'code': status.HTTP_400_BAD_REQUEST,
                        'message': 'Details saved but Unable to get new token.Try logging in again!',
                    }
                    return Response(response, status=status.HTTP_400_BAD_REQUEST)  # Response for failure to get new
                    # token

            except():
                response = {
                    'status': 'failed',
                    'code': status.HTTP_400_BAD_REQUEST,
                    'message': 'Unable to change',
                }
                return Response(response, status=status.HTTP_400_BAD_REQUEST)  # Response for failure to change details
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Details Updated',
            }
            response.update(refresh_token.json())  # Add token to response
            return Response(response, status=status.HTTP_200_OK)  # Response for successful operation

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Response for invalid serializer


class DetailsView(ListAPIView):
    """
    View for retrieving all details(Monthly statements) of user
    Method : GET
    """
    serializer_class = FinancialDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Function for retrieving all details(Monthly statements) of user
        and their aggregate

        :return:
        """
        return get_sum_detail(
            Detail.objects.filter(user=self.request.user), self.request)


class TransactionList(ListAPIView):
    """
    View for retrieving all Transactions of user
    Method : GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        """
        Function for retrieving all Transactions of user

        :return:
        """
        return Transaction.objects.filter(user=self.request.user)


class TransactionListID(ListAPIView):
    """
    View for retrieving Transactions according to ID of user
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        """
        Function for retrieving Transactions according to ID of user
        :return:
        """
        return Transaction.objects.filter(user=self.request.user,
                                          id=self.kwargs['id'])


class TransactionListDay(ListAPIView):
    """
    View for retrieving Transactions according to Day of user
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        """
        Function for retrieving Transactions according to Day of user
        :return:
        """
        return Transaction.objects.filter(user=self.request.user,
                                          time__day=self.kwargs['date'])


class TransactionListMonth(ListAPIView):
    """
    View for retrieving Transactions according to Month of user
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        """
        Function for retrieving Transactions according to Day of user
        :return:
        """
        return Transaction.objects.filter(user=self.request.user,
                                          time__month=self.kwargs['month'])


class TransactionListYear(ListAPIView):
    """
    View for retrieving Transactions according to Year of user
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        """
        Function for retrieving Transactions according to Year of user
        :return:
        """
        return Transaction.objects.filter(user=self.request.user,
                                          time__year=self.kwargs['year'])


class TransactionListYearMonth(ListAPIView):
    """
    View for retrieving Transactions according to Year and Month of user
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        """
        Function for retrieving Transactions according to Year and Month of user
        :return:
        """
        return Transaction.objects.filter(user=self.request.user,
                                          time__month=self.kwargs['month'],
                                          time__year=self.kwargs['year'])


class TransactionListYearDay(ListAPIView):
    """
    View for retrieving Transactions according to Year and Day of user
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        """
        Function for retrieving Transactions according to Year and Day of user
        :return:
        """
        return Transaction.objects.filter(user=self.request.user,
                                          time__day=self.kwargs['date'],
                                          time__year=self.kwargs['year'])


class TransactionListMonthDay(ListAPIView):
    """
    View for retrieving Transactions according to Month and Day of user
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        """
        Function for retrieving Transactions according to Month and Day of user
        :return:
        """
        return Transaction.objects.filter(user=self.request.user,
                                          time__month=self.kwargs['month'],
                                          time__day=self.kwargs['date'])


class TransactionListDayMonthYear(ListAPIView):
    """
    View for retrieving Transactions according to Year,Month and Date of user
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        """
        Function for retrieving Transactions according to Year,Month and Date of user
        :return:
        """
        return Transaction.objects.filter(user=self.request.user,
                                          time__month=self.kwargs['month'],
                                          time__year=self.kwargs['year'],
                                          time__day=self.kwargs['date'])


class CreateTransaction(CreateAPIView):
    """
    View for creating a transaction
    Method: POST
    """
    permission_classes = [IsAuthenticated]
    serializer_class = CreateTransactionSerializer
    model = Transaction


class UpdateTransaction(UpdateAPIView):
    """
    View for updating/editing a transaction
    Method: PATCH
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateTransactionSerializer
    model = Transaction
    queryset = Transaction.objects.all()


class DeleteTransaction(DestroyAPIView):
    """
    View for deleting a transaction
    Method: DELETE
    """
    permission_classes = [IsAuthenticated]
    serializer_class = DestroyTransactionSerializer
    model = Transaction
    queryset = Transaction.objects.all()

    def destroy(self, request, *args, **kwargs):
        """
        Function for deleting a transaction
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        try:
            instance = self.get_object()
            if instance.user != request.user:
                response = {
                    "success": False,
                    "message": "Object Not Found"
                }
                return Response(data=response, status=status.HTTP_404_NOT_FOUND)  # Response for Transaction not owned
                # by USER

            details = Detail.objects.filter(user=request.user,
                                            date_created__year=instance.time.strftime("%Y"),
                                            date_created__month=instance.time.strftime("%m"))  # Detail object of
            # current instance

            instance, details, response = add_transaction_to_detail(instance, details[0], request.user)
            # delete stock

            details.save()  # save Detail object
            self.perform_destroy(instance)  # destroy Transaction instance
            response = {
                "success": True,
                "message": "Object Deleted"
            }
            return Response(data=response, status=status.HTTP_204_NO_CONTENT)  # Response for successful operation
        except():
            response = {
                "success": False,
                "message": "Object Not Deleted"
            }
        return Response(data=response, status=status.HTTP_400_BAD_REQUEST)  # Response for unsuccesful operation


class DeleteUser(DestroyAPIView):
    """
    View for deleting USER
    Method: DELETE
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailsSerializer
    queryset = User.objects.all()

    def get_object(self):
        """
        Function for getting current user object
        :return: USER object
        """
        return self.request.user

    def destroy(self, request, *args, **kwargs):
        """
        Function for deleting current user
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        try:
            instance = self.get_object()
            self.perform_destroy(instance)  # deleting current user instance
            response = {
                "success": True,
                "message": "User Deleted"
            }
            return Response(data=response, status=status.HTTP_204_NO_CONTENT)  # Response for successful operation

        except():
            response = {
                "success": False,
                "message": "User Not Deleted"
            }
        return Response(data=response, status=status.HTTP_400_BAD_REQUEST)  # Response for unsuccessful operation


class DetailsViewMonth(ListAPIView):
    """
    View for retrieving Details(Monthly Statement) according to Month
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialDetailsSerializer
    model = Detail

    def get_queryset(self):
        """
        Function for retrieving Details(Monthly Statement) according to Month and their aggregate
        :return
        """
        return get_sum_detail(Detail.objects.filter(user=self.request.user,
                                                    date_created__month=self.kwargs['month']), self.request)


class DetailsViewYear(ListAPIView):
    """
    View for retrieving Details(Monthly Statement) according to Year
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialDetailsSerializer
    model = Detail

    def get_queryset(self):
        """
        Function for retrieving Details(Monthly Statement) according to Year and their aggregate
        :return
        """
        return get_sum_detail(Detail.objects.filter(user=self.request.user,
                                                    date_created__year=self.kwargs['year']), self.request)


class DetailsViewYearMonth(ListAPIView):
    """
    View for retrieving Details(Monthly Statement) according to Month and Year
    Method: GET
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialDetailsSerializer
    model = Detail

    def get_queryset(self):
        """
        Function for retrieving Details(Monthly Statement) according to Month and Year and their aggregate
        :return
        """
        return get_sum_detail(Detail.objects.filter(user=self.request.user,
                                                    date_created__month=self.kwargs['month'],
                                                    date_created__year=self.kwargs['year']), self.request)


def get_sum_detail(details, request):
    """
    Add Transaction to Detail Query Set object
    :param details: Detail Query Set Object for adding transaction to
    :param request: Request object
    :return: List of Detail Objects
    """
    details = list(details)  # Convert Detail query Set object to list
    sum_object = Detail(user=request.user)  # Create new Detail Object for storing sum
    for record in details:
        sum_object.income += record.income
        sum_object.totalExpenditure += record.totalExpenditure
        sum_object.savings += record.savings
        sum_object.miscellaneous += record.miscellaneous
        sum_object.recreation += record.recreation
        sum_object.transportation += record.transportation
        sum_object.healthcare += record.healthcare
        sum_object.housing += record.housing
        sum_object.food += record.food
        sum_object.totalTransactions += record.totalTransactions
        sum_object.others += record.others
        sum_object.stock += record.stock

    details.append(sum_object)
    return details


def add_transaction_to_detail(instance, details, request):
    """
    Subtract Transaction from Detail Object
    :param instance: Transaction instance
    :param details: Detail Object for adding transaction to
    :param request: Request object
    :return instance: Transaction instance
    :return detail: Detail object
    :return response: Response from Stock tracker for Stock Transaction.None in other cases.

    """
    factor = 1
    response = None
    if instance.credit:
        factor = -1

    if instance.type == 0:
        details.income -= factor * instance.amount
    elif instance.type == 1:
        details.housing -= factor * instance.amount
    elif instance.type == 2:
        details.food -= factor * instance.amount
    elif instance.type == 3:
        details.healthcare -= factor * instance.amount
    elif instance.type == 4:
        details.transportation -= factor * instance.amount
    elif instance.type == 5:
        details.recreation -= factor * instance.amount
    elif instance.type == 6:
        details.miscellaneous -= factor * instance.amount
    elif instance.type == 7:
        details.others -= factor * instance.amount
    elif instance.type == 8:
        header = {
            "Authorization": "Bearer " + request.auth,
        }
        response = requests.post(url="http://127.0.0.1:8000/stock_interact/", data=request.data,
                                 headers=header)  # Send Request to stock tracker
        details.stock -= factor * instance.amount

    details.totalExpenditure = (
            details.housing + details.food + details.healthcare
            + details.transportation + details.recreation
            + details.miscellaneous + details.stock + details.others
    )

    details.savings = - details.income - details.totalExpenditure
    return instance, details, response
