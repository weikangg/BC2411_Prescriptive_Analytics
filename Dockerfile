# Use Python 3.12 slim image as the base
FROM python:3.12-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      python3-dev \
      libevdev-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
WORKDIR /app

# Copy the requirements file from the root directory
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend_server folder (which holds your FastAPI app code)
COPY backend_server ./backend_server

# Change working directory to backend_server
WORKDIR /app/backend_server

# Expose the port on which FastAPI will run
EXPOSE 8000

# Start the FastAPI application using uvicorn.
# Note: Remove --reload for production deployments.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
