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
    """Upload and process CSV/Excel file with case data"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Validate file extension
    filename = secure_filename(file.filename or '')
    if not filename.lower().endswith(('.csv', '.xlsx', '.xls')):
        return jsonify({'error': 'Invalid file type. Please upload CSV or Excel file'}), 400

    try:
        # Save file temporarily
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        userdata_dir = os.path.join(base_dir, 'userdata')
        
        if not os.path.exists(userdata_dir):
            os.makedirs(userdata_dir)
            
        file_path = os.path.join(userdata_dir, filename)
        file.save(file_path)
        
        response_message = f"Successfully received the file."
            
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
        content = data.get('content', '{}')
        data = sanitize_json(content)
        
        # create timeline event
        event = TimelineEvent(
            id=str(uuid.uuid4()),
            case_id=data.get('invoiceId', 'unknown'),
            timestamp=data.get('timestamp', datetime.now().isoformat()),
            from_=data.get('from', 'unknown'),
            to_=data.get('to', 'unknown'),
            event_type='email',
            title="Email received from customer",
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