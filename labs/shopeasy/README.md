### Instructions

#### Access the lab VM 

On [this](https://github.com/jruels/devsecops-threat-modeling/tree/main) page, click the green **Code** button in the top right corner, then click **Download as zip**. Once the download is done, extract the zip file and put it somewhere you can easily access it.

### Mac/Linux

The username for SSH is 
`ubuntu`

Open a terminal and `cd` to the extracted lab directory. Inside the directory, you will see a `keys` directory. Enter it using `cd` and run the following commands.

### Set permissions on SSH key

```
chmod 600 lab.pem
```

### SSH to lab servers

```
ssh -L 8080:localhost:8080 -L 5000:localhost:5000 -i <path/to/lab.pem> ubuntu@<IP FROM SPREADSHEET> 
```

* `-L 8080:localhost:8080`: Listen on port 8080 on your local machine and forward traffic to port 8080 of the remote server.
* `-L 5000:localhost:5000`: Listen on port 5000 locally and forward it to port 5000 on the remote server.
* `-i <path/to/lab.pem>`: Use the specified private key file for authentication.
* `ubuntu@<IP FROM SPREADSHEET>`: Connect as the ubuntu user to the remote server IP address (placeholder pulled from your spreadsheet)

### Windows (PowerShell)

The username for SSH is
`ubuntu`

Open PowerShell and run the following: 

```
ssh -L 8080:localhost:8080 -L 5000:localhost:5000 -i <path/to/lab.pem> ubuntu@<IP FROM SPREADSHEET>
```

* `-L 8080:localhost:8080`: Listen on port 8080 on your local machine and forward traffic to port 8080 of the remote server.
* `-L 5000:localhost:5000`: Listen on port 5000 locally and forward it to port 5000 on the remote server.
* `-i <path/to/lab.pem>`: Use the specified private key file for authentication.
* `ubuntu@<IP FROM SPREADSHEET>`: Connect as the ubuntu user to the remote server IP address (placeholder pulled from your spreadsheet)

## Running with Docker

Run the following steps on the VM:

1. Clone the repository:
   ```bash
   git clone https://github.com/jruels/devsecops-threat-modeling
   cd devsecops-threat-modeling/shopeasy/files
   ```

2. Start the application:
  ```bash
    docker compose up --build -d
  ```
  - The `--build` flag ensures images are built fresh.

Load the application in your local browser:

1. Access the application

  - Frontend: `http://localhost:8080`
  - Backend API: `http://localhost:5000`

2. Stop the application

  - Press `Ctr + C` in the terminal, then run
  - `docker compose down`


Notes

The database is automatically initialized with the database.sql script.
If the backend fails to connect to the database initially, restart it with:

```bash
docker compose restart backend
```


---

### Additional Considerations

- **CORS**: Ensure the Flask app has `CORS(app)` (from `flask_cors`) to allow requests from `http://localhost:8080`. This is typically included by default in Flask setups with CORS enabled.
- **Startup Order**: The backend might start before the database is ready. For simplicity, students can restart the backend if needed. A more robust solution (e.g., a wait script) is omitted for educational purposes.
- **Port Conflicts**: If ports 8080 or 5000 are in use, students can modify the `ports` mappings in `docker compose.yml` (e.g., `"8081:80"`).

