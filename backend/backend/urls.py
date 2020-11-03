"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Login (new token)
    path('api/token/', obtain_jwt_token, name='obtain_token_pair'),
    # Refresh Token
    path('api/token/refresh/', refresh_jwt_token, name='refresh_token'),
    # Verify Token
    path('api/token/verify/', verify_jwt_token, name='verify_token'),
    # Forget Password
    path('api/password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),

    # Include Api app Urls
    path('', include('api.urls')),

    # Include chatbot app Urls
    path('', include('chatbot.urls')),

    # Default Home Page
    path('', RedirectView.as_view(url='http://127.0.0.1:3000/', permanent=True), name='home')
]
