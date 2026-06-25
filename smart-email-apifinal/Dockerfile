FROM python:3.9.18-slim

WORKDIR /app

# Copy repo
COPY . /app

# Set working directory to smart-email-apifinal
WORKDIR /app/smart-email-apifinal

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Start command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]