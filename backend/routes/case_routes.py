from flask import Blueprint, request, jsonify
from models import db, Case, TimelineEvent, Agency, Customer
from datetime import datetime
import uuid

cases_bp = Blueprint('cases', __name__)

@cases_bp.route('', methods=['GET'])
def get_cases():
    # pagination and filters
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    search_query = request.args.get('search', '')
    status_filter = request.args.get('status')
    agency_id = request.args.get('agency_id', None)  # Filter by agency
    
    query = Case.query
    
    if agency_id:
        query = query.filter_by(assigned_agency_id=agency_id)

    if status_filter and status_filter != 'all':
        query = query.filter_by(status=status_filter)
        
    if search_query:
        query = query.filter(Case.customer_name.ilike(f'%{search_query}%'))

    # Sort by created_at desc
    # query = query.order_by(Case.created_at.desc()) NOTE - could be string format, need to check later

    pagination = query.paginate(page=page, per_page=limit, error_out=False)
    
    return jsonify({
        'cases': [c.to_dict() for c in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

@cases_bp.route('/<case_id>', methods=['GET'])
def get_case(case_id):
    case = Case.query.get(case_id)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    
    latest_event = TimelineEvent.query.filter_by(case_id=case_id)\
        .order_by(TimelineEvent.timestamp.desc())\
        .first()
    
    # case object + latest contact time
    case_data = case.to_dict()
    case_data['lastContact'] = latest_event.timestamp if latest_event else None
    
    return jsonify(case_data)

@cases_bp.route('', methods=['POST'])
def create_case():
    data = request.json
    
    required = ['customerName', 'amount']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing {field}'}), 400

    new_case = Case(
        id=f"CS-{datetime.now().year}-{uuid.uuid4().hex[:6].upper()}",
        customer_name=data['customerName'],
        amount=data['amount'],
        aging_days=0,
        recovery_probability=0.5, # Default
        status='pending',
        created_at=datetime.utcnow().isoformat() + 'Z'
    )
    
    db.session.add(new_case)
    db.session.commit()
    
    return jsonify(new_case.to_dict()), 201

@cases_bp.route('/<case_id>', methods=['PUT'])
def update_case(case_id):
    case = Case.query.get(case_id)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
        
    data = request.json
    
    if 'status' in data:
        case.status = data['status']
    if 'amount' in data:
        case.invoice_amount = data['amount']

    db.session.commit()
    return jsonify(case.to_dict())

@cases_bp.route('/<case_id>/timeline', methods=['GET'])
def get_case_timeline(case_id):
    case = Case.query.get(case_id)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
        
    events = TimelineEvent.query.filter_by(case_id=case_id).all()
    # sorting by timestamp ascending
    events.sort(key=lambda x: x.timestamp if x.timestamp else "")
    
    return jsonify([e.to_dict() for e in events])

@cases_bp.route('/<case_id>/assign', methods=['PUT'])
def assign_case(case_id):
    data = request.json
    agency_id = data.get('agencyId')
    
    case = Case.query.get(case_id)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
        
    agency = Agency.query.get(agency_id)
    if not agency:
        return jsonify({'error': 'Agency not found'}), 404
        
    case.assigned_agency_id = agency_id
    case.status = 'assigned'
    
    event = TimelineEvent(
        id=f"evt-{uuid.uuid4().hex[:8]}",
        case_id=case_id,
        timestamp=datetime.utcnow().isoformat() + 'Z',
        actor='fedex', # Assuming current user
        event_type='status_change',
        title='Assigned to DCA',
        description=f'Case assigned to {agency.name}',
        meta_previous_status=case.status,
        meta_new_status='assigned'
    )
    db.session.add(event)
    
    db.session.commit()
    return jsonify(case.to_dict())

@cases_bp.route('/<case_id>/email', methods=['POST'])
def send_email(case_id):
    case = Case.query.get(case_id)
    if not case: return jsonify({'error': 'Case not found'}), 404
    
    data = request.json
    
    event = TimelineEvent(
        id=f"evt-{uuid.uuid4().hex[:8]}",
        case_id=case_id,
        timestamp=datetime.utcnow().isoformat() + 'Z',
        actor='fedex', # or 'dca' based on auth
        event_type='email',
        title=data.get('subject', 'Email Sent'),
        description=data.get('body', 'Email sent to customer'),
        meta_email_subject=data.get('subject')
    )
    db.session.add(event)
    db.session.commit()
    
    return jsonify({'message': 'Email sent', 'event': event.to_dict()})

@cases_bp.route('/<case_id>/call', methods=['POST'])
def log_call(case_id):
    case = Case.query.get(case_id)
    if not case: return jsonify({'error': 'Case not found'}), 404
    
    data = request.json
    
    event = TimelineEvent(
        id=f"evt-{uuid.uuid4().hex[:8]}",
        case_id=case_id,
        timestamp=datetime.utcnow().isoformat() + 'Z',
        actor='fedex',
        event_type='call',
        title='Call Logged',
        description=data.get('notes', 'Call made to customer')
    )
    db.session.add(event)
    db.session.commit()
    
    return jsonify({'message': 'Call logged', 'event': event.to_dict()})

@cases_bp.route('/<case_id>/timeline', methods=['POST'])
def add_timeline_event(case_id):
    """Add a custom timeline event to a case"""
    case = Case.query.get(case_id)
    if not case:
        return jsonify({'error': 'Case not found'}), 404
    
    data = request.json
    
    required = ['eventType', 'title', 'actor']
    for field in required:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    valid_actors = ['fedex', 'dca', 'customer']
    if data['actor'] not in valid_actors:
        return jsonify({'error': f'Invalid actor. Must be one of: {valid_actors}'}), 400
    
    valid_event_types = ['email', 'call', 'status_change', 'payment', 'legal_notice']
    if data['eventType'] not in valid_event_types:
        return jsonify({'error': f'Invalid event type. Must be one of: {valid_event_types}'}), 400
    
    timestamp = data.get('timestamp', datetime.utcnow().isoformat() + 'Z')
    
    event = TimelineEvent(
        id=f"evt-{uuid.uuid4().hex[:8]}",
        case_id=case_id,
        timestamp=timestamp,
        actor=data['actor'],
        event_type=data['eventType'],
        title=data['title'],
        description=data.get('description', '')
    )
    
    if 'metadata' in data:
        metadata = data['metadata']
        if 'amount' in metadata:
            event.meta_amount = metadata['amount']
        if 'emailSubject' in metadata:
            event.meta_email_subject = metadata['emailSubject']
        if 'emailContent' in metadata:
            event.meta_email_content = metadata['emailContent']
        if 'previousStatus' in metadata:
            event.meta_previous_status = metadata['previousStatus']
        if 'newStatus' in metadata:
            event.meta_new_status = metadata['newStatus']
    
    db.session.add(event)
    db.session.commit()
    
    return jsonify({'message': 'Timeline event added successfully', 'event': event.to_dict()}), 201
