from flask import Blueprint, request, jsonify, g
from models import db, Customer, Case

customers_bp = Blueprint('customers', __name__)

@customers_bp.route('', methods=['GET'])
def get_customers():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    search = request.args.get('search', '')
    agency_id = request.args.get('agency_id', None)  # Filter by agency
    
    query = Customer.query
    
    if agency_id:
        # Get customers who have cases assigned to this agency
        query = query.join(Case, customer.customer_account_number == Case.customer_account_number).filter(
            Case.assigned_agency_id == agency_id
        ).distinct()

    if search:
        query = query.filter(
            db.or_(
                Customer.customer_name.ilike(f'%{search}%'),
                Customer.customer_email.ilike(f'%{search}%'),
                Customer.account_number.ilike(f'%{search}%')
            )
        )
        
    pagination = query.paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        'customers': [c.to_dict() for c in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@customers_bp.route('/<customer_account_number>', methods=['GET'])
def get_customer(customer_account_number):
    customer = Customer.query.get(customer_account_number)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
    return jsonify(customer.to_dict())

@customers_bp.route('/<customer_account_number>/cases', methods=['GET'])
def get_customer_cases(customer_account_number):
    customer = Customer.query.get(customer_account_number)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404
        
    # TODO - need to update to match the current model
    
    cases = Case.query.filter_by(customer_account_number=customer_account_number).all()
    return jsonify([c.to_dict() for c in cases])
