from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .ChatBot import main
from .ChatBot.AmazonPriceTracker import amazon_api
from .ChatBot.StockTracker import stock_api


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


user_id = 2
print(stock_api.stock_list(user_id))
print(amazon_api.amazon_wishlist(user_id))