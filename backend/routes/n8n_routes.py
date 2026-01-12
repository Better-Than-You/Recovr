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

n8n_bp = Blueprint('n8n', __name__)

@n8n_bp.route('/add-case', methods=['POST'])
def n8n_add_case():
    """here the n8n will give a payload to create a case in the system
    
    expected payload:
    {
        "invoice_id": "12345",
        "invoice_amount": 1500.00,
        "aging_days": 45,
        "recovery_probability": 0.75,
        "account_number": "67890",
        "assigned_agency_id": 1,
        "assigned_agency_reason": "Reason for assignment",
        ... other relevant fields ...
    }
    """
    
    data = request.get_json()
    
    if not data:
        return jsonify({'status': 'error', 'message': 'No data provided'}), 400
    
    customer = Customer.query.filter_by(account_number=data.get('account_number')).first()
    if not customer:
        return jsonify({'status': 'error', 'message': 'Customer not found'}), 404

    case = Case(
        id=str(uuid.uuid4()),
        customer_name=customer.customer_name,
        customer_account_number=customer.account_number,
        # account_number=data.get('account_number'),
        invoice_amount=data.get('invoice_amount'),
        recovered_amount=data.get('recovered_amount', 0.0),
        aging_days=data.get('aging_days', 0),
        recovery_probability=data.get('recovery_probability', 0.0),
        assigned_agency_id=data.get('assigned_agency_id'),
        assigned_agency_reason=data.get('assigned_agency_reason'),
        status='assigned',
        due_date=data.get('due_date'),
        last_contact=None,
        created_at=datetime.utcnow().isoformat()
    )
    
    # handle progress bar updatation here if needed
    
    db.session.add(case)
    db.session.commit()
    
    return jsonify({'status': 'success', 'message': f'Case #{case.id} created successfully'}), 200

@n8n_bp.route('/process-done', methods=['GET'])
def n8n_process_done():
    """This will just update the status of the progress bar to finished and add a notification"""
    # In a real implementation, you might want to update some status in the database
    # or notify users via websockets or other means.
    return jsonify({'status': 'success', 'message': 'n8n processing completed'}), 200