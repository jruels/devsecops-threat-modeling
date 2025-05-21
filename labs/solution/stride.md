## Applying Threat Modeling to "ShopEasy"
In this step, you'll apply the STRIDE framework to identify potential threats in "ShopEasy."

### Instructions
1. **Identify Assets**:
   - User data (e.g., usernames, passwords)
   - Payment information (e.g., credit card details)
   - Product database
2. **Brainstorm Threats Using STRIDE**:
   - **Spoofing**: Could an attacker impersonate a user to make unauthorized purchases?
   - **Tampering**: Could an attacker modify product prices or order details?
   - **Repudiation**: Could a user deny making a purchase?
   - **Information Disclosure**: Could sensitive data (e.g., credit card info) be exposed?
   - **Denial of Service**: Could the application be overwhelmed to make it unavailable?
   - **Elevation of Privilege**: Could a user gain admin access?
3. **Document Threats**:
   - Create a list of potential threats for each STRIDE category, noting where they might occur in the application.

**Example**:
- **Threat**: SQL injection in the login form (Tampering).
- **Vulnerability**: Unsanitized user inputs in database queries.

**Why It Matters**: This exercise helps you systematically uncover security risks, thinking critically about the application's weaknesses.

---

### Security Analysis:

#### **Spoofing:**
Yes, an attacker could impersonate a user to make unauthorized purchases. The login endpoint (`/api/login`) uses plaintext username and password without hashing or encryption. Additionally, there is no session management or token-based authentication (e.g., JWT), making it easy for attackers to spoof users.

#### **Tampering:**
Yes, an attacker could modify product prices or order details. The application does not validate or sanitize inputs properly, and SQL queries are vulnerable to SQL injection (e.g., in the `login` and `add_comment` endpoints). This could allow attackers to manipulate the database, including altering product prices.

#### **Repudiation:**
Yes, a user could deny making a purchase. There is no mechanism to log or track user actions securely (e.g., no audit logs or signed transactions). This makes it difficult to prove that a specific user performed an action.

#### **Information Disclosure:**
Yes, sensitive data could be exposed. The application does not use HTTPS, meaning data (e.g., login credentials) is transmitted in plaintext. Additionally, the database connection credentials (`root`/`password`) are hardcoded in the backend, which could be leaked if the source code is exposed.

#### **Denial of Service:**
Yes, the application could be overwhelmed. There are no rate-limiting or throttling mechanisms in place for API endpoints, making it susceptible to brute force or DoS attacks.

#### **Elevation of Privilege:**
Yes, a user could gain admin access. The SQL injection vulnerability in the `login` endpoint could allow attackers to bypass authentication and gain unauthorized access, potentially as an admin if the database is not properly secured.

### Recommendations:
1. **Spoofing:** Implement token-based authentication (e.g., JWT) and enforce HTTPS for secure communication.
2. **Tampering:** Use parameterized queries or ORM to prevent SQL injection.
3. **Repudiation:** Add logging and audit trails for user actions.
4. **Information Disclosure:** Use environment variables for sensitive credentials and enforce HTTPS.
5. **Denial of Service:** Implement rate-limiting and input validation. For Flask API you can use the flask-limiter package, or if using Azure - API Management Service, AWS API Gateway
6. **Elevation of Privilege:** Harden authentication mechanisms and sanitize all inputs.