
FROM python:3.11.14

WORKDIR /app

COPY ./requirements.txt /app/requirements.txt


RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt


COPY . /app


CMD ["python", "api/main.py"]