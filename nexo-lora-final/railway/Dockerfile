# API Luxio - para Render (desde PC sin GitHub)
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

# Render inyecta PORT; main.py usa os.getenv("PORT", 8000)
EXPOSE 8080

CMD ["python", "main.py"]
