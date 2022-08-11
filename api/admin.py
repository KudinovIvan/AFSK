from django.contrib import admin
from api.models import UrlsModel, TargetsModel
from django.forms import CheckboxSelectMultiple
from django.db import models


@admin.register(UrlsModel)
class UrlsModelAdmin(admin.ModelAdmin):
    search_fields = ('name',)
    formfield_overrides = {
        models.ManyToManyField: {'widget': CheckboxSelectMultiple},
    }
    list_display = ['name', 'priority', 'url', 'is_visible']


admin.site.register(TargetsModel)
