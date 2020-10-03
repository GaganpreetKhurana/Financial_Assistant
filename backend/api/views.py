from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Detail, Transaction
from .serializers import UserDetailsSerializer, TransactionSerializer, RegisterSerializer, FinancialDetailsSerializer, \
    ChangePasswordSerializer, CreateTransactionSerializer


# Create your views here.


class RegisterUserView(CreateAPIView):
    serializer_class = RegisterSerializer
    model = User


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
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

            if request.data.get("new_password") != request.data.get("password_confirm"):
                response = {
                    'status': 'failed',
                    'code': status.HTTP_400_BAD_REQUEST,
                    'message': 'Password do not Match',
                    'data': []
                }
                return Response(response)
            request.user.set_password(request.data.get("new_password"))
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
                request.user.first_name = request.data.get("first_name")
                request.user.last_name = request.data.get("last_name")
                request.user.username = request.data.get("username")
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
        return Detail.objects.filter(user=self.request.user)


class TransactionList(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TransactionSerializer
    model = Transaction

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class CreateTransaction(CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CreateTransactionSerializer
    model = Transaction
