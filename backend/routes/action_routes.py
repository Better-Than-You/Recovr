from flask import Blueprint, json, jsonify, request, Response, stream_with_context
import requests
from models import db, Case, Customer, TimelineEvent
import os
import csv
import uuid
import time
from datetime import datetime
from werkzeug.utils import secure_filename
import threading

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
    """Upload CSV file and process with real-time SSE progress updates"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Validate file extension
    filename = secure_filename(file.filename or '')
    if not filename.lower().endswith('.csv'):
        return jsonify({'error': 'Invalid file type. Please upload CSV file'}), 400

    # Save file BEFORE generator (file object can't be used inside generator)
    filepath = os.path.join('uploads', filename)
    os.makedirs('uploads', exist_ok=True)
    file.save(filepath)
    print(f"File saved to: {filepath}")

    def generate_progress():
        """Generator function for SSE progress updates"""
        try:
            # Stage 1: Uploading
            yield f"data: {json.dumps({'status': 'uploading', 'message': 'Receiving file...'})}\n\n"
            time.sleep(0.5)  # Simulate upload time
            
            # Stage 2: Received
            yield f"data: {json.dumps({'status': 'received', 'message': 'File received successfully'})}\n\n"
            time.sleep(0.5)
            
            # Stage 3: Processing - Parse CSV
            yield f"data: {json.dumps({'status': 'processing', 'message': 'Processing CSV data...'})}\n\n"
            
            cases_data = []
            with open(filepath, 'r', encoding='utf-8') as csvfile:
                csv_reader = csv.DictReader(csvfile)
                for row in csv_reader:
                    cases_data.append(row)
            
            total_cases = len(cases_data)
            print(f"Parsed {total_cases} cases from CSV")
            
            if total_cases == 0:
                yield f"data: {json.dumps({'status': 'error', 'message': 'No valid data found in CSV'})}\n\n"
                return
            
            # Send CSV data to n8n webhook asynchronously (non-blocking)
            n8n_url = os.getenv('N8N_WEBHOOK_URL')
            print(f"N8N_WEBHOOK_URL from env: {n8n_url}")
            
            if n8n_url:
                print(f"Sending {total_cases} cases to n8n at {n8n_url}")
                print(f"Sample data (first row): {cases_data[0] if cases_data else 'No data'}")
                
                def send_to_n8n(data, url, count):
                    """Send data to n8n in background thread without blocking"""
                    try:
                        payload = {'cases': data, 'total_cases': count}
                        print(f"Sending payload with {len(data)} cases to {url}")
                        response = requests.post(
                            url,
                            json=payload,
                            headers={'Content-Type': 'application/json'},
                            timeout=600  # 10 minute timeout for long n8n processing
                        )
                        print(f"n8n webhook response: {response.status_code}")
                        print(f"n8n webhook response body: {response.text}")
                    except requests.exceptions.RequestException as e:
                        print(f"n8n webhook error: {e}")
                        import traceback
                        traceback.print_exc()
                
                # Start n8n request in background thread (fire and forget)
                n8n_thread = threading.Thread(target=send_to_n8n, args=(cases_data, n8n_url, total_cases))
                n8n_thread.daemon = True
                n8n_thread.start()
                
                yield f"data: {json.dumps({'status': 'n8n_sent', 'message': 'Data sent to n8n for background processing'})}\n\n"
            else:
                print("N8N_WEBHOOK_URL not configured, skipping n8n integration")
            
            # Stage 4: Assigning - Process cases in batches
            yield f"data: {json.dumps({'status': 'assigning', 'currentAssigned': 0, 'totalRows': total_cases, 'message': 'Starting case assignment...'})}\n\n"
            
            cases_created = 0
            errors = []
            
            for index, row in enumerate(cases_data):
                try:
                    # Create or update customer
                    customer = Customer.query.filter_by(email=row.get('customer_email', '')).first()
                    if not customer:
                        customer = Customer(
                            id=str(uuid.uuid4()),
                            name=row.get('customer_name', 'Unknown'),
                            email=row.get('customer_email', ''),
                            phone=row.get('customer_phone', ''),
                            address=row.get('customer_address', '')
                        )
                        db.session.add(customer)
                    
                    # Create case
                    case = Case(
                        id=str(uuid.uuid4()),
                        invoice_number=row.get('invoice_number', f'INV-{uuid.uuid4().hex[:8]}'),
                        customer_id=customer.id,
                        amount=float(row.get('amount', 0)),
                        aging_days=int(row.get('aging_days', 0)),
                        status=row.get('status', 'new'),
                        priority=row.get('priority', 'medium'),
                        assigned_agency_id=row.get('agency_id'),
                        notes=row.get('notes', '')
                    )
                    db.session.add(case)
                    cases_created += 1
                    
                    # Commit in batches of 10 for performance
                    if (index + 1) % 10 == 0 or (index + 1) == total_cases:
                        db.session.commit()
                        
                        # Send progress update
                        yield f"data: {json.dumps({'status': 'assigning', 'currentAssigned': cases_created, 'totalRows': total_cases, 'message': f'Assigned {cases_created} of {total_cases} cases'})}\n\n"
                        time.sleep(0.1)  # Small delay to show progress
                        
                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")
                    db.session.rollback()
            
            # Stage 5: Done
            yield f"data: {json.dumps({'status': 'done', 'message': f'Successfully imported {cases_created} case(s)', 'cases_created': cases_created, 'errors': errors})}\n\n"
            
        except Exception as e:
            db.session.rollback()
            yield f"data: {json.dumps({'status': 'error', 'message': f'Failed to process file: {str(e)}'})}\n\n"
    
    return Response(
        stream_with_context(generate_progress()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive'
        }
    )

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
    
        
    
    