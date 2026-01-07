from flask import Blueprint, jsonify
from models import db, Case, Agency, Customer
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    # Calculate stats
    total_cases = Case.query.count()
    active_cases = Case.query.filter(Case.status.notin_(['resolved', 'dismissed'])).count()
    resolved_cases = Case.query.filter_by(status='resolved').count()
    
    total_debt = db.session.query(func.sum(Case.amount)).scalar() or 0
    recovered_amount = 0 # In a real system, sum payment events
    
    return jsonify({
        'totalCases': total_cases,
        'activeCases': active_cases,
        'resolvedCases': resolved_cases,
        'totalDebt': total_debt,
        'recoveredAmount': recovered_amount,
        'recoveryRate': (recovered_amount / total_debt * 100) if total_debt > 0 else 0
    })

@dashboard_bp.route('/stats/recovery', methods=['GET'])
def get_recovery_stats():
    # Mock data for charts
    return jsonify([
        {'month': 'Jan', 'recovered': 120000},
        {'month': 'Feb', 'recovered': 135000},
        {'month': 'Mar', 'recovered': 150000}
    ])

@dashboard_bp.route('/performance/agencies', methods=['GET'])
def get_agency_performance():
    agencies = Agency.query.all()
    return jsonify([a.to_dict() for a in agencies])
