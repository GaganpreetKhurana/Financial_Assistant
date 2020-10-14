from django.urls import path

from . import views

app_name = "chatbot"
urlpatterns = [
    ##path("chat", views.button),
    ##path("output", views.ChatAnsRequest, name="ChatAnsRequest"),
    path("external/", views.external, name="bot"),
    path("old/", views.get_previous_chats, name="previous_chats"),
]
