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
    """Add the case to the database and save to cases.json"""
    
    # the json of format 
    #    {
    #   "account_number": "ACCT-1001",
    #   "invoice_id": "INV-99201",
    #   "assigned_dca": "agn001",
    #   "reasoning": "Premier Recovery Solutions has the highest performance score (0.92) and specializes in commercial accounts with Fortune 500 clients. The case involves a corporate customer with a small amount due ($450.25), aligning with their focus on commercial collections. Their capacity (200) and current capacity (45) indicate availability for this assignment.",
    #   "customer_name": "Global Logistics Inc",
    #   "historical_health": "Good",
    #   "customer_tier": "Global Logistics Inc",
    #   "account_type": "Corporate",
    #   "amount_due": "450.25",
    #   "service_type": "Express",
    #   "due_date": "2025-11-14",
    #   "region": "US",
    #   "customer_email": "billing@globallog.com"
    # }
    data = request.get_json()
    
    customer = Customer.query.filter_by(account_number=data.get('account_number')).first()
    if not customer:
        # return jsonify({'status': 'error', 'message': 'Customer not found'}), 404
        # or create a new customer
        customer = Customer(
            account_number=data.get('account_number'),
            account_type=data.get('account_type'),
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            customer_tier=data.get('customer_tier'),
            historical_health=data.get('historical_health'),
            due_date=data.get('due_date'),
            amount_due=float(data.get('amount_due')),
            service_type=data.get('service_type'),
            region=data.get('region')
        )
        db.session.add(customer)
        db.session.commit()
    
    
    # case format
    #     id = db.Column(db.String(50), primary_key=True) # caseId
    # customer_name = db.Column(db.String(100), nullable=False) # Redundant but keeps frontend structure
    # customer_account_number = db.Column(db.String(50), db.ForeignKey('customer.customer_account_number'), nullable=True) # Link to actual customer
    # invoice_amount = db.Column(db.Float, nullable=False)
    # recovered_amount = db.Column(db.Float, nullable=False)
    # aging_days = db.Column(db.Integer)
    # recovery_probability = db.Column(db.Float)
    # assigned_agency_id = db.Column(db.String(50), db.ForeignKey('agency.id'), nullable=True)
    # assigned_agency_reason = db.Column(db.String(400), nullable=True, default=None)
    # status = db.Column(db.String(20), default='pending') # pending, assigned, in_progress, resolved, legal
    # account_number = db.Column(db.String(50))
    # due_date = db.Column(db.String(20))
    # last_contact = db.Column(db.String(20))
    # created_at = db.Column(db.String(30))
    # auto_assign_after_hours = db.Column(db.Integer, nullable=True)
    case = Case.query.filter_by(id=data.get('invoice_id')).first()
    if case:
        return jsonify({'status': 'error', 'message': f'Case #{data.get("invoice_id")} already exists'}), 200
    case = Case(
        id=data.get('invoice_id'),
        customer_name=data.get('customer_name'),
        customer_account_number=data.get('account_number'),
        invoice_amount=float(data.get('amount_due')),
        recovered_amount=0.0,
        aging_days=None,
        recovery_probability=None,
        assigned_agency_id=data.get('assigned_dca'),
        assigned_agency_reason=data.get('reasoning'),
        status='assigned',
        account_number=data.get('account_number'),
        due_date=data.get('due_date'),
        last_contact=None,
        created_at=datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
        auto_assign_after_hours=None
    )
    db.session.add(case)
    db.session.commit()
    
    return jsonify({'status': 'success', 'message': f'Case #{case.id} created successfully'}), 200

@n8n_bp.route('/process-done', methods=['GET'])
def n8n_process_done():
    """This will just update the status of the progress bar to finished and add a notification"""
    # In a real implementation, you might want to update some status in the database
    # or notify users via websockets or other means.
    return jsonify({'status': 'success', 'message': 'n8n processing completed'}), 200
