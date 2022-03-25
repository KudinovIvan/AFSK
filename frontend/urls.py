from django.urls import path
from frontend.views import *

app_name = 'frontend'

urlpatterns = [
    path(r'', IndexView.as_view(), name='index'),
    path(r'links', LinksView.as_view(), name='links'),
    path(r'login', LoginView.as_view(), name='login'),
    path(r'monitoring', Monitoring.as_view(), name='monitoring')
]
