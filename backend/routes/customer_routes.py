from flask import Blueprint, request, jsonify
from models import db, Customer, Case

customers_bp = Blueprint('customers', __name__)

@customers_bp.route('', methods=['GET'])
def get_customers():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    search = request.args.get('search', '')
    
    query = Customer.query
    if search:
        query = query.filter(Customer.name.ilike(f'%{search}%'))
        
    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'customers': [c.to_dict() for c in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@customers_bp.route('/<customer_id>', methods=['GET'])
def get_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    return jsonify(customer.to_dict())

@customers_bp.route('/<customer_id>/cases', methods=['GET'])
def get_customer_cases(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
        
    # In our model, Case links to Customer via customer_id (if we added that foreign key), 
    # but initially we only had customer_name strings in mock data. 
    # The Case model in models.py has customer_id now.
    
    cases = Case.query.filter_by(customer_id=customer_id).all()
    return jsonify([c.to_dict() for c in cases])
