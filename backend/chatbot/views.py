from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .ChatBot import main


# print(main.chat_web("Hello")) #fill user_id


def button(request):
    return render(request, 'chat.html')


def ChatAnsRequest(request):
    chat_response = main.chat_web("Hi")  # fill user_id
    print(chat_response)
    return render(request, 'chat.html', {'data': chat_response})


# def external(request):
#     inp = request.POST.get('param')
#     chat_response = main.chat_web(inp)
#     return render(request, 'chat.html', {'data1': chat_response})


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
        data.append({
            'content': message[0],
            # 'self': message[1],
        })
    return Response(data)
