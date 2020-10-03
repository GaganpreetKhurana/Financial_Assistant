from django.shortcuts import render
from .ChatBot import main

print(main.chat_web("Hello"))


def button(request):
    return render(request,'chat.html')


def ChatAnsRequest(request):
    chat_response = main.chat_web("Hi")
    print(chat_response)
    return render(request,'chat.html',{'data':chat_response})

def external(request):
    inp = request.POST.get('param')
    chat_response = main.chat_web("Hi")
    return render(request,'chat.html',{'data1': chat_response})