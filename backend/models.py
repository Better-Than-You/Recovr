from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'fedex', 'dca', 'admin'
    password_hash = db.Column(db.String(128)) # In a real app, hash this!

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role
        }

class Agency(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    performance_score = db.Column(db.Float)
    active_outstanding_amount = db.Column(db.Float)
    capacity = db.Column(db.Integer)  # max number of active cases
    current_capacity = db.Column(db.Integer)  # current number of active cases
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    region = db.Column(db.String(100))
    summary = db.Column(db.String(600), nullable=True, default=None)
    password_hash = db.Column(db.String(128), nullable=True)  # For agency employee login
    
    # Relationship with cases
    cases = db.relationship('Case', backref='agency', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'performanceScore': self.performance_score,
            'activeOutstandingAmount': self.active_outstanding_amount,
            'capacity': self.capacity,
            'currentCapacity': self.current_capacity,
            'email': self.email,
            'phone': self.phone,
            'region': self.region,
            'summary': self.summary
        }

class Customer(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    account_number = db.Column(db.String(50), nullable=False)
    customer_name = db.Column(db.String(100), nullable=False)
    account_type = db.Column(db.String(50))
    customer_tier = db.Column(db.String(50))
    historical_health = db.Column(db.String(50))
    invoice_number = db.Column(db.String(50))
    due_date = db.Column(db.String(20))
    amount_due = db.Column(db.Float)
    service_type = db.Column(db.String(100))
    region = db.Column(db.String(100))
    customer_email = db.Column(db.String(120))
    
    cases = db.relationship('Case', backref='customer_rel', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'accountNumber': self.account_number,
            'customerName': self.customer_name,
            'accountType': self.account_type,
            'customerTier': self.customer_tier,
            'historicalHealth': self.historical_health,
            'invoiceNumber': self.invoice_number,
            'dueDate': self.due_date,
            'amountDue': self.amount_due,
            'serviceType': self.service_type,
            'region': self.region,
            'customerEmail': self.customer_email
        }

class Case(db.Model):
    id = db.Column(db.String(50), primary_key=True) # caseId
    customer_name = db.Column(db.String(100), nullable=False) # Redundant but keeps frontend structure
    customer_id = db.Column(db.String(50), db.ForeignKey('customer.id'), nullable=True) # Link to actual customer
    invoice_amount = db.Column(db.Float, nullable=False)
    recovered_amount = db.Column(db.Float, nullable=False)
    aging_days = db.Column(db.Integer)
    recovery_probability = db.Column(db.Float)
    assigned_agency_id = db.Column(db.String(50), db.ForeignKey('agency.id'), nullable=True)
    assigned_agency_reason = db.Column(db.String(400), nullable=True, default=None)
    status = db.Column(db.String(20), default='pending') # pending, assigned, in_progress, resolved, legal
    account_number = db.Column(db.String(50))
    due_date = db.Column(db.String(20))
    last_contact = db.Column(db.String(20))
    created_at = db.Column(db.String(30))
    auto_assign_after_hours = db.Column(db.Integer, nullable=True)

    timeline_events = db.relationship('TimelineEvent', backref='case', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'caseId': self.id, # for frontend consistency
            'customerName': self.customer_name,
            'invoiceAmount': self.invoice_amount,
            'recoveredAmount': self.recovered_amount,
            'agingDays': self.aging_days,
            'recoveryProbability': self.recovery_probability,
            'assignedAgency': self.agency.name if self.agency else None,
            'assignedAgencyId': self.assigned_agency_id,
            'assignedAgencyReason': self.assigned_agency_reason,
            'status': self.status,
            'accountNumber': self.account_number,
            'dueDate': self.due_date,
            'lastContact': self.last_contact,
            'createdAt': self.created_at,
            'autoAssignAfterHours': self.auto_assign_after_hours,
            'customerId': self.customer_id
        }

class TimelineEvent(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    case_id = db.Column(db.String(50), db.ForeignKey('case.id'), nullable=False)
    timestamp = db.Column(db.String(30))
    from_ = db.Column(db.String(20)) # fedex, dca, customer
    to_ = db.Column(db.String(20)) # fedex, dca, customer
    event_type = db.Column(db.String(50)) # email, status_change, payment, call, legal_notice
    title = db.Column(db.String(100))
    description = db.Column(db.Text)
    
    # Metadata fields (stored as individual columns for simplicity in sqlite, could be JSON)
    meta_amount = db.Column(db.Float, nullable=True)
    meta_email_subject = db.Column(db.String(200), nullable=True)
    meta_email_content = db.Column(db.String(2000), nullable=True)
    meta_previous_status = db.Column(db.String(50), nullable=True)
    meta_new_status = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        metadata = {}
        if self.meta_amount: metadata['amount'] = self.meta_amount
        if self.meta_email_subject: metadata['emailSubject'] = self.meta_email_subject
        if self.meta_email_content: metadata['emailContent'] = self.meta_email_content
        if self.meta_previous_status: metadata['previousStatus'] = self.meta_previous_status
        if self.meta_new_status: metadata['newStatus'] = self.meta_new_status

        return {
            'id': self.id,
            'timestamp': self.timestamp,
            'from': self.from_,
            'to': self.to_,
            'eventType': self.event_type,
            'title': self.title,
            'description': self.description,
            'metadata': metadata if metadata else None
        }

class AuditLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.String(50))
    action = db.Column(db.String(100))
    details = db.Column(db.String(200))

    def to_dict(self):
        return {
            'id': self.id,
            'timestamp': self.timestamp.isoformat(),
            'userId': self.user_id,
            'action': self.action,
            'details': self.details
        }

class Notification(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    type = db.Column(db.String(30), nullable=False) # case_update, payment_received, action_required, status_change, reminder
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.String(30))
    read = db.Column(db.Boolean, default=False)
    link = db.Column(db.String(200), nullable=True)
    case_id = db.Column(db.String(50), db.ForeignKey('case.id'), nullable=True)
    priority = db.Column(db.String(10), nullable=True) # high, medium, low

    def to_dict(self):
        result = {
            'id': self.id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'timestamp': self.timestamp,
            'read': self.read,
            'priority': self.priority
        }
        if self.link:
            result['link'] = self.link
        if self.case_id:
            result['caseId'] = self.case_id
        return result
