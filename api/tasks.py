from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from celery import shared_task
from celery.utils.log import get_task_logger

from datetime import datetime
import csv
from io import StringIO

from api.models import TargetsModel
from users.models import CustomUser


logger = get_task_logger(__name__)

def get_now_date():
    now = datetime.now().replace(microsecond=0)
    return now.date()

@shared_task
def send_mailing():
    _date = get_now_date()
    targets = TargetsModel.objects.filter(timestamp__date__month=_date.month-1).order_by('target_id')
    csvfile_1 = StringIO()
    csvwriter_1 = csv.writer(csvfile_1)
    csvfile_2 = StringIO()
    csvwriter_2 = csv.writer(csvfile_2)
    csvfile_3 = StringIO()
    csvwriter_3 = csv.writer(csvfile_3)
    csvfile_4 = StringIO()
    csvwriter_4 = csv.writer(csvfile_4)
    csvfile_5 = StringIO()
    csvwriter_5 = csv.writer(csvfile_5)
    csvfile_6 = StringIO()
    csvwriter_6 = csv.writer(csvfile_6)
    csvwriter_1.writerow(
        ['Id метки', 'Время создания метрики', 'Смещение по Оси X', 'Смещение по Оси Y', 'СКО по Оси X', 'СКО по Оси Y']
    )
    csvwriter_2.writerow(
        ['Id метки', 'Время создания метрики', 'Смещение по Оси X', 'Смещение по Оси Y', 'СКО по Оси X', 'СКО по Оси Y']
    )
    csvwriter_3.writerow(
        ['Id метки', 'Время создания метрики', 'Смещение по Оси X', 'Смещение по Оси Y', 'СКО по Оси X', 'СКО по Оси Y']
    )
    csvwriter_4.writerow(
        ['Id метки', 'Время создания метрики', 'Смещение по Оси X', 'Смещение по Оси Y', 'СКО по Оси X', 'СКО по Оси Y']
    )
    csvwriter_5.writerow(
        ['Id метки', 'Время создания метрики', 'Смещение по Оси X', 'Смещение по Оси Y', 'СКО по Оси X', 'СКО по Оси Y']
    )
    csvwriter_6.writerow(
        ['Id метки', 'Время создания метрики', 'Смещение по Оси X', 'Смещение по Оси Y', 'СКО по Оси X', 'СКО по Оси Y']
    )
    for target in targets:
        if target.target_id == '1':
            csvwriter = csvwriter_1
        elif target.target_id == '2':
            csvwriter = csvwriter_2
        elif target.target_id == '3':
            csvwriter = csvwriter_3
        elif target.target_id == '4':
            csvwriter = csvwriter_4
        elif target.target_id == '5':
            csvwriter = csvwriter_5
        else:
            csvwriter = csvwriter_6
        csvwriter.writerow(
            [target.target_id, target.timestamp, target.dx, target.dy, target.skox, target.skoy]
        )
    subject = "Monitoring AFSK"
    emails = CustomUser.objects.filter(mailing=True).values_list('email', flat=True)
    msg = EmailMultiAlternatives(subject, "Mailing", "monitoring.afsk@gmail.com", emails)
    msg.attach('target_id_1.csv', csvfile_1.getvalue(), 'text/csv')
    msg.attach('target_id_2.csv', csvfile_2.getvalue(), 'text/csv')
    msg.attach('target_id_3.csv', csvfile_3.getvalue(), 'text/csv')
    msg.attach('target_id_4.csv', csvfile_4.getvalue(), 'text/csv')
    msg.attach('target_id_5.csv', csvfile_5.getvalue(), 'text/csv')
    msg.attach('target_id_6.csv', csvfile_6.getvalue(), 'text/csv')
    msg.send()
