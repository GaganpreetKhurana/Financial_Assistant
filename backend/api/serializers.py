from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers

from .models import Detail, Transaction, categories


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'password_confirm')
        extra_kwargs = {'password': {'write_only': True, 'style': {"input_type": "password"}}}

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
        read_only_fields = ['username', 'savings', 'totalExpenditure', 'totalTransactions']


class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='get_category')
    username = serializers.CharField(source='get_username')

    class Meta:
        model = Transaction
        fields = ('id', 'username', 'amount', 'time', 'category')
        read_only_fields = ['id', 'username', 'amount', 'time', 'category']


class CreateTransactionSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=categories)

    class Meta:
        model = Transaction
        fields = ('amount', 'time', 'category')
        read_only_fields = ['time']
        extra_kwargs = {'amount': {'required': True}}

    @transaction.atomic
    def save(self, **kwargs):
        details = Detail.objects.filter(user=self.context.get('request').user)
        details = details[0]
        transaction = Transaction(user=self.context.get('request').user,
                                  amount=self.validated_data['amount'],
                                  type=self.validated_data['category'],
                                  details=details)
        details.totalTransactions += 1
        if self.validated_data['category'] == 0:
            details.income += self.validated_data['amount']
        elif self.validated_data['category'] == 1:
            details.housing += self.validated_data['amount']
        elif self.validated_data['category'] == 2:
            details.food += self.validated_data['amount']
        elif self.validated_data['category'] == 3:
            details.healthcare += self.validated_data['amount']
        elif self.validated_data['category'] == 4:
            details.transportation += self.validated_data['amount']
        elif self.validated_data['category'] == 5:
            details.recreation += self.validated_data['amount']
        elif self.validated_data['category'] == 6:
            details.miscellaneous += self.validated_data['amount']
        details.totalExpenditure = (
                details.housing + details.food + details.healthcare + details.transportation + details.recreation + details.miscellaneous)
        details.savings = details.income - details.totalExpenditure
        details.save()
        transaction.save()
        return transaction


class UpdateTransactionSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=categories)

    class Meta:
        model = Transaction
        fields = ('amount', 'time', 'category')
        read_only_fields = ['time']
        extra_kwargs = {'amount': {'required': True}}
    @transaction.atomic
    def update(self, instance, validated_data):

        details = Detail.objects.filter(user=self.context.get('request').user)
        details = details[0]
        if validated_data['category'] == 0:
            details.income += validated_data['amount']
        elif validated_data['category'] == 1:
            details.housing += validated_data['amount']
        elif validated_data['category'] == 2:
            details.food += validated_data['amount']
        elif validated_data['category'] == 3:
            details.healthcare += validated_data['amount']
        elif validated_data['category'] == 4:
            details.transportation += validated_data['amount']
        elif validated_data['category'] == 5:
            details.recreation += validated_data['amount']
        elif validated_data['category'] == 6:
            details.miscellaneous += validated_data['amount']

        if instance.type == 0:
            details.income -= instance.amount
        elif instance.type == 1:
            details.housing -= instance.amount
        elif instance.type == 2:
            details.food -= instance.amount
        elif instance.type == 3:
            details.healthcare -= instance.amount
        elif instance.type == 4:
            details.transportation -= instance.amount
        elif instance.type == 5:
            details.recreation -= instance.amount
        elif instance.type == 6:
            details.miscellaneous -= instance.amount

        instance.type = validated_data['category']
        instance.amount = validated_data['amount']
        details.totalExpenditure = (
                details.housing + details.food + details.healthcare + details.transportation + details.recreation + details.miscellaneous)
        details.savings = details.income - details.totalExpenditure
        details.save()
        instance.save()
        return validated_data


class DestroyTransactionSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=categories)

    class Meta:
        model = Transaction
        fields = ('amount', 'time', 'category')
        read_only_fields = ['time']
        extra_kwargs = {'amount': {'required': True}}
