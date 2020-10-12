from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .ChatBot import main

print(main.chat_web("Hello"))


def button(request):
    return render(request, 'chat.html')


def ChatAnsRequest(request):
    chat_response = main.chat_web("Hi")
    print(chat_response)
    return render(request, 'chat.html', {'data': chat_response})


# def external(request):
#     inp = request.POST.get('param')
#     chat_response = main.chat_web(inp)
#     return render(request, 'chat.html', {'data1': chat_response})


@api_view(['POST'])
def external(request):
    user_response = request.POST.get("content")
    chat_response = main.chat_web(user_response)
    data = {
        'self': False,
        'content': chat_response
    }
    return Response(data)
