import os
from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for React front-end

db_host = os.getenv('DB_HOST', 'localhost')
db = mysql.connector.connect(
    host=db_host,
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
    query = (f"SELECT * FROM users "
             f"WHERE username = '{username}' "
             f"AND password = '{password}'")
    print(query)

    cursor.execute(query)
    rows = cursor.fetchall()      # fetch *all* rows, no unread data
    cursor.close()

    user = rows[0] if rows else None
    return jsonify({"success": bool(user)})

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