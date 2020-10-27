from django.urls import path

from . import views

app_name = "chatbot"
urlpatterns = [
    # ChatBot
    path("external/", views.external, name="bot"),
    # Previous Chats
    path("old/", views.get_previous_chats, name="previous_chats"),
    # Stock List
    path("stock_list/", views.stock_list_view, name="stock_list"),
    # Wishlist
    path("wishlist/", views.amazon_wishlist_view, name="wishlist"),
    # Interact with Stock Tracker
    path("stock_interact/", views.stock_interact_view, name="stock_update"),
]
