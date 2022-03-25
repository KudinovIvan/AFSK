# AFSK
___
## Инструкция по развертыванию приложения
### 1 способ
Сначала необходимо убедиться в том, что на сервере установлены следующие пакеты:
- docker
- nginx

Копируем проект в папку /var/www/{Название домена}

Далее запускаем все контейнеры командной

**docker-compose up -d --build**

Далее необходимо подключить контейнеры к основному серверу nginx

**cd /var/www/nginx/sites-available/**

**nano {Название домена}**

Запоминаем порт, через который запускается контейнер nginx.
Вставляем в файл следующий текст:

```python
    server {
        server_name {Название домена}
        client_max_body_size 20M;
        location / {
            proxy_pass http://localhost:PORT; #Порт от nginx
        }
    }
```

Активируем сайт в nginx при помощи создания символической ссылки на созданный ранее конфиг:

**ln -s /var/www/nginx/sites-available/{Название домена} /etc/nginx/sites-enabled/**

Проверяем корректность заполнения конфига в nginx

**nginx -t**

Перезагружаем конфиги nginx

**sudo systemctl reload nginx**

Далее проверям, открывается ли проект по заданному адресу

Базу данных можно использовать как внешнюю так и в контейнере. Запуск, проведение миграций и прочее для БД в контейнере происходит автоматически.
Запуск и использование внешней БД расписано в следующем способе.

___
### 2 способ
Сначала необходимо убедиться в том, что на сервере установлены следующие пакеты:
- postgres
- python3
- screen
- nginx

В postgres необходимо будет создать собственную БД и запомнить все необходимые данные для использования
- Имя БД
- Логин
- Пароль
- Хост
- Порт

Далее передаем код проекта по ssh на сервер в home/{user}/deploy.
переходим в корень проекта и создаем виртуальное окружение

**python3 -m venv venv**

Далее активируем его

**source venv/bin/activate**

Теперь необходимо подключить свою БД к проекту. Для этого редактируем файл afskpb/settings.py

```python
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql_psycopg2',
            'NAME': os.environ.get("DB_NAME", "db_name"),
            'USER': os.environ.get("DB_USER", "db_user"),
            'PASSWORD': os.environ.get("DB_PASSWORD", "db_password"),
            'HOST': os.environ.get("DB_HOST",  "localhost"),
            'PORT': os.environ.get("DB_PORT", "5432"),
        }
    }
```
Вписываем в поля NAME, USER, PASSWORD, HOST, PORT данные от БД, которые были сохранены ранее

Далее загружаем все необходимые библиотеки в виртуальное окружение

**pip3 install -r requirements.txt**

Далее проводим миграции 

**python3 manage.py migrate**

Создаем суперпользователя

**python3 manage.py createsuperuser**

Создаем screen для запуска проекта

**screen -S name-of-screen**

Подключаемся к нему

**screen -r name-of-screen**

И запускаем проект

**python3 manage.py runserver**

Для того, чтобы подключить все к nginx необходимо отредактировать файл /etc/nginx/conf.d/default.conf

В location прописываем proxy_pass следующим образом

```python
    location / {
        proxy_pass      http://127.0.0.1:8000;
    }
```

