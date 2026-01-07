from flask import Blueprint, request, jsonify
from models import db, User
import uuid

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password') # In real app, verify password hash

    user = User.query.filter_by(email=email).first()
    
    # For hackathon, simple bypass or check
    if not user:
         # Auto-register if not found for easy testing? Or just return error.
         # Let's return error to be proper, seed data will have users.
         return jsonify({'error': 'Invalid credentials'}), 401
    
    # Generate a fake token (JWT in real app)
    token = f"fake-jwt-token-for-{user.id}"
    
    return jsonify({
        'token': token,
        'user': user.to_dict()
    })

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    # In real app, parse token from header
    # For now, just return a hardcoded user or the one from 'Authorization' header if we were parsing it
    # Let's assume the frontend sends a custom header for now, or just return the first admin user
    
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer fake-jwt-token-for-'):
        user_id = auth_header.replace('Bearer fake-jwt-token-for-', '')
        user = User.query.get(user_id)
        if user:
            return jsonify({'user': user.to_dict()})
            
    # Fallback for testing if no header
    # user = User.query.first()
    # if user:
    #      return jsonify({'user': user.to_dict()})

    return jsonify({'error': 'Unauthorized'}), 401



@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'})
