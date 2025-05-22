FROM python:3.8-slim

WORKDIR /app

# Upgrade pip to the latest version
RUN pip install --no-cache-dir --upgrade pip

# Copy and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt --no-use-pep517

# Copy the wait_for_db.py script explicitly
COPY wait-for-it.py /app/wait_for_db.py

# Copy other application files
COPY . .

# Ensure the wait_for_db.py script is executable
RUN chmod +x wait_for_db.py

# Update the CMD to use the wait_for_db.py script
CMD ["sh", "-c", "python wait_for_db.py db 3306 && python app.py"]