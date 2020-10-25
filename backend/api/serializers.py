import requests
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db import transaction
from django.utils.datetime_safe import datetime
from rest_framework import serializers

from . import views
from .models import Detail, Transaction, categories


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'password_confirm')
        extra_kwargs = {'password': {'write_only': True, 'style': {"input_type": "password"}}}

    def save(self):
        try:
            validate_email(self.validated_data['email'])
        except ValidationError:
            raise serializers.ValidationError({'email': 'Invalid Email!'})

        user = User(username=self.validated_data['username'], email=self.validated_data['email'],
                    first_name=self.validated_data['first_name'], last_name=self.validated_data['last_name'])

        password = self.validated_data['password']
        password_confirm = self.validated_data['password_confirm']
        try:
            validate_password(password)
        except ValidationError:
            raise serializers.ValidationError({'password': 'Invalid Password!'})

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
            'username', 'income', 'savings', 'totalExpenditure', 'housing', 'food', 'healthcare',
            'transportation',
            'recreation',
            'miscellaneous', 'others', 'stock', 'totalTransactions', 'date_created')
        read_only_fields = ['username', 'savings', 'totalExpenditure', 'totalTransactions', 'date_created']


class TransactionSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='get_category')
    username = serializers.CharField(source='get_username')

    class Meta:
        model = Transaction
        fields = ('id', 'username', 'amount', 'time', 'last_updated', 'category', 'description', 'credit')
        read_only_fields = ['id', 'username', 'amount', 'time', 'last_updated', 'category', 'description', 'credit']


class CreateTransactionSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=categories)

    class Meta:
        model = Transaction
        fields = ('user', 'amount', 'time', 'last_updated', 'category', 'description', 'credit')
        read_only_fields = ['user', 'time', 'last_updated']
        extra_kwargs = {'amount': {'required': True}, 'category': {'required': True}, 'credit': {'required': True}}

    @transaction.atomic
    def save(self, **kwargs):
        month = datetime.now().month
        year = datetime.now().year
        details = Detail.objects.filter(user=self.context.get('request').user,
                                        date_created__month=month,
                                        date_created__year=year)
        if len(details) == 0:
            details = Detail(user=self.context.get('request').user)
        else:
            details = details[0]

        description = self.validated_data['description']
        if description is None or description == '':
            description = "Description Not Provided!"

        transaction_new = Transaction(user=self.context.get('request').user,
                                      amount=self.validated_data['amount'],
                                      type=self.validated_data['category'],
                                      details=details,
                                      description=description,
                                      credit=self.validated_data['credit'])

        validated_data, details, response = add_transaction_dict_to_detail(self.validated_data,
                                                                           details,
                                                                           self.context.get('request'))
        if response is not None and response.status_code != 202:
            raise serializers.ValidationError(detail=response.json(), code=response.status_code)

        details.save()
        transaction_new.save()
        return transaction_new


class UpdateTransactionSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=categories)

    class Meta:
        model = Transaction
        fields = ('user', 'amount', 'time', 'last_updated', 'category', 'description', 'credit')
        read_only_fields = ['user', 'time', 'last_updated']
        extra_kwargs = {'amount': {'required': True}, 'category': {'required': True}, 'credit': {'required': True}}

    @transaction.atomic
    def update(self, instance, validated_data):
        month = instance.get_month
        year = instance.get_year
        details = Detail.objects.filter(user=self.context.get('request').user,
                                        date_created__month=month,
                                        date_created__year=year)
        details = details[0]

        validated_data, details, response = add_transaction_dict_to_detail(validated_data,
                                                                           details,
                                                                           self.context.get('request'))

        if response is not None and response.status_code != 202:
            raise serializers.ValidationError(detail=response.json(), code=response.status_code)

        instance, details, response = views.add_transaction_to_detail(instance,
                                                                      details,
                                                                      self.context.get('request'))

        if response is not None and response.status_code != 202:
            raise serializers.ValidationError(detail=response.json(), code=response.status_code)

        instance.type = validated_data['category']
        instance.amount = validated_data['amount']

        description = validated_data['description']
        if description is None or description == '':
            description = "Description Not Provided!"
        instance.description = description

        instance.credit = validated_data['credit']
        details.save()
        instance.save()
        return validated_data


class DestroyTransactionSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=categories)

    class Meta:
        model = Transaction
        fields = '__all__'


def add_transaction_dict_to_detail(validated_data, details, request):
    factor = 1
    response = None
    if validated_data['credit']:
        factor = -1
    if validated_data['category'] == 0:
        details.income += factor * validated_data['amount']
    elif validated_data['category'] == 1:
        details.housing += factor * validated_data['amount']
    elif validated_data['category'] == 2:
        details.food += factor * validated_data['amount']
    elif validated_data['category'] == 3:
        details.healthcare += factor * validated_data['amount']
    elif validated_data['category'] == 4:
        details.transportation += factor * validated_data['amount']
    elif validated_data['category'] == 5:
        details.recreation += factor * validated_data['amount']
    elif validated_data['category'] == 6:
        details.miscellaneous += factor * validated_data['amount']
    elif validated_data['category'] == 7:
        details.others += factor * validated_data['amount']
    elif validated_data['category'] == 8:
        header = {
            "Authorization": "Bearer " + request.auth,
        }
        response = requests.post(url="http://127.0.0.1:8000/stock_interact/", data=request.data,
                                 headers=header)
        details.stock += factor * validated_data['amount']

    details.totalExpenditure = (
            details.housing + details.food + details.healthcare
            + details.transportation + details.recreation
            + details.miscellaneous + details.stock + details.others
    )

    details.savings = - details.income - details.totalExpenditure
    return validated_data, details, response
