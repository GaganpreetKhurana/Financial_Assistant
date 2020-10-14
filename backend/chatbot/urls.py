from django.urls import path

from . import views

app_name = "chatbot"
urlpatterns = [
    # path("chat", views.button),
    # path("output", views.ChatAnsRequest, name="ChatAnsRequest"),
    path("external/", views.external, name="bot"),
    path("old/", views.get_previous_chats, name="previous_chats"),
    path("stock_list/", views.stock_list_view, name="stock_list"),
    path("wishlist/", views.amazon_wishlist_view, name="wishlist"),
]
