from app import create_app, db
from models import User, Agency, Customer, Case, TimelineEvent
from datetime import datetime

app = create_app()

def seed_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        print("Creating Users...")
        admin = User(id='u1', name='Admin User', email='admin@fedex.com', role='fedex')
        dca = User(id='u2', name='DCA Agent', email='agent@dca.com', role='dca')
        db.session.add(admin)
        db.session.add(dca)

        print("Creating Agencies...")
        prs = Agency(id='prs', name='Premier Recovery Solutions', performance_score=0.87, total_recovered=2345000, email='contact@premier.com')
        eca = Agency(id='eca', name='Elite Collection Agency', performance_score=0.92, total_recovered=3120000, email='contact@elite.com')
        rra = Agency(id='rra', name='Rapid Recovery Associates', performance_score=0.79, total_recovered=1890000, email='contact@rapid.com')
        
        db.session.add_all([prs, eca, rra])
        
        print("Creating Customers...")
        acme = Customer(id='cust-001', name='Acme Corporation', email='accounts@acme.com', phone='555-0101', city='New York', state='NY')
        global_log = Customer(id='cust-002', name='Global Logistics Inc', email='finance@globallog.com', phone='555-0102', city='Chicago', state='IL')
        midwest = Customer(id='cust-003', name='Midwest Manufacturing', email='payables@midwest.com', phone='555-0103', city='Detroit', state='MI')
        
        db.session.add_all([acme, global_log, midwest])
        
        print("Creating Cases...")
        c1 = Case(
            id='CS-2024-001',
            customer_name='Acme Corporation',
            customer_id='cust-001',
            amount=45000,
            aging_days=120,
            recovery_probability=0.75,
            assigned_agency_id='prs',
            status='in_progress',
            account_number='AC-892341',
            due_date='2023-09-15',
            created_at='2023-09-15T08:00:00Z'
        )
        
        c2 = Case(
            id='CS-2024-002',
            customer_name='Global Logistics Inc',
            customer_id='cust-002',
            amount=28500,
            aging_days=95,
            recovery_probability=0.82,
            assigned_agency_id='eca',
            status='in_progress',
            account_number='GL-445782',
            due_date='2023-10-02',
            created_at='2023-10-02T08:00:00Z'
        )
        
        db.session.add_all([c1, c2])
        
        print("Creating Timeline Events...")
        e1 = TimelineEvent(
            id='evt-001',
            case_id='CS-2024-001',
            timestamp='2023-09-15T09:00:00Z',
            actor='fedex',
            event_type='status_change',
            title='Invoice Generated',
            description='Invoice #INV-892341 generated for $45,000',
            meta_amount=45000
        )
        
        db.session.add(e1)
        
        db.session.commit()
        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_data()
