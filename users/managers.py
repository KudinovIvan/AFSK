from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import ugettext_lazy as _
import unicodedata


class UserInstanceCreationAdapter:
    def __init__(self, default_field_values: dict, username: str, password: str, extra_fields: dict, model):
        self.default_field_values = default_field_values
        self.username = username
        self.password = password
        self.extra_fields = extra_fields
        self.model = model
        self.user_instance = None

    def normalize_username(self):
        self.username = unicodedata.normalize('NFKC', self.username)

    def check_username_exist(self):
        if not self.username:
            raise ValueError(_('The Username must be set'))

    def set_defaults(self):
        for key, value in self.default_field_values.items():
            self.extra_fields.setdefault(key, value)

    def create_object(self):
        self.user_instance = self.model(username=self.username, **self.extra_fields)
        self.user_instance.set_password(self.password)
        self.user_instance.save()

    def register(self):
        self.check_username_exist()
        self.normalize_username()
        self.set_defaults()
        self.create_object()
        return self.user_instance


class CustomUserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        user_obj = UserInstanceCreationAdapter(username=username,
                                               password=password,
                                               model=self.model,
                                               extra_fields=extra_fields,
                                               default_field_values={'is_superuser': False,
                                                                     'is_staff': False})
        return user_obj.register()

    def create_superuser(self, username, password, **extra_fields):
        user_obj = UserInstanceCreationAdapter(username=username,
                                               password=password,
                                               extra_fields=extra_fields,
                                               model=self.model,
                                               default_field_values={'is_superuser': True,
                                                                     'is_staff': True})
        return user_obj.register()
