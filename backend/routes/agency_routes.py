from flask import Blueprint, request, jsonify
from models import db, Agency, Case

agencies_bp = Blueprint('agencies', __name__)

@agencies_bp.route('', methods=['GET'])
def get_agencies():
    agencies = Agency.query.all()
    return jsonify([a.to_dict() for a in agencies])

@agencies_bp.route('/<agency_id>', methods=['GET'])
def get_agency(agency_id):
    agency = Agency.query.get(agency_id)
    if not agency:
        return jsonify({'error': 'Agency not found'}), 404
    return jsonify(agency.to_dict())

@agencies_bp.route('/<agency_id>/cases', methods=['GET'])
def get_agency_cases(agency_id):
    agency = Agency.query.get(agency_id)
    if not agency:
        return jsonify({'error': 'Agency not found'}), 404
    
    cases = Case.query.filter_by(assigned_agency_id=agency_id).all()
    return jsonify([c.to_dict() for c in cases])
