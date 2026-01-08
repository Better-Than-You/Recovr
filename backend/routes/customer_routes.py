from flask import Blueprint, request, jsonify, g
from models import db, Customer, Case

customers_bp = Blueprint('customers', __name__)

@customers_bp.route('', methods=['GET'])
def get_customers():
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    search = request.args.get('search', '')
    agency_id = request.args.get('agency_id', None)  # Filter by agency
    
    # Base query joining customers with their cases
    query = db.session.query(Customer, Case.invoice_amount.label("total_owed")).join(
        Case, Customer.id == Case.customer_id
    )
    
    # Filter by agency if specified (for agency employees)
    if agency_id:
        query = query.filter(Case.assigned_agency_id == agency_id)

    if search:
        query = query.filter(Customer.name.ilike(f'%{search}%'))
    
    # Get distinct customers to avoid duplicates
    query = query.distinct(Customer.id)
        
    pagination = query.paginate(page=page, per_page=limit, error_out=False)

    # Map the results to merge the column into the dictionary
    customer_list = []
    for customer_obj, total_owed in pagination.items:
        data = customer_obj.to_dict()
        data['total_owed'] = total_owed  # Inject the new column
        customer_list.append(data)

    return jsonify({
        'customers': customer_list,
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@customers_bp.route('/<customer_id>', methods=['GET'])
def get_customer(customer_id):
    # need to add total_owed here as well
    result = db.session.query(Customer, Case.invoice_amount.label("total_owed")).join(
        Case, Customer.id == Case.customer_id
    ).filter(Customer.id == customer_id).first()
    if not result:
        return jsonify({'error': 'Customer not found'}), 404
    customer_obj, total_owed = result
    data = customer_obj.to_dict()
    data['total_owed'] = total_owed
    return jsonify(data)

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
