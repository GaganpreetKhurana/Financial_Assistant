from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Detail, Transaction
from .serializers import UserDetailsSerializer, TransactionSerializer, RegisterSerializer


# Create your views here.

class DetailList(APIView):

    def get(self, request):
        stocks = Detail.objects.all()
        serializer = UserDetailsSerializer(stocks, many=True)
        return Response(serializer.data)


class TransactionList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        print("HI_3")
        stocks = Transaction.objects.all()
        print(("HI_1"))
        serializer = TransactionSerializer(stocks, many=True)
        print(("HI_2"))
        return Response(serializer.data)


class RegisteredUserView(CreateAPIView):
    serializer_class = RegisterSerializer
