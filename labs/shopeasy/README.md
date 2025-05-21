## Building the ShopEasy app from scratch:

- To develop the sample application from scratch, follow the instructions in [Build App](BuildApp.md)
  
## Running with Docker

Alternatively, you can run the application with Docker if you sourced the files from git as follows:

## Running with Docker

### Prerequisites
- Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/).

### Instructions
1. Clone the repository:
   ```bash
   git clone <this-repository>
   cd ShopEasy
   ```

2. Start the application:
  ```bash
    docker-compose up --build
  ```
  - The --build flag ensures images are built fresh.

3. Access the application
  - Frontend: `http://localhost:8080`
  - Backend API: `http://localhost:5000`

4. Stop the application
  - Press `Ctr + C` in the terminal, then run
  - `docker-compose down`
  

Notes

The database is automatically initialized with the database.sql script.
If the backend fails to connect to the database initially, restart it with:

```bash
docker-compose restart backend
```


---

### Additional Considerations

- **CORS**: Ensure the Flask app has `CORS(app)` (from `flask_cors`) to allow requests from `http://localhost:8080`. This is typically included by default in Flask setups with CORS enabled.
- **Startup Order**: The backend might start before the database is ready. For simplicity, students can restart the backend if needed. A more robust solution (e.g., a wait script) is omitted for educational purposes.
- **Port Conflicts**: If ports 8080 or 5000 are in use, students can modify the `ports` mappings in `docker-compose.yml` (e.g., `"8081:80"`).

