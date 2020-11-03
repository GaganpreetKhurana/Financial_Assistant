import requests
from rest_framework import status
from rest_framework.response import Response

from .models import Detail


def add_transaction_to_detail(instance, details, request):
    """
    Subtract Transaction from Detail Object
    :param instance: Transaction instance
    :param details: Detail Object for adding transaction to
    :param request: Request object
    :return detail: Detail object
    :return response: Response from Stock tracker for Stock Transaction.None in other cases.

    """
    factor = 1
    response = None
    if instance.credit is False:
        factor = -1

    if instance.type == 0:
        details.income -= instance.amount
    elif instance.type == 1:
        details.housing += instance.amount
    elif instance.type == 2:
        details.food += instance.amount
    elif instance.type == 3:
        details.healthcare += instance.amount
    elif instance.type == 4:
        details.transportation += instance.amount
    elif instance.type == 5:
        details.recreation += instance.amount
    elif instance.type == 6:
        details.miscellaneous -= factor * instance.amount
    elif instance.type == 7:
        details.others -= factor * instance.amount
    elif instance.type == 8:
        return details, Response(data={"detail": "Not Allowed"},
                                 status=status.HTTP_403_FORBIDDEN)

    details.totalTransactions -= 1

    details.totalExpenditure = (
            details.housing + details.food + details.healthcare
            + details.transportation + details.recreation
    )
    if instance.type >= 6:
        if instance.credit:
            details.income -= instance.amount
        else:
            details.totalExpenditure -= instance.amount

    details.savings = details.income - details.totalExpenditure
    return details, response


def add_transaction_dict_to_detail(validated_data, details, request):
    """
    Add Transaction to Detail Query Object
    :param validated_data: Dictionary containing data to be filled
    :param details: Detail Object for adding transaction to
    :param request: Request object
    :return detail: Detail object
    :return response: Response from Stock tracker for Stock Transaction.None in other cases.

    """
    factor = 1
    response = None
    if validated_data['credit'] is False:
        factor = -1
    if validated_data['category'] == 0:
        details.income += validated_data['amount']
        validated_data['credit'] = True
    elif validated_data['category'] == 1:
        details.housing -= validated_data['amount']
        validated_data['credit'] = False
    elif validated_data['category'] == 2:
        details.food -= validated_data['amount']
        validated_data['credit'] = False
    elif validated_data['category'] == 3:
        details.healthcare -= validated_data['amount']
        validated_data['credit'] = False
    elif validated_data['category'] == 4:
        details.transportation -= validated_data['amount']
        validated_data['credit'] = False
    elif validated_data['category'] == 5:
        details.recreation -= validated_data['amount']
        validated_data['credit'] = False
    elif validated_data['category'] == 6:
        details.miscellaneous += factor * validated_data['amount']
    elif validated_data['category'] == 7:
        details.others += factor * validated_data['amount']
    elif validated_data['category'] == 8:
        header = {
            "Authorization": "Bearer " + request.auth,
        }
        response = requests.post(url="http://127.0.0.1:8000/stock_interact/", data=request.data,
                                 headers=header)  # Send Request to Stock Tracker
        details.stock += factor * validated_data['amount']

    details.totalTransactions += 1

    details.totalExpenditure = (
            details.housing + details.food + details.healthcare
            + details.transportation + details.recreation
    )
    if validated_data['category'] >= 6:
        if validated_data['credit']:
            details.income += validated_data['amount']
        else:
            details.totalExpenditure += validated_data['amount']

    details.savings = details.income - details.totalExpenditure
    return validated_data, details, response


def get_sum_detail(details, request):
    """
    Add Transaction to Detail Query Set object
    :param details: Detail Query Set Object for adding transaction to
    :param request: Request object
    :return: List of Detail Objects
    """
    details = list(details)  # Convert Detail query Set object to list
    sum_object = Detail(user=request.user)  # Create new Detail Object for storing sum
    for record in details:
        sum_object.income += record.income
        sum_object.totalExpenditure += record.totalExpenditure
        sum_object.savings += record.savings
        sum_object.miscellaneous += record.miscellaneous
        sum_object.recreation += record.recreation
        sum_object.transportation += record.transportation
        sum_object.healthcare += record.healthcare
        sum_object.housing += record.housing
        sum_object.food += record.food
        sum_object.totalTransactions += record.totalTransactions
        sum_object.others += record.others
        sum_object.stock += record.stock

    details.append(sum_object)
    return details
