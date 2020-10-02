from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Detail, Transaction


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'password_confirm')
        extra_kwargs = {'password': {'write_only': True}}

    def save(self):
        user = User(username=self.validated_data['username'], email=self.validated_data['email'],
                    first_name=self.validated_data['first_name'], last_name=self.validated_data['last_name'])
        password = self.validated_data['password']
        password_confirm = self.validated_data['password_confirm']
        if password != password_confirm:
            raise serializers.ValidationError({'password': 'Passwords must Match'})
        user.set_password(password)
        user.save()
        user_detail = Detail(user=user)
        user_detail.save()
        return user


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')
        read_only_fields = ('username', 'first_name', 'last_name', 'email')


class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    new_password = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password_confirm = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'old_password', 'new_password', 'password_confirm')
        extra_kwargs = {'old_password': {'write_only': True}, 'new_password': {'write_only': True},
                        'password_confirm': {'write_only': True}}
        read_only_fields = ['username']


class FinancialDetailsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='get_username')

    class Meta:
        model = Detail
        fields = (
            'username', 'income', 'savings', 'totalExpenditure', 'housing', 'food', 'healthcare', 'transportation',
            'recreation',
            'miscellaneous', 'totalTransactions')
        read_only_fields = ['username' + 'savings', 'totalExpenditure', 'totalTransactions']


class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='get_category')
    username = serializers.CharField(source='get_username')

    class Meta:
        model = Transaction
        fields = ('username', 'amount', 'time', 'category')
        read_only_fields = ['username', 'time']
