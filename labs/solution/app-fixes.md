## Hands-On Exercise: Securing the Login Functionality
Apply your knowledge by securing the login functionality against SQL injection.

### Instructions
1. **Locate the Vulnerable Code**:
   - In `backend/app.py`, find the login endpoint using string concatenation for SQL queries.
2. **Modify the Code**:
   - Replace the vulnerable query with a parameterized query.
   - **Example**:
     ```python
     cursor.execute("SELECT * FROM users WHERE username = %s AND password = %s", (username, password))
     ```
3. **Test the Fix**:
   - Attempt an SQL injection attack (e.g., `' OR '1'='1`) to verify that it no longer works.


To secure the frontend code for the "ShopEasy" application, we need to address several vulnerabilities present in the provided code. Below, I’ll outline the identified issues and provide a fully updated version of the code with fixes applied.

---

### Identified Vulnerabilities
1. **Cross-Site Scripting (XSS)**:
   - The use of `dangerouslySetInnerHTML={{ __html: c }}` to render comments allows malicious scripts to execute if a comment contains JavaScript code (e.g., `<script>alert('hacked')</script>`).

2. **Insecure API Calls**:
   - Hardcoded URLs like `http://localhost:5000` are used for API requests. In production, these should use HTTPS, and hardcoding makes it inflexible across environments.

3. **Lack of Input Validation**:
   - User inputs (username, password, comments) are not validated on the client-side, potentially allowing invalid or malicious data to be sent to the backend.

4. **No CSRF Protection Handling**:
   - The frontend does not account for Cross-Site Request Forgery (CSRF) tokens, which could leave state-changing requests (e.g., posting comments) vulnerable if the backend requires them.

---

### Fixes Applied
Here’s how we’ll address each vulnerability:

#### 1. Mitigate XSS
- **Solution**: Replace `dangerouslySetInnerHTML` with a sanitized approach using the `DOMPurify` library to remove malicious HTML/JavaScript from comments.
- **Implementation**: Install `dompurify` (`npm install dompurify`) and use it to sanitize comments before rendering.

#### 2. Secure API Calls
- **Solution**: Use environment variables to make API URLs configurable and ensure HTTPS in production.
- **Implementation**: Define an `API_URL` constant using `process.env.REACT_APP_API_URL`, defaulting to `http://localhost:5000` for development.

#### 3. Implement Input Validation
- **Solution**: Add client-side validation for username, password, and comments to enforce minimum and maximum length constraints.
- **Implementation**: Create a `validateInput` function and use it before submitting data.

#### 4. Handle CSRF Tokens
- **Solution**: Configure Axios to send credentials (e.g., cookies containing CSRF tokens) with requests, assuming the backend provides such tokens.
- **Implementation**: Set `axios.defaults.withCredentials = true`.

---

### Updated Code
Below is the secured version of `App.js`:

```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import DOMPurify from 'dompurify';

// Enable credentials for CSRF token support
axios.defaults.withCredentials = true;

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [productComments, setProductComments] = useState({});

  // Configurable API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Input validation function
  const validateInput = (input, minLength, maxLength) => {
    return input.length >= minLength && input.length <= maxLength;
  };

  const getProducts = () => {
    axios.get(`${API_URL}/api/products`)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Validate username (3-50 chars) and password (6-50 chars)
    if (!validateInput(username, 3, 50) || !validateInput(password, 6, 50)) {
      alert('Username must be 3-50 characters and password 6-50 characters');
      return;
    }
    axios.post(`${API_URL}/api/login`, { username, password })
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

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const postComment = (productId) => {
    const comment = productComments[productId] || '';
    // Validate comment (1-200 chars)
    if (!validateInput(comment, 1, 200)) {
      alert('Comment must be between 1 and 200 characters');
      return;
    }
    axios.post(`${API_URL}/api/comment`, { productId, comment })
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
                    <p key={idx} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c) }} />
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

---

### Explanation of Changes
1. **XSS Mitigation**:
   - Added `DOMPurify` to sanitize comments, ensuring no malicious scripts can execute. Replace `<p dangerouslySetInnerHTML={{ __html: c }} />` with `<p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c) }} />`.

2. **Secure API Calls**:
   - Introduced `API_URL` using `process.env.REACT_APP_API_URL`. To use this, create a `.env` file with `REACT_APP_API_URL=http://localhost:5000` for development. In production, update it to an HTTPS endpoint (e.g., `https://api.shopeasy.com`).

3. **Input Validation**:
   - Added `validateInput` to enforce:
     - Username: 3-50 characters
     - Password: 6-50 characters
     - Comments: 1-200 characters
   - Validation occurs before API calls, with alerts for invalid input.

4. **CSRF Handling**:
   - Set `axios.defaults.withCredentials = true` to include cookies (potentially CSRF tokens) in requests. This assumes the backend provides and validates CSRF tokens.

---

### Additional Steps
- **Install DOMPurify**: Run `npm install dompurify` to use the sanitization library.
- **Environment Variables**: Create a `.env` file in your project root with `REACT_APP_API_URL=http://localhost:5000` for development.
- **Production Deployment**: Ensure the backend uses HTTPS and update `REACT_APP_API_URL` accordingly.

This updated code addresses the key vulnerabilities, making the "ShopEasy" frontend more secure while maintaining its functionality.


---

## Review and Discussion
Reflect on the exercise and share insights with your peers.

### Instructions
1. **Discuss Challenges**:
   - What difficulties did you encounter while securing the login functionality?
2. **Share Solutions**:
   - How did you implement the fix? Were there alternative approaches?
3. **Highlight Continuous Improvement**:
   - Emphasize that security is an ongoing process requiring regular updates and assessments.

