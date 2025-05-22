import socket
import time
import sys

host = sys.argv[1]
port = int(sys.argv[2])

while True:
    try:
        with socket.create_connection((host, port), timeout=5):
            print(f"Database is ready at {host}:{port}")
            break
    except (socket.timeout, ConnectionRefusedError):
        print(f"Waiting for database at {host}:{port}...")
        time.sleep(1)