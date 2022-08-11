from django.urls import path
from api.views import ListUrlsViewSet, CreateViewSet, ListTargetsViewSet, MailingViewSet

app_name = 'api'

urlpatterns = [
    path(r'v1/mailing/', MailingViewSet.as_view(), name='set_mailing'),
    path(r'v1/urls/', ListUrlsViewSet.as_view({'get': 'list'}), name='list_urls'),
    path(r'v1/targets/create/', CreateViewSet.as_view({'post': 'create'}), name='target_create'),
    path(r'v1/targets/list/', ListTargetsViewSet.as_view({'get': 'list'}), name='target_list')
]
