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
    """Get a Case object, and append it to cases.json file"""
    
    # the json file is a list of cases
    data = request.get_json()
    filepath = 'cases.json'
    
    # Read existing cases or create empty list if file doesn't exist
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            cases = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        cases = []
    
    # Append new case to the list
    cases.append(data)
    
    # Write updated list back to file
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(cases, f, indent=4)
    return jsonify({'status': 'success', 'message': 'Data received and saved to cases.json'}), 200

@n8n_bp.route('/clear-cases', methods=['GET'])
def n8n_clear_cases():
    """Clear the cases.json file"""
    with open('cases.json', 'w', encoding='utf-8') as f:
        f.write('[]')  # Clear the file by writing an empty JSON array
    return jsonify({'status': 'success', 'message': 'cases.json cleared'}), 200