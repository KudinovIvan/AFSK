from rest_framework import serializers
from api.models import UrlsModel, TargetsModel


class UrlsSerializer(serializers.ModelSerializer):

    class Meta:
        model = UrlsModel
        fields = ("id", "name", "priority", "url",)


class TargetsSerializer(serializers.ModelSerializer):

    class Meta:
        model = TargetsModel
        fields = "__all__"
