## Conducting Risk Assessment
Risk assessment involves evaluating the likelihood and impact of each identified threat to prioritize them effectively.

### Instructions
1. **Define Likelihood and Impact Scales**:
   - **Likelihood**: 
     - Low: Unlikely to occur.
     - Medium: Possible but not frequent.
     - High: Likely to occur frequently.
   - **Impact**:
     - Low: Minimal damage.
     - Medium: Moderate damage.
     - High: Severe damage.
2. **Assess Each Threat**:
   - For each threat, assign a likelihood and impact based on the application's context.
   - **Example**:
     - **SQL Injection (Tampering)**: Likelihood = High, Impact = High.
     - **Weak Password Storage (Spoofing)**: Likelihood = Medium, Impact = High.
3. **Use a Risk Matrix**:
   - Plot threats on a matrix to categorize them (e.g., High Risk, Medium Risk, Low Risk).

**Risk Matrix Example**:

| Likelihood / Impact | Low Impact | Medium Impact | High Impact |
|---------------------|------------|---------------|-------------|
| **Low Likelihood**  | Low Risk   | Low Risk      | Medium Risk |
| **Medium Likelihood**| Low Risk   | Medium Risk   | High Risk   |
| **High Likelihood** | Medium Risk| High Risk     | High Risk   |

**Why It Matters**: Risk assessment helps you focus on the most critical threats, ensuring efficient use of resources.

---


#### **Threat Assessment**
| Threat                          | Likelihood | Impact | Risk Level |
|---------------------------------|------------|--------|------------|
| **SQL Injection (Tampering)**  | High       | High   | High       |
| **Weak Password Storage (Spoofing)** | Medium    | High   | High       |
| **Lack of HTTPS (Information Disclosure)** | Medium | High   | High       |
| **No Rate Limiting (DoS)**      | Medium     | High | Medium     |
| **Hardcoded Credentials (Information Disclosure)** | High | High | High       |
| **No Audit Logs (Repudiation)** | Medium     | Medium | Medium     |

### Reasoning for Each Assessment of the App

#### **Spoofing: Could an attacker impersonate a user to make unauthorized purchases?**
- **Reasoning**: The `/api/login` endpoint uses plaintext SQL queries with no parameterization, making it vulnerable to SQL injection. An attacker could exploit this to bypass authentication and impersonate a user. Additionally, there is no session management or token-based authentication, which increases the risk of spoofing.

---

#### **Tampering: Could an attacker modify product prices or order details?**
- **Reasoning**: The application does not validate or sanitize inputs in the backend. For example, the `add_comment` endpoint directly inserts user-provided data into the database without escaping or parameterizing inputs, making it vulnerable to SQL injection. This could allow attackers to tamper with product prices or order details.

---

#### **Repudiation: Could a user deny making a purchase?**
- **Reasoning**: The application lacks audit logging for critical actions such as login, purchases, or comments. Without proper logging, there is no way to track or verify user actions, allowing users to deny making a purchase.

---

#### **Information Disclosure: Could sensitive data (e.g., credit card info) be exposed?**
- **Reasoning**: The application does not enforce HTTPS, meaning sensitive data such as login credentials could be transmitted in plaintext over the network. Additionally, hardcoded database credentials (`root`/`password`) in the backend code could be exposed if the source code is leaked.

---

#### **Denial of Service: Could the application be overwhelmed to make it unavailable?**
- **Reasoning**: The application does not implement rate limiting or throttling for API endpoints. This makes it susceptible to brute force or denial-of-service (DoS) attacks, where an attacker could overwhelm the server with excessive requests.

---

#### **Elevation of Privilege: Could a user gain admin access?**
- **Reasoning**: The SQL injection vulnerability in the `/api/login` endpoint could allow attackers to bypass authentication and potentially gain admin access if the database is not properly secured. For example, an attacker could inject a payload like `' OR '1'='1` to authenticate as any user.

---

https://owasp.org/API-Security/editions/2023/en/0x11-t10/
---