from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .ChatBot import main
from .ChatBot.AmazonPriceTracker import amazon_api
from .ChatBot.StockTracker import stock_api
from .ChatBot.StockTracker.stock_script import SellStock, StockBuy


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def external(request):
    user_id = request.user.id
    user_response = request.POST.get("content")
    chat_response = main.chat_web(user_response, user_id, request)
    data = {
        'self': False,
        'content': chat_response
    }
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_previous_chats(request):
    user_id = request.user.id
    no_of_results = request.POST.get("results")
    chat_response = main.chat_get(user_id, no_of_results)
    data = []
    for message in chat_response:
        sender = False
        if message[1] == "True":
            sender = True
        data.append({
            'content': message[0],
            'self': sender
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def stock_list_view(request):
    stocks = stock_api.stock_list(request.user.id)
    data = []
    for stock in stocks:
        data.append({
            'owned': stock[0],
            'stock': stock[1],
            'current_price': stock[2],
            'createdAt': stock[3]
        })
    # print(data)
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def amazon_wishlist_view(request):
    wishlist = amazon_api.amazon_wishlist(request.user.id)
    data = []
    for item in wishlist:
        data.append({
            'url': item[0],
            'price': item[1],
            'title': item[2],
            'createdAt': item[3]
        })
    # print(data)
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def stock_interact_view(request):
    try:
        if request.data.get("credit"):
            response = SellStock(request.data.get("amount"),
                                 request.data.get('description').split()[0],
                                 request.user.id)
        else:
            response = StockBuy(request.data.get("amount"),
                                request.data.get('description').split()[0],
                                request.user.id)

        if response == "Stock Not Owned" or response == "No such Stock":
            return Response(data={"detail": response},
                            status=status.HTTP_404_NOT_FOUND)
        elif response == "Not Enough Stock Owned":
            return Response(data={"detail": response},
                            status=status.HTTP_403_FORBIDDEN)
        elif response == "Stock Sold Successfully":
            return Response(data={"detail": response},
                            status=status.HTTP_202_ACCEPTED)
        return Response(data={"detail": "Invalid Request"},
                        status=status.HTTP_400_BAD_REQUEST)
    except ():
        return Response(data={"detail": "Invalid Request"},
                        status=status.HTTP_400_BAD_REQUEST)
