from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        data['username'] = self.user.username
        data['groups'] = self.user.groups.values_list('name', flat=True)
        data['is_admin'] = self.user.is_staff or self.user.is_superuser
        return data

