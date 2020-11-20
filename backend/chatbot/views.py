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
    """
    Interact with ChatBot
    Method: POST
    :param request: Request(object)
    :return: ChatBot response
    """
    user_id = request.user.id
    user_response = request.POST.get("content")
    chat_response = main.chat_web(user_response, user_id, request)  # get ChatBot response
    data = {
        'self': False,
        'content': chat_response
    }
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_previous_chats(request):
    """
        Get previous chats
        Method: POST
        :param request: Request(object)
        :return: List of previous messages exchanged
        """
    user_id = request.user.id
    no_of_results = request.POST.get("results")
    chat_response = main.chat_get(user_id, no_of_results)  # Call function to retrieve previous chats
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
    """
        Get Stock details
        Method: GET
        :param request: Request(object)
        :return: List of stock details
        """
    stocks = stock_api.stock_list(request.user.id)  # Get stock details
    data = []
    for stock in stocks:
        data.append({
            'owned': stock[0],
            'stock': stock[1],
            'current_price': stock[2],
            'createdAt': stock[3]
        })
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def amazon_wishlist_view(request):
    """
        Get wishlist
        Method: GET
        :param request: Request(object)
        :return: Wishlist
        """
    wishlist = amazon_api.amazon_wishlist(request.user.id)  # Retrieve wishlist
    data = []
    for item in wishlist:
        data.append({
            'url': item[0],
            'price': item[1],
            'title': item[2],
            'image_url': item[3],
            'createdAt': item[4]
        })
    return Response(data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def stock_interact_view(request):
    """
        Interact with Stock Tracker
        Method: POST
        :param request: Request(object)
        :return: Response from Stock Tracker
        """
    try:
        if request.data.get("credit") and (
                request.data.get("credit") == "true" or request.data.get("credit") == "True"):
            response = SellStock(request.data.get("amount"),
                                 request.data.get('description').split()[0],
                                 request.user.id)
        else:
            response = StockBuy(request.data.get("amount"),
                                request.data.get('description').split()[0],
                                request.user.id)

        if response == "Stock Not Owned" or response == "No such Stock" or response == "No previous stock exists":
            return Response(data={"detail": response},
                            status=status.HTTP_404_NOT_FOUND)
        elif response == "Not Enough Stock Owned":
            return Response(data={"detail": response},
                            status=status.HTTP_403_FORBIDDEN)
        elif response == "Stock Sold Successfully" or response == "Stock Bought Successfully ":
            return Response(data={"detail": response},
                            status=status.HTTP_202_ACCEPTED)
        return Response(data={"detail": "Invalid Request"},
                        status=status.HTTP_400_BAD_REQUEST)
    except ():
        return Response(data={"detail": "Invalid Request"},
                        status=status.HTTP_400_BAD_REQUEST)
