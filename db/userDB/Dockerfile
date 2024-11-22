FROM python:3.9-slim

WORKDIR /app

COPY ./requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

ADD . .

EXPOSE 6000

ENV PYTHONUNBUFFERED=1

CMD ["python", "stockdb:app"]
