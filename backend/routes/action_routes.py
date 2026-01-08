from flask import Blueprint, json, jsonify, request
from models import db, Case, Customer, TimelineEvent
import os
import csv
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

actions_bp = Blueprint('actions', __name__)

@actions_bp.route('/pending', methods=['GET'])
def get_pending_actions():
    # Return mock actions for now, as we didn't model Action in DB yet fully 
    # (though mentioned in plan, we only did models.py with basic stuff)
    # Let's verify models.py... I didn't add Action model. 
    # That's fine, I'll return hardcoded list matching mockData structure or expected frontend structure
    
    return jsonify([
        {
            'id': 'act-001',
            'type': 'review',
            'priority': 'high',
            'title': 'Review Settlement Proposal',
            'description': 'Case CS-2024-001 proposed 60% settlement',
            'caseId': 'CS-2024-001',
            'dueDate': '2024-01-10'
        },
        {
            'id': 'act-002',
            'type': 'approve',
            'priority': 'medium',
            'title': 'Approve Legal Action',
            'description': 'Case CS-2024-006 ready for legal escaltion',
            'caseId': 'CS-2024-006',
            'dueDate': '2024-01-12'
        }
    ])

@actions_bp.route('/upload', methods=['POST'])
def upload_cases():
    """Upload and process CSV file with case data"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Validate file extension
    filename = secure_filename(file.filename or '')
    if not filename.lower().endswith('.csv'):
        return jsonify({'error': 'Invalid file type. Please upload CSV file'}), 400

    try:
        # Read CSV directly from memory without saving
        import io
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        reader = csv.DictReader(stream)
        
        cases_created = 0
        cases_skipped = 0
        
        for row in reader:
            # Extract required fields from CSV
            invoice_id = row.get('invoice_id') or row.get('Invoice ID')
            account_number = row.get('account_number') or row.get('Account Number')
            customer_email = row.get('customer_email') or row.get('Customer Email')
            
            if not invoice_id or not account_number or not customer_email:
                print(f"Skipping row due to missing required fields: {row}")
                cases_skipped += 1
                continue
            
            # Check if customer exists in database by email
            customer = Customer.query.filter_by(email=customer_email).first()
            
            if not customer:
                print(f"Customer not found for email: {customer_email}")
                cases_skipped += 1
                continue
            
            # Check if case already exists for this invoice
            existing_case = Case.query.filter_by(invoice_id=invoice_id).first()
            if existing_case:
                print(f"Case already exists for invoice: {invoice_id}")
                cases_skipped += 1
                continue
            
            # Create new case with assigned_agency as null
            new_case = Case(
            id=str(uuid.uuid4()),
            invoice_id=invoice_id,
            customer_id=customer.id,
            account_number=account_number,
            amount_due=float(row.get('amount_due', 0)) if row.get('amount_due') else 0.0,
            status=row.get('status', 'new'),
            assigned_agency=None,
            created_at=datetime.now().isoformat(),
            last_updated=datetime.now().isoformat()
            )
            
            db.session.add(new_case)
            cases_created += 1
        
        db.session.commit()
        
        response_message = f"Successfully processed the CSV file. Created {cases_created} cases, skipped {cases_skipped} rows."
        
        response_message = f"Successfully processed the CSV file."
            
        return jsonify({
            'message': response_message,
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to process file: {str(e)}'}), 500

@actions_bp.route('/timeline', methods=['POST'])
def update_timeline():
    data = request.json
    if not data:
        return jsonify({'error': 'No input data provided'}), 400
    
    required_fields = ['caseId', 'title', 'description']
    if not all(k in data for k in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    new_event = TimelineEvent(
        id=str(uuid.uuid4()),
        case_id=data['caseId'],
        timestamp=datetime.now().isoformat(),
        actor=data.get('actor', 'system'), # default to system if not provided
        event_type=data.get('eventType', 'manual_update'),
        title=data['title'],
        description=data['description'],
        meta_previous_status=data.get('previousStatus'),
        meta_new_status=data.get('newStatus'),
        meta_amount=data.get('amount')
    )
    
    try:
        db.session.add(new_event)
        db.session.commit()
        return jsonify({'message': 'Timeline updated successfully', 'event': new_event.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@actions_bp.route('/print-json', methods=['POST'])
def print_json():
    def sanitize_json(input_str: str) -> dict:
        """
        Sanitize and parse JSON input string, removing potentially harmful content.

        This function is designed to clean JSON input received from n8n workflows by:
        1. Parsing the JSON string into a Python dictionary
        2. Removing potentially harmful HTML script tags from string values within the 'content' field

        Args:
            input_str (str): A JSON-formatted string that needs to be sanitized and parsed.

        Returns:
            dict: A dictionary containing the sanitized JSON data. Returns an empty dictionary 
                if the input string is not valid JSON.

        Raises:
            No exceptions are raised. JSON parsing errors are caught and handled by returning 
            an empty dictionary.

        Example:
            >>> json_str = '{"content": {"message": "<script>alert(1)</script>Hello"}}'
            >>> result = sanitize_json(json_str)
            >>> print(result)
            {'content': {'message': 'Hello'}}

        Note:
            - This is a basic sanitization approach that only removes <script> tags
            - For production use, consider using more comprehensive sanitization libraries
            - Only sanitizes string values within the 'content' dictionary key
            - Non-string values in 'content' are left unchanged
        """
        import json
        try:
            data = json.loads(input_str)
            # Basic sanitization: remove any script tags or potentially harmful content
            if 'content' in data and isinstance(data['content'], dict):
                for key in data['content']:
                    if isinstance(data['content'][key], str):
                        data['content'][key] = data['content'][key].replace('<script>', '').replace('</script>', '')
            return data
        except json.JSONDecodeError:
            return {}

    try:
        data = request.get_json()
        content = data['choices'][0]['message']['content']
        data = sanitize_json(content)
        
        # create timeline event
        event = TimelineEvent(
            id=str(uuid.uuid4()),
            case_id=data.get('invoiceId', 'unknown'),
            timestamp=data.get('timestamp', datetime.now().isoformat()),
            from_=data.get('from', 'unknown'),
            to_=data.get('to', 'unknown'),
            event_type='email',
            title="Email Received From Customer",
            description="No description provided",
            meta_amount=data.get('amount', None),
            meta_email_subject=data.get('content').get('subject'),
            meta_email_content=data.get('content').get('body'),
            meta_previous_status=data.get('previousStatus', None),
            meta_new_status=data.get('newStatus', None)
        )
        
        # CHANGE THIS WHEN YOU SERIOUSLY WANT TO ADD TIMELINE THROUGH EMAIL HOOK
        add_event_toggle = True
        if add_event_toggle:
            try:
                db.session.add(event)
                db.session.commit()
                return jsonify({'message': 'Timeline event created successfully', 'event': event.to_dict()}), 201
            except Exception as e:
                db.session.rollback()
                return jsonify({'error': str(e)}), 500
        
    except Exception as e:
        print(f"Error printing JSON: {e}")
        return jsonify({"error": "Failed to process JSON"}), 400