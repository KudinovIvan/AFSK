from django.db import models


class UrlsModel(models.Model):
    name = models.TextField(null=True, verbose_name="Название")
    priority = models.IntegerField(null=True, verbose_name="Порядок")
    url = models.TextField(null=True, verbose_name='Ссылка')
    is_visible = models.BooleanField(null=True, verbose_name='Отображать')

    class Meta:
        verbose_name = 'ссылка'
        verbose_name_plural = 'ссылки'
        ordering = ('priority',)

    def __str__(self):
        return "%s - Приоритет: %s" % (self.name, self.priority)


class TargetsModel(models.Model):
    target_id = models.TextField(verbose_name="Id метки")
    timestamp = models.DateTimeField(verbose_name="Время создания метрики")
    dx = models.FloatField(verbose_name="Отклонение по оси x")
    dy = models.FloatField(verbose_name="Отклонение по оси y")
    skox = models.FloatField(verbose_name="Крен по оси x")
    skoy = models.FloatField(verbose_name="Крен по оси y")

    class Meta:
        verbose_name = 'метка'
        verbose_name_plural = 'метки'
        ordering = ('timestamp',)

    def __str__(self):
        return "%s" % self.target_id
