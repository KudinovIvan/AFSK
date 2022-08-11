# pull official base image
FROM python:3.9.1-alpine

# set work directory
WORKDIR /usr/src/afskspb/

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH /usr/src/afskspb/

RUN apk update && apk add postgresql-dev gcc python3-dev musl-dev libressl-dev libffi-dev build-base jpeg-dev zlib-dev

# install dependencies
RUN pip3 install --upgrade pip

# copy project
COPY . .

RUN pip3 install -r requirements.txt

# run entrypoint.sh
#ENTRYPOINT ["/usr/src/afskspb/Dockerfiles/backend/enterypoint.sh"]
