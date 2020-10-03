from .serializers import UserDetailsSerializer


def jwt_create_response_payload(token, user=None, request=None, issued_at=None):
    return {
        'token': token,
        'user': UserDetailsSerializer(user, context={'request': request}).data
    }
