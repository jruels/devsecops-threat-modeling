### Prerequisites for ShopEasy

To install, develop, and build the "ShopEasy" application, which features a React front-end and a Python Flask back-end with a MySQL database, ensure you have the following software and configurations in place:

#### Software Prerequisites
- **Node.js (version 14.x or later)**  
  Required to run and build the React-based front-end of the application.
- **npm (version 6.x or later)**  
  Used to manage and install front-end dependencies, such as React, Reactstrap, and Axios.
- **Python (version 3.8 or later)**  
  Necessary to run the Flask back-end.
- **pip**  
  The Python package installer, used to install back-end dependencies (typically included with Python).
- **MySQL (version 8.0 or later)**  
  The database system used by the app, which must be installed and running on `localhost`.
- **A code editor (e.g., Visual Studio Code)**  
  Recommended for writing and editing the application code.
- **Git (optional)**  
  Useful for version control, though not required for basic setup.

#### Additional Setup Requirements
- **Database Configuration**:  
  - Configure MySQL with a user `"root"` and password `"password"`.  
  - Create the "shopeasy" database by running the provided `database.sql` script to set up the necessary tables.
- **Front-End Dependencies**:  
  - Navigate to the `frontend` directory and run `npm install` to install all required packages as specified in `package.json`.
- **Back-End Dependencies**:  
  - Navigate to the `backend` directory and run `pip install -r requirements.txt` to install required Python packages, including Flask, mysql-connector-python, and flask-cors.

#### Building the Application
- **Front-End**:  
  - In the `frontend` directory, run `npm run build` to generate a production-ready build of the React application.
- **Back-End**:  
  - No separate build step is needed for the Flask back-end; ensure all dependencies are installed via `pip install -r requirements.txt` to prepare it for execution.

These prerequisites ensure you have the necessary tools and configurations to install the dependencies, develop the codebase, and build the "ShopEasy" application effectively. The app should work on Windows, macOS, or Linux, provided the listed software is installed correctly for your operating system.

## Project Structure

The application is organized as follows:

ShopEasy/
├── frontend/               # React front-end
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── index.js       # React entry point
│   └── package.json       # Front-end dependencies
├── backend/                # Flask back-end
│   ├── app.py             # Flask server
│   └── requirements.txt   # Back-end dependencies
├── database.sql            # MySQL schema and initial data
└── README.md              # Instructions

## Front-End: React with Reactstrap

`frontend/package.json`

First, set up the React project dependencies, including Reactstrap for the UI.

```json
{
  "name": "shopeasy-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "axios": "^1.6.0",
    "bootstrap": "^5.3.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "reactstrap": "^9.2.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build"
  },
  "proxy": "http://localhost:5000"
}
```

Open a terminal window in the root `ShopEasy` directory and run `npx create-react-app frontend` to initialize the project, then install additional dependencies with:

```bash
cd frontend
npm install axios bootstrap reactstrap
```

In the frontend directory you will find:

`frontend/src/index.js`

The entry point for the React application, importing Bootstrap CSS. Replace the file contents with the following code:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for Reactstrap

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

`frontend/src/App.js`

The main component handles user login, product listing, and cart functionality
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle, CardText } from 'reactstrap';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [productComments, setProductComments] = useState({});

  const getProducts = () => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }
  // Fetch products on load
  useEffect(() => {
   getProducts();
  }, []);

  // Handle login 
  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/login', { username, password })
      .then(response => {
        if (response.data.success) {
          setLoggedIn(true);
          getProducts();
        } else {
          alert('Login failed');
        }
      })
      .catch(error => console.error('Login error:', error));
  };

  // Add to cart
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Post comment
  const postComment = (productId) => {
    const comment = productComments[productId] || '';
    axios.post('http://localhost:5000/api/comment', { productId, comment })
      .then(response => {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, comments: [...(p.comments || []), comment] } : p
        ));
        setProductComments(prev => ({ ...prev, [productId]: '' }));
      })
      .catch(error => console.error('Comment error:', error));
  };

  if (!loggedIn) {
    return (
      <Container className="mt-5">
        <h2>ShopEasy Login</h2>
        <Form onSubmit={handleLogin}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <Button color="primary" type="submit">Login</Button>
        </Form>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>ShopEasy</h2>
      <Row>
        {products.map(product => (
          <Col sm="4" key={product.id} className="mb-4">
            <Card>
              <CardBody>
                <CardTitle tag="h5">{product.name}</CardTitle>
                <CardText>${product.price}</CardText>
                <Button color="success" onClick={() => addToCart(product)}>Add to Cart</Button>
                <div>
                  <h6>Comments:</h6>
                  {(product.comments || []).map((c, idx) => (
                    <p key={idx} dangerouslySetInnerHTML={{ __html: c }} /> 
                  ))}
                  <Input
                    type="text"
                    value={productComments[product.id] || ''}
                    onChange={(e) => setProductComments(prev => ({ ...prev, [product.id]: e.target.value }))}
                    placeholder="Add a comment"
                  />
                  <Button color="primary" onClick={() => postComment(product.id)}>Post Comment</Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
      <h3>Cart ({cart.length} items)</h3>
      <ul>
        {cart.map((item, idx) => (
          <li key={idx}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </Container>
  );
}

export default App;
```

## Back-End: Python Flask

Open the root `ShopEasy` directory in a terminal and run the following command:

```bash
mkdir backend
cd backend
```

In the `backend` directory create a new file named `requirements.txt` and add the following text:

`backend/requirements.txt`

Dependencies for the Flask server and MySQL integration.

```
Flask==2.3.3
flask_cors
mysql-connector-python==8.0.33
```

Open the `backend` directory in a terminal window and run the following command to create a new virtual environment named `venv`:

```bash
pip install virtualenv
virtualenv venv
```

Activate the environment to start using it:

<b>On Windows:</b>

```bash
venv\Scripts\activate
```

<b>On macOS/Linux:</b>

```bash
source venv/bin/activate
```

After activation, your terminal prompt will change (e.g., (venv) will appear), indicating that you’re now working inside the isolated environment.

With the environment activated, install the project’s dependencies from a `requirements.txt` file (assuming it exists in the backend directory):

```bash
pip install -r requirements.txt
```

This installs all necessary packages (e.g., Flask, mysql-connector-python, flask-cors) into the isolated environment.

### Create a Flask Server

`backend/app.py`

Create a new file named `app.py` in the backend directory and paste the following code:

```python
from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React front-end

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="password",
    database="shopeasy"
)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    cursor = db.cursor()
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    cursor.execute(query)
    user = cursor.fetchone()
    cursor.close()
    
    if user:
        return jsonify({"success": True})
    return jsonify({"success": False})

@app.route('/api/products', methods=['GET'])
def get_products():
    cursor = db.cursor()
    cursor.execute("SELECT id, name, price FROM products")
    products = [{"id": row[0], "name": row[1], "price": row[2]} for row in cursor.fetchall()]
    
    for product in products:
        cursor.execute(f"SELECT comment FROM comments WHERE product_id = {product['id']}")
        product['comments'] = [row[0] for row in cursor.fetchall()]
    
    cursor.close()
    return jsonify(products)

@app.route('/api/comment', methods=['POST'])
def add_comment():
    data = request.get_json()
    product_id = data['productId']
    comment = data['comment']
    
    cursor = db.cursor()
    query = f"INSERT INTO comments (product_id, comment) VALUES ({product_id}, '{comment}')"
    cursor.execute(query)
    db.commit()
    cursor.close()
    
    return jsonify({"success": True})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
```

## Database: MySQL

The MySQL schema and initial data can be found in `ShopEasy\database.sql` file:

```sql
-- Create database
CREATE DATABASE shopeasy;
USE shopeasy;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

-- Comments table
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    comment TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Insert initial data
INSERT INTO users (username, password) VALUES
('alice', 'password123'),
('bob', 'qwerty');

INSERT INTO products (name, price) VALUES
('Laptop', 999.99),
('Headphones', 49.99),
('Mouse', 19.99);
```

### Setup the database:

After installing MySQL login from a terminal window using the following command:

```bash
mysql -u root -p
```

`NB: If you get an error saying that mysql is not a valid command after installing. Make sure you add the path to your MySQL installation to the path environment variable`

After successfully connecting to the MySQL server, run the script as follows from the shell:

```sql
SOURCE /path/to/database.sql;
```

`NB: REPLACE /path/to/database.sql with the full path to the location of database.sql`

Your command should return a result like the example below:

```
mysql> SOURCE C:\Users\student\OneDrive\Documents\DevSecOps\ShopEasy\database.sql
Query OK, 1 row affected (0.01 sec)

Database changed
Query OK, 0 rows affected (0.01 sec)

Query OK, 0 rows affected (0.01 sec)

Query OK, 0 rows affected (0.02 sec)

Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0
```

### Start the API Backend:

Open a terminal window from the root `ShopEasy/backend` directory and start the api with:

```bash
python app.py
```

**Make sure you have actived the venv environment before running the command above**

### Start the Frontend


Open a terminal window from the root `ShopEasy/frontend` directory and start the application with:

```
npm start
```

- Navigate to the frontend `ShopEasy` application. This should be at the default url `http://localhost:3000` unless port 3000 is already being used by another process.
- Login using one of the sample users:
  - user: bob, password: qwerty
  - user:alice, password: password123


