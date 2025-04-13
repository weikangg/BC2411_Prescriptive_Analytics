# Use the official Gurobi Python reference image (which already includes Gurobi & WLS support)
FROM gurobi/python:12.0.1_3.12

# Install kernel headers and other system packages for building evdev
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      python3-dev \
      libevdev-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Remove any pre-installed license file if present.
RUN rm -f /opt/gurobi/gurobi.lic

# Accept Gurobi license as a build argument
ARG GUROBI_LIC

# Create license directory
RUN mkdir -p /opt/gurobi

# Inject the license file using a here document to handle multiline
RUN printf "%s\n" "$GUROBI_LIC" > /opt/gurobi/gurobi.lic

# Set environment variable for Gurobi
ENV GRB_CLIENT_LOG=3

# Set the working directory
WORKDIR /app

# Copy the application dependencies file
COPY requirements.txt /app/requirements.txt

# Install your application's Python dependencies
RUN pip install -r requirements.txt

# Copy your FastAPI application code (adjust the paths as needed)
COPY backend_server /app/backend_server

# Set working directory to where your FastAPI app is located
WORKDIR /app/backend_server

# Expose the port on which your FastAPI app runs
EXPOSE 8000

# Start the FastAPI application
CMD ["sh", "-c", "python license_test.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
