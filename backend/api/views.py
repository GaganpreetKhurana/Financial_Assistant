from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Detail, Transaction
from .serializers import UserDetailsSerializer, TransactionSerializer, RegisterSerializer, FinancialDetailsSerializer, \
    ChangePasswordSerializer, CreateTransactionSerializer, UpdateTransactionSerializer, DestroyTransactionSerializer


# Create your views here.


class RegisterUserView(CreateAPIView):
    serializer_class = RegisterSerializer
    model = User
    permission_classes = []


class RetrieveUserDetailsView(ListAPIView):
    serializer_class = UserDetailsSerializer
    permission_classes = [IsAuthenticated]
    model = User

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)


class ChangePasswordView(UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.request.user.check_password(request.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]},
                                status=status.HTTP_400_BAD_REQUEST)

            if request.data.get("new_password") \
                    != request.data.get("password_confirm"):
                response = {
                    'status': 'failed',
                    'code': status.HTTP_400_BAD_REQUEST,
                    'message': 'Password do not Match',
                    'data': []
                }
                return Response(response)
            validate_password(request.data.get("new_password"))
            request.user.set_password(request.data.get("new_password"))
            request.user.save()
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditUserDetailsView(UpdateAPIView):
    serializer_class = UserDetailsSerializer
    model = User
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():

            try:
                if request.data.get("first_name") is not None and request.data.get("first_name") != "":
                    request.user.first_name = request.data.get("first_name")
                if request.data.get("last_name") is not None and request.data.get("last_name") != "":
                    request.user.last_name = request.data.get("last_name")
                if request.data.get("username") is not None and request.data.get("username") != "":
                    request.user.username = request.data.get("username")
                if request.data.get("email") is not None and request.data.get("email") != "":
                    request.user.email = request.data.get("email")
                request.user.save()
            except():
                response = {
                    'status': 'failed',
                    'code': status.HTTP_400_BAD_REQUEST,
                    'message': 'Unable to change',
                    'data': []
                }
                return Response(response)
            response = {
                'status': 'success',
                'code': status.HTTP_200_OK,
                'message': 'Details Updated',
                'data': []
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetailsView(ListAPIView):
    serializer_class = FinancialDetailsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return get_sum_detail(
            Detail.objects.filter(user=self.request.user), self.request)


class TransactionList(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class TransactionListID(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user,
                                          id=self.kwargs['id'])


class TransactionListDay(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user,
                                          time__day=self.kwargs['date'])


class TransactionListMonth(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user,
                                          time__month=self.kwargs['month'])


class TransactionListYear(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user,
                                          time__year=self.kwargs['year'])


class TransactionListYearMonth(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user,
                                          time__month=self.kwargs['month'],
                                          time__year=self.kwargs['year'])


class TransactionListYearDay(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user,
                                          time__day=self.kwargs['date'],
                                          time__year=self.kwargs['year'])


class TransactionListMonthDay(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user,
                                          time__month=self.kwargs['month'],
                                          time__day=self.kwargs['date'])


class TransactionListDayMonthYear(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user,
                                          time__month=self.kwargs['month'],
                                          time__year=self.kwargs['year'],
                                          time__day=self.kwargs['date'])


class CreateTransaction(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateTransactionSerializer
    model = Transaction


class UpdateTransaction(UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UpdateTransactionSerializer
    model = Transaction
    queryset = Transaction.objects.all()


class DeleteTransaction(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DestroyTransactionSerializer
    model = Transaction
    queryset = Transaction.objects.all()

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.user != request.user:
                response = {
                    "success": False,
                    "message": "Object Not Found"
                }
                return Response(data=response, status=status.HTTP_204_NO_CONTENT)
            # print(instance, instance.time, type(instance.time))
            details = Detail.objects.filter(user=request.user,
                                            date_created__year=instance.time.strftime("%Y"),
                                            date_created__month=instance.time.strftime("%m"))
            instance, details = add_transaction_to_detail(instance, details[0])
            details.save()
            self.perform_destroy(instance)
            response = {
                "success": True,
                "message": "Object Deleted"
            }
        except():
            response = {
                "success": False,
                "message": "Object Not Deleted"
            }
        return Response(data=response, status=status.HTTP_204_NO_CONTENT)


class DeleteUser(DestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailsSerializer
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            response = {
                "success": True,
                "message": "User Deleted"
            }
        except():
            response = {
                "success": False,
                "message": "User Not Deleted"
            }
        return Response(data=response, status=status.HTTP_204_NO_CONTENT)


class DetailsViewMonth(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialDetailsSerializer
    model = Detail

    def get_queryset(self):
        return get_sum_detail(Detail.objects.filter(user=self.request.user,
                                                    date_created__month=self.kwargs['month']), self.request)


class DetailsViewYear(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialDetailsSerializer
    model = Detail

    def get_queryset(self):
        return get_sum_detail(Detail.objects.filter(user=self.request.user,
                                                    date_created__year=self.kwargs['year']), self.request)


class DetailsViewYearMonth(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialDetailsSerializer
    model = Detail

    def get_queryset(self):
        return get_sum_detail(Detail.objects.filter(user=self.request.user,
                                                    date_created__month=self.kwargs['month'],
                                                    date_created__year=self.kwargs['year']), self.request)


def get_sum_detail(details, request):
    details = list(details)
    sum_object = Detail(user=request.user)
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


def add_transaction_to_detail(instance, details):
    factor = 1
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
        details.stock -= factor * instance.amount

    details.totalExpenditure = (
            details.housing + details.food + details.healthcare
            + details.transportation + details.recreation
            + details.miscellaneous + details.stock + details.others
    )

    details.savings = details.income - details.totalExpenditure
    return instance, details
