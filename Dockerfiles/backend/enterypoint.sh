#!/bin/sh


echo "Waiting for postgres..."

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.1
done

echo "PostgreSQL started"

echo "yes" | python3 manage.py collectstatic

if [ $IS_FIRST_RUN = '1' ]
then
    python3 manage.py flush --no-input
    python3 manage.py migrate
    python3 manage.py createsuperuserwithpassword --username "$DJ_SUPERUSER_NAME" --password "$DJ_SUPERUSER_PASSWORD" --preserve
fi

exec "$@"