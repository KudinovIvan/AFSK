from django.contrib import admin
from users.forms import CustomUserCreationForm, CustomUserChangeForm
from django.contrib.auth.admin import UserAdmin
from users import models
from django.contrib.auth.models import Group
from django.forms import CheckboxSelectMultiple
from django.db import models as dj_db_models


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = models.CustomUser

    list_display = ('username', 'middle_name', 'given_name', 'family_name', 'email',
                    'is_staff', 'is_active')
    list_filter = ('username', 'middle_name', 'given_name', 'family_name', 'email',
                   'is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('username',
                           'password')}),
        ('Дополнительно', {'fields': ('middle_name',
                                      'given_name',
                                      'family_name',
                                      'email')}),
        ('Разрешения', {'fields': ('is_staff',
                                   'is_active',
                                   'mailing',)}),
        ('Доступные ссылки', {'fields': ('links',)})
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username',
                       'password1',
                       'password2',
                       'middle_name',
                       'given_name',
                       'family_name',
                       'email',
                       'is_staff',
                       'is_active',
                       'links')}
         ),
    )
    search_fields = ('username',)
    ordering = ('username',)
    formfield_overrides = {
        dj_db_models.ManyToManyField: {'widget': CheckboxSelectMultiple},
    }


admin.site.unregister(Group)
admin.site.register(models.CustomUser, CustomUserAdmin)
