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