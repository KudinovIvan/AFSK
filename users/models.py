from django.db import models
from django.utils.translation import ugettext_lazy as _
from users.managers import CustomUserManager
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from api.models import UrlsModel


class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        _('логин'),
        max_length=150,
        unique=True,
        help_text='Обязательное. 150 символов или меньшше. Только строки, цифры и @/./+/-/_ допустимы.',
        error_messages={
            'unique': "Пользователи с таким именем уже существуют.",
        },
    )

    middle_name = models.CharField(null=True, blank=True, verbose_name="Отчество", max_length=100, default=None)
    given_name = models.CharField(null=True, blank=True, verbose_name="Имя", max_length=100, default=None)
    family_name = models.CharField(null=True, blank=True, verbose_name="Фамилия", max_length=100, default=None)
    email = models.EmailField(null=True, blank=True, verbose_name="Адрес электронной почты", max_length=100, default=None)

    is_staff = models.BooleanField(verbose_name="администратор",
                                   help_text='Предоставляет доступ к административной панели Django',
                                   default=False)

    is_active = models.BooleanField(verbose_name="активный пользователь",
                                    help_text='Значение False запретит авторизацию данному пользователю',
                                    default=True)

    date_joined = models.DateTimeField(verbose_name="дата создания", default=timezone.now)

    links = models.ManyToManyField(UrlsModel, blank=True, default=None,
                                   related_name='users',
                                   verbose_name="ссылки",)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    class Meta:
        verbose_name = 'пользователь'
        verbose_name_plural = 'пользователи'
        ordering = ('-id',)

    def __str__(self):
        return self.username

