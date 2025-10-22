
FROM python:3.11.14

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt


COPY ./ /code/api


CMD ["python", "api/main.py"]