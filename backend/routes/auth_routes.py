from flask import Blueprint, request, jsonify
from models import db, User, Agency
import uuid

auth_bp = Blueprint('auth', __name__)

# hardcoded FedEx admin credentials
FEDEX_ADMIN = {
    'email': 'admin@fedex.com',
    'password': 'fedex123',
    'id': 'fedex-admin-001',
    'name': 'John Smith',
    'role': 'fedex'
}

# temporary in-memory session store for demo purposes
active_sessions = {}

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # check creds
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    # if fedex admin
    if email == FEDEX_ADMIN['email'] and password == FEDEX_ADMIN['password']:
        token = f"session-{uuid.uuid4()}"
        
        active_sessions[token] = {
            'id': FEDEX_ADMIN['id'],
            'email': FEDEX_ADMIN['email'],
            'name': FEDEX_ADMIN['name'],
            'role': FEDEX_ADMIN['role']
        }
        
        return jsonify({
            'token': token,
            'user': {
                'id': FEDEX_ADMIN['id'],
                'email': FEDEX_ADMIN['email'],
                'name': FEDEX_ADMIN['name'],
                'role': FEDEX_ADMIN['role']
            }
        })
    
    # else, check agency employee
    agency = Agency.query.filter_by(email=email).first()
    
    if not agency:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # using simple password check for demo (in production, use proper hashing)
    # Password format: dca@<agency_id>
    expected_password = f'dca@{agency.id}'
    if password != expected_password:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # token generation
    token = f"session-{uuid.uuid4()}"
    
    # store session
    active_sessions[token] = {
        'id': agency.id,
        'email': email,
        'name': agency.name,
        'role': 'agency',
        'agencyId': agency.id,
        'agencyName': agency.name
    }
    
    return jsonify({
        'token': token,
        'user': {
            'id': agency.id,
            'email': email,
            'name': agency.name,
            'role': 'agency',
            'agencyId': agency.id,
            'agencyName': agency.name
        }
    })

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """returns the current logged in user data based on token"""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Unauthorized'}), 401
    
    token = auth_header.replace('Bearer ', '')
    user_data = active_sessions.get(token)
    if not user_data:
        return jsonify({'error': 'Invalid or expired token'}), 401
    
    return jsonify({'user': user_data})

@auth_bp.route('/logout', methods=['POST'])
def logout():
    """logs out the current user by deleting the session token"""
    auth_header = request.headers.get('Authorization')
    
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.replace('Bearer ', '')
        if token in active_sessions:
            del active_sessions[token]
    
    return jsonify({'message': 'Logged out successfully'})
