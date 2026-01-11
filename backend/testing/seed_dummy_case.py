from app import create_app, db
from models import User, Agency, Customer, Case, TimelineEvent
from datetime import datetime, timedelta

app = create_app()

def seed_dummy_case():
    with app.app_context():
        print("Creating dummy case with specific timeline...")
        
        # Check if we need to create basic data first
        agencies = Agency.query.all()
        customers = Customer.query.all()
        
        if not agencies:
            print("No agencies found. Creating a sample agency...")
            agency = Agency(
                id='agn001',
                name='Premier Recovery Solutions',
                performance_score=0.92,
                active_outstanding_amount=1500000,
                capacity=100,
                current_capacity=5,
                email='contact@premierrecovery.com',
                phone='555-0100',
                region='Northeast',
                summary='Leading debt collection agency with proven track record.'
            )
            db.session.add(agency)
            db.session.commit()
            print("  ✓ Created sample agency")
        else:
            agency = agencies[0]
            print(f"  ✓ Using existing agency: {agency.name}")
        
        if not customers:
            print("No customers found. Creating a sample customer...")
            customer = Customer(
                account_number='ACC-12345',
                customer_name='Acme Corporation',
                account_type='Premium',
                customer_tier='Gold',
                historical_health='Good',
                due_date='2024-12-01',
                amount_due=25000.00,
                service_type='Express Shipping',
                region='Northeast',
                customer_email='billing@acmecorp.com'
            )
            db.session.add(customer)
            db.session.commit()
            print("  ✓ Created sample customer")
        else:
            customer = customers[0]
            print(f"  ✓ Using existing customer: {customer.customer_name}")
        
        # Create the dummy case
        case_id = 'CS-2024-DEMO'
        due_date = datetime.now() - timedelta(days=45)
        created_at = datetime.now() - timedelta(days=10)
        
        # Check if case already exists
        existing_case = Case.query.filter_by(id=case_id).first()
        if existing_case:
            print(f"Case {case_id} already exists. Deleting it first...")
            db.session.delete(existing_case)
            db.session.commit()
        
        dummy_case = Case(
            id=case_id,
            customer_name=customer.customer_name,
            customer_account_number=customer.account_number,
            invoice_amount=25000.00,
            recovered_amount=22500.00,
            aging_days=45,
            recovery_probability=0.88,
            assigned_agency_id=agency.id,
            assigned_agency_reason='Agency has highest performance score for similar cases',
            status='resolved',
            account_number=f'{customer.account_number}-789',
            due_date=due_date.strftime('%Y-%m-%d'),
            last_contact=datetime.now().strftime('%Y-%m-%d'),
            created_at=created_at.strftime('%Y-%m-%dT%H:%M:%SZ'),
            auto_assign_after_hours=None
        )
        
        db.session.add(dummy_case)
        db.session.commit()
        print(f"  ✓ Created case: {case_id}")
        
        # Create timeline events
        timeline_events = []
        
        # Event 1: Assignment to agency (10 days ago, 9am)
        event_time_1 = created_at + timedelta(hours=1)
        timeline_events.append(TimelineEvent(
            id='evt-demo-001',
            case_id=case_id,
            timestamp=event_time_1.strftime('%Y-%m-%dT%H:%M:%SZ'),
            from_='fedex',
            to_='dca',
            event_type='status_change',
            title='Assigned to DCA',
            description=f'Case {case_id} has been assigned to {agency.name}. Agency has proven track record with similar accounts.',
            meta_previous_status='pending',
            meta_new_status='assigned'
        ))
        
        # Event 2: Email sent (8 days ago, 10am)
        event_time_2 = created_at + timedelta(days=2, hours=2)
        timeline_events.append(TimelineEvent(
            id='evt-demo-002',
            case_id=case_id,
            timestamp=event_time_2.strftime('%Y-%m-%dT%H:%M:%SZ'),
            from_='dca',
            to_='customer',
            event_type='email',
            title='Payment Reminder Sent',
            description=f'Initial payment reminder email sent to {customer.customer_name} regarding outstanding invoice.',
            meta_email_subject=f'Payment Reminder - Account {customer.account_number}',
            meta_email_content='Dear valued customer, this is a friendly reminder that your invoice is currently past due. We would appreciate your prompt attention to this matter. Please contact us to discuss payment options or if you have any questions.'
        ))
        
        # Event 3: Phone call (6 days ago, 2pm)
        event_time_3 = created_at + timedelta(days=4, hours=6)
        timeline_events.append(TimelineEvent(
            id='evt-demo-003',
            case_id=case_id,
            timestamp=event_time_3.strftime('%Y-%m-%dT%H:%M:%SZ'),
            from_='dca',
            to_='customer',
            event_type='call',
            title='Successful Contact Made',
            description=f'Phone call made to {customer.customer_name}. Spoke with accounts payable manager who acknowledged the outstanding balance and committed to payment within 3 business days.',
        ))
        
        # Event 4: Payment received (3 days ago, 11am)
        event_time_4 = created_at + timedelta(days=7, hours=3)
        timeline_events.append(TimelineEvent(
            id='evt-demo-004',
            case_id=case_id,
            timestamp=event_time_4.strftime('%Y-%m-%dT%H:%M:%SZ'),
            from_='customer',
            to_='fedex',
            event_type='payment',
            title='Payment Received',
            description=f'Payment of $22,500.00 received from {customer.customer_name} via wire transfer. Account: {dummy_case.account_number}',
            meta_amount=22500.00
        ))
        
        # Event 5: Case resolved (3 days ago, 2pm)
        event_time_5 = created_at + timedelta(days=7, hours=6)
        timeline_events.append(TimelineEvent(
            id='evt-demo-005',
            case_id=case_id,
            timestamp=event_time_5.strftime('%Y-%m-%dT%H:%M:%SZ'),
            from_='dca',
            to_='fedex',
            event_type='status_change',
            title='Case Resolved',
            description=f'Case {case_id} has been successfully resolved. Payment of $22,500.00 received (90% of invoice amount). Case closed.',
            meta_previous_status='in_progress',
            meta_new_status='resolved'
        ))
        
        db.session.add_all(timeline_events)
        db.session.commit()
        print(f"  ✓ Created {len(timeline_events)} timeline events:")
        print("    - Assignment to agency")
        print("    - Email sent")
        print("    - Phone call made")
        print("    - Payment received")
        print("    - Case resolved")
        
        # Update agency capacity
        agency.current_capacity = len([c for c in Case.query.filter_by(assigned_agency_id=agency.id).all() 
                                       if c.status not in ['resolved', 'legal']])
        db.session.commit()
        
        print("\n" + "="*60)
        print("Dummy case created successfully!")
        print("="*60)
        print(f"  Case ID:         {case_id}")
        print(f"  Customer:        {customer.customer_name}")
        print(f"  Agency:          {agency.name}")
        print(f"  Invoice Amount:  ${dummy_case.invoice_amount:,.2f}")
        print(f"  Recovered:       ${dummy_case.recovered_amount:,.2f}")
        print(f"  Status:          {dummy_case.status}")
        print(f"  Timeline Events: {len(timeline_events)}")
        print("="*60)

if __name__ == '__main__':
    seed_dummy_case()
