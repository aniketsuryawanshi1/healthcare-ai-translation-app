FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install required system packages including tzdata
RUN apt-get update && apt-get install -y \
    gcc \
    libmariadb-dev \
    libmariadb-dev-compat \
    pkg-config \
    tzdata \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app/

# Run model download during build
RUN python download_model.py


RUN chmod +x manage.py
RUN python manage.py collectstatic --noinput || true

# Use Daphne for WebSocket support
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "healthcare_ai_translation.asgi:application"]
