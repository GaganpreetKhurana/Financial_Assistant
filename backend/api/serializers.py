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
        fields = ('id', 'username', 'amount', 'time', 'category', 'description','credit')
        read_only_fields = ['id', 'username', 'amount', 'time', 'category', 'description','credit']


class CreateTransactionSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=categories)

    class Meta:
        model = Transaction
        fields = ('amount', 'time', 'category', 'description', 'credit')
        read_only_fields = ['time']
        extra_kwargs = {'amount': {'required': True}, 'category': {'required': True}, 'credit': {'required': True}}

    @transaction.atomic
    def save(self, **kwargs):
        details = Detail.objects.filter(user=self.context.get('request').user)
        details = details[0]
        transaction_new = Transaction(user=self.context.get('request').user,
                                      amount=self.validated_data['amount'],
                                      type=self.validated_data['category'],
                                      details=details,
                                      description=self.validated_data['description'],
                                      credit=self.validated_data['credit'])
        factor = 1
        if self.validated_data['credit'] is False:
            factor = -1
        details.totalTransactions += 1
        if self.validated_data['category'] == 0:
            details.income += factor * self.validated_data['amount']
        elif self.validated_data['category'] == 1:
            details.housing += factor * self.validated_data['amount']
        elif self.validated_data['category'] == 2:
            details.food += self.validated_data['amount']
        elif self.validated_data['category'] == 3:
            details.healthcare += factor * self.validated_data['amount']
        elif self.validated_data['category'] == 4:
            details.transportation += factor * self.validated_data['amount']
        elif self.validated_data['category'] == 5:
            details.recreation += factor * self.validated_data['amount']
        elif self.validated_data['category'] == 6:
            details.miscellaneous += factor * self.validated_data['amount']
        details.totalExpenditure = (
                details.housing + details.food + details.healthcare + details.transportation + details.recreation + details.miscellaneous)
        details.savings = details.income - details.totalExpenditure
        details.save()
        transaction_new.save()
        return transaction_new


class UpdateTransactionSerializer(serializers.ModelSerializer):
    category = serializers.ChoiceField(choices=categories)

    class Meta:
        model = Transaction
        fields = ('amount', 'time', 'category', 'description', 'credit')
        read_only_fields = ['time']
        extra_kwargs = {'amount': {'required': True}, 'category': {'required': True}, 'credit': {'required': True}}

    @transaction.atomic
    def update(self, instance, validated_data):

        details = Detail.objects.filter(user=self.context.get('request').user)
        details = details[0]
        factor = 1
        if validated_data['credit'] is False:
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

        factor = 1
        if not instance.credit:
            factor = -1
        if instance.type == 0:
            details.income -= factor * instance.amount
        elif instance.type == 1:
            details.housing -= factor * instance.amount
        elif instance.type == 2:
            details.food -= factor * instance.amount
        elif instance.type == 3:
            details.healthcare -= factor * instance.amount
        elif instance.type == 4:
            details.transportation -= factor * instance.amount
        elif instance.type == 5:
            details.recreation -= factor * instance.amount
        elif instance.type == 6:
            details.miscellaneous -= factor * instance.amount

        instance.type = validated_data['category']
        instance.amount = validated_data['amount']
        instance.description = validated_data['description']
        instance.credit = validated_data['credit']
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
        fields = '__all__'
