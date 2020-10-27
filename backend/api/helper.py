from .serializers import UserDetailsSerializer


def jwt_create_response_payload(token, user=None, request=None, issued_at=None):
    """
    Creating Payload for jwt
    :param token: jwt token
    :param user: User object
    :param request: Request Object
    :param issued_at: Token issued at
    :return: Payload (token,user details)
    """
    return {
        'token': token,
        'user': UserDetailsSerializer(user, context={'request': request}).data
    }
