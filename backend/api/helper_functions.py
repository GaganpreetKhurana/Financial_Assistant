import requests

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
    if instance.credit:
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
    elif instance.type == 7:
        details.others -= factor * instance.amount
    elif instance.type == 8:
        header = {
            "Authorization": "Bearer " + request.auth,
        }
        response = requests.post(url="http://127.0.0.1:8000/stock_interact/", data=request.data,
                                 headers=header)  # Send Request to stock tracker
        details.stock -= factor * instance.amount

    details.totalTransactions -= 1

    details.totalExpenditure = (
            details.housing + details.food + details.healthcare
            + details.transportation + details.recreation
            + details.miscellaneous + details.stock + details.others
    )

    details.savings = - details.income - details.totalExpenditure
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
                                 headers=header)  # Send Request to Stock Tracker
        details.stock += factor * validated_data['amount']

    details.totalTransactions += 1

    details.totalExpenditure = (
            details.housing + details.food + details.healthcare
            + details.transportation + details.recreation
            + details.miscellaneous + details.stock + details.others
    )

    details.savings = - details.income - details.totalExpenditure
    return details, response


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
