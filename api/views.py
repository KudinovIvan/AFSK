from rest_framework.mixins import ListModelMixin, CreateModelMixin
from rest_framework.viewsets import GenericViewSet
from api import serializers as api_serializers
from api.models import UrlsModel, TargetsModel
from rest_framework import permissions, decorators
from api import filters as api_filters
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend


@decorators.permission_classes([permissions.IsAuthenticated])
class ListUrlsViewSet(GenericViewSet, ListModelMixin):
    queryset = UrlsModel.objects.all()
    serializer_class = api_serializers.UrlsSerializer

    def get_queryset(self):
        return self.queryset.filter(is_visible=True, users=self.request.user)


@decorators.permission_classes([permissions.IsAuthenticated])
class ListTargetsViewSet(GenericViewSet, ListModelMixin):
    filter_class = api_filters.TargetsFilter
    filter_backends = (filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter)
    queryset = TargetsModel.objects.all()
    serializer_class = api_serializers.TargetsSerializer


class CreateViewSet(GenericViewSet, CreateModelMixin):
    queryset = TargetsModel.objects.all()
    serializer_class = api_serializers.TargetsSerializer
