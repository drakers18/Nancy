# Use a Python base image
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app
COPY .env /app/.env
# Copy the backend code to the container
COPY . .

ENV PYTHONUNBUFFERED=1

# Install dependencies
RUN pip install -r requirements.txt

# Expose port 5000 for the Flask app
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "main.py"]
