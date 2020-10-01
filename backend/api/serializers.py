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
        return user


class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')
        read_only_fields = '__all__'


class FinancialDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detail
        fields = (
            'income', 'savings', 'totalExpenditure', 'housing', 'food', 'healthcare', 'transportation', 'recreation',
            'miscellaneous', 'totalTransactions')
        read_only_fields = ['savings', 'totalExpenditure', 'totalTransactions']


class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='get_category')

    class Meta:
        model = Transaction
        fields = ('user', 'amount', 'time', 'category')
        read_only_fields = ['user', 'time']
