from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from users.views import CustomTokenObtainPairView

app_name = 'api_auth'

urlpatterns = [
    path(r'jwt/login/', CustomTokenObtainPairView.as_view(), name="jwt-login"),
    path(r'jwt/refresh/', jwt_views.TokenRefreshView.as_view(), name="jwt-refresh"),
]
