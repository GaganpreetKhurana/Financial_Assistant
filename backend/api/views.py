from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Detail, Transaction
from .serializers import DetailSerializer, TransactionSerializer


# Create your views here.

class DetailList(APIView):

    def get(self, request):
        stocks = Detail.objects.all()
        serializer = DetailSerializer(stocks, many=True)
        return Response(serializer.data)


class TransactionList(APIView):

    def get(self, request):
        stocks = Transaction.objects.all()
        serializer = TransactionSerializer(stocks, many=True)
        return Response(serializer.data)
