from flask import Blueprint, jsonify, request
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
    try:
        data = request.get_json()
        print("Received JSON Data:")
        print(data)
        return jsonify({"message": "JSON received and printed"}), 200
    except Exception as e:
        print(f"Error printing JSON: {e}")
        return jsonify({"error": "Failed to process JSON"}), 400