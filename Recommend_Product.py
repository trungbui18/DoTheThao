import mysql.connector
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np

# Kết nối Database
def get_data_from_db():
    connection = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="kt_store"
    )
    cursor = connection.cursor(dictionary=True)

    # Lấy lịch sử mua hàng
    cursor.execute("""
        SELECT orders.user_id, order_details.product_id 
        FROM order_details 
        JOIN orders ON order_details.order_id = orders.id
    """)
    orders = cursor.fetchall()

    # Lấy danh sách sản phẩm
    cursor.execute("SELECT * FROM product")
    products = cursor.fetchall()

    cursor.close()
    connection.close()
    
    return products, orders

# Load dữ liệu
products, orders = get_data_from_db()
df = pd.DataFrame(products)
df_orders = pd.DataFrame(orders)

# 🔹 1. Content-Based Filtering (CBF)
if not df.empty:
    df["content"] = df["id_category"].astype(str) + " " + df["description"]
    vectorizer = TfidfVectorizer(stop_words="english")
    tfidf_matrix = vectorizer.fit_transform(df["content"])
    cosine_sim_cbf = cosine_similarity(tfidf_matrix, tfidf_matrix)
else:
    cosine_sim_cbf = np.array([])

def get_cbf_recommendations(product_id):
    """Gợi ý theo Content-Based Filtering"""
    if df.empty or product_id not in df["id"].values:
        return []
    
    idx = df[df["id"] == product_id].index
    if len(idx) == 0:
        return []
    
    idx = idx[0]
    sim_scores = list(enumerate(cosine_sim_cbf[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = [score for score in sim_scores if df.iloc[score[0]]["id"] != product_id]
    sim_scores = sim_scores[:4]
    product_indices = [i[0] for i in sim_scores]
    
    return [int(df.iloc[i]["id"]) for i in product_indices]  # Đảm bảo kiểu `int`

# 🔹 2. Collaborative Filtering (CF)
if not df_orders.empty:
    user_item_matrix = df_orders.pivot_table(index='user_id', columns='product_id', aggfunc='size', fill_value=0)
else:
    user_item_matrix = pd.DataFrame()
def get_cf_recommendations(product_id):
    """Gợi ý theo Collaborative Filtering (CF)"""
    # Load lại dữ liệu từ database
    _, orders = get_data_from_db()  
    df_orders = pd.DataFrame(orders)

    # Tạo lại user-item matrix
    if not df_orders.empty:
        user_item_matrix = df_orders.pivot_table(index='user_id', columns='product_id', aggfunc='size', fill_value=0)
    else:
        return []

    if product_id not in user_item_matrix.columns:
        return []

    product_vector = user_item_matrix[product_id].values.reshape(1, -1)
    cosine_sim_cf = cosine_similarity(product_vector, user_item_matrix.T)
    
    sim_scores = list(enumerate(cosine_sim_cf[0]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = [score for score in sim_scores if user_item_matrix.columns[score[0]] != product_id]
    sim_scores = sim_scores[:4]
    
    product_indices = [int(user_item_matrix.columns[i[0]]) for i in sim_scores]  
    return product_indices

# 🔹 3. Hybrid Recommendation System
def get_hybrid_recommendations(product_id):
    """Kết hợp CBF + CF"""
    cbf_recs = get_cbf_recommendations(product_id)
    cf_recs = get_cf_recommendations(product_id)

    # Gộp và cho điểm
    recommendations = {}
    for p in cbf_recs:
        recommendations[p] = recommendations.get(p, 0) + 0.2
    for p in cf_recs:
        recommendations[p] = recommendations.get(p, 0) + 0.8  # Trọng số CF
    
    sorted_recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)

    return [p[0] for p in sorted_recommendations[:4]]
# 🔹 API Flask
app = Flask(__name__)

@app.route('/recommend', methods=['GET'])
def recommend():
    try:
        product_id = int(request.args.get('id'))
        recommendations = get_hybrid_recommendations(product_id)
        return jsonify([int(p) for p in recommendations])  # Đảm bảo kiểu `int`
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5000, debug=True)
