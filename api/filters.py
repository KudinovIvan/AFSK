from api.models import TargetsModel
from django_filters import FilterSet, DateFromToRangeFilter


class TargetsFilter(FilterSet):
    timestamp_range = DateFromToRangeFilter(field_name='timestamp')

    class Meta:
        model = TargetsModel
        fields = {
            "target_id": ['exact', 'in'],
        }