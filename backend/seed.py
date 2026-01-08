from app import create_app, db
from models import User, Agency, Customer, Case, TimelineEvent, Notification, AuditLog
from datetime import datetime, timedelta
import random
from faker import Faker

fake = Faker()
app = create_app()

def seed_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        print("Creating Users...")
        users = [
            User(id='u1', name='Admin User', email='admin@fedex.com', role='admin', password_hash='hashed_password'),
            User(id='u2', name='FedEx Manager', email='manager@fedex.com', role='fedex', password_hash='hashed_password'),
        ]
        
        # Generate 100+ users using Faker
        for i in range(3, 153):
            role = random.choice(['fedex', 'dca', 'admin'])
            domain = 'fedex.com' if role == 'fedex' else ('admin.com' if role == 'admin' else fake.domain_name())
            users.append(User(
                id=f'u{i}',
                name=fake.name(),
                email=f'{fake.user_name()}{i}@{domain}',
                role=role,
                password_hash='hashed_password'
            ))
        db.session.add_all(users)
        db.session.commit()
        print(f"  ✓ Created {len(users)} users")

        print("Creating Agencies...")
        agency_prefixes = ['Premier', 'Elite', 'Rapid', 'Swift', 'Apex', 'Global', 'National', 'Superior', 
                          'Prime', 'Precision', 'Champion', 'Reliable', 'Professional', 'Advanced', 'Strategic',
                          'Platinum', 'Diamond', 'Summit', 'Capital', 'Unified', 'Alliance', 'Proven', 'Trusted',
                          'Express', 'First', 'Quality', 'Metro', 'Central', 'United', 'Independent']
        agency_suffixes = ['Recovery Solutions', 'Collection Agency', 'Recovery Associates', 'Collections Inc',
                          'Debt Recovery', 'Financial Services', 'Recovery Group', 'Collection Services',
                          'Asset Recovery', 'Credit Solutions', 'Recovery Partners', 'Collection Experts']
        
        agencies = [
            Agency(
                id='prs', 
                name='Premier Recovery Solutions', 
                performance_score=0.87, 
                active_outstanding_amount=2345000, 
                email='contact@premier.com', 
                phone='+1 (555) 100-0001',
                summary='Leading debt collection agency with over 15 years of experience in commercial recovery.'
            ),
            Agency(
                id='eca', 
                name='Elite Collection Agency', 
                performance_score=0.92, 
                active_outstanding_amount=3120000, 
                email='contact@elite.com', 
                phone='+1 (555) 100-0002',
                summary='Top-rated agency specializing in high-value accounts and international collections.'
            ),
            Agency(
                id='rra', 
                name='Rapid Recovery Associates', 
                performance_score=0.79, 
                active_outstanding_amount=1890000, 
                email='contact@rapid.com', 
                phone='+1 (555) 100-0003',
                summary='Fast-track collection services with focus on quick resolution and customer satisfaction.'
            ),
        ]
        
        # Generate 100+ agencies using Faker
        used_names = {'Premier Recovery Solutions', 'Elite Collection Agency', 'Rapid Recovery Associates'}
        for i in range(4, 153):
            while True:
                prefix = random.choice(agency_prefixes)
                suffix = random.choice(agency_suffixes)
                name = f'{prefix} {suffix}'
                if name not in used_names:
                    used_names.add(name)
                    break
            
            agency_id = f'agn{i:03d}'
            agencies.append(Agency(
                id=agency_id,
                name=name,
                performance_score=round(random.uniform(0.65, 0.98), 2),
                active_outstanding_amount=random.randint(500000, 5000000),
                email=fake.company_email(),
                phone=fake.phone_number(),
                summary=fake.catch_phrase() + '. ' + fake.bs().capitalize() + '.'
            ))
        db.session.add_all(agencies)
        db.session.commit()
        print(f"  ✓ Created {len(agencies)} agencies")
        
        print("Creating Customers...")
        customers = []
        
        # Generate 150 customers using Faker
        for i in range(1, 151):
            customers.append(Customer(
                id=f'CUST-{i:03d}',
                name=fake.company(),
                email=fake.company_email(),
                phone=fake.phone_number(),
                address=fake.street_address(),
                city=fake.city(),
                state=fake.state_abbr(),
                zip_code=fake.zipcode(),
                payment_history=random.choice(['excellent', 'good', 'fair', 'poor']),
                last_contact=(fake.date_between(start_date='-90d', end_date='today')).strftime('%Y-%m-%d')
            ))
        db.session.add_all(customers)
        db.session.commit()
        print(f"  ✓ Created {len(customers)} customers")
        
        print("Creating Cases...")
        statuses = ['pending', 'assigned', 'in_progress', 'resolved', 'legal']
        cases = []
        
        # Generate 150 cases using Faker
        for i in range(1, 151):
            customer = random.choice(customers)
            agency_id = random.choice([a.id for a in agencies]) if i % 7 != 0 else None
            status = random.choice(statuses) if agency_id else 'pending'
            
            aging_days = random.randint(15, 180)
            due_date = fake.date_between(start_date=f'-{aging_days}d', end_date=f'-{aging_days}d')
            last_contact_days = random.randint(0, min(aging_days, 30))
            
            # Recovery probability based on aging and status
            if status == 'legal':
                recovery_prob = round(random.uniform(0.25, 0.50), 2)
            elif status == 'pending':
                recovery_prob = round(random.uniform(0.85, 0.98), 2)
            elif aging_days > 120:
                recovery_prob = round(random.uniform(0.40, 0.65), 2)
            elif aging_days > 60:
                recovery_prob = round(random.uniform(0.60, 0.80), 2)
            else:
                recovery_prob = round(random.uniform(0.75, 0.95), 2)
            
            invoice_amount = random.choice([
                random.randint(5000, 25000),
                random.randint(25000, 50000),
                random.randint(50000, 100000),
                random.randint(10000, 30000)
            ])
            
            recovered_amount = 0
            if status in ['resolved', 'legal']:
                recovered_amount = int(invoice_amount * random.uniform(0.3, 0.9))
            
            assigned_reason = None
            if agency_id and status != 'pending':
                reasons = [
                    f"Agency has highest performance score of {random.randint(85, 95)}% for similar cases",
                    f"Specialized in {random.choice(['commercial', 'retail', 'industrial'])} debt recovery",
                    "Agency has established relationship with customer's industry",
                    f"Geographic proximity to customer location ({customer.city}, {customer.state})",
                    "Agency has proven track record with accounts over $50K",
                    "Recommended based on case complexity and recovery probability"
                ]
                assigned_reason = random.choice(reasons)
            
            created_time = datetime.combine(due_date, datetime.min.time()) + timedelta(hours=8)
            
            cases.append(Case(
                id=f'CS-2024-{i:04d}',
                customer_name=customer.name,
                customer_id=customer.id,
                invoice_amount=invoice_amount,
                recovered_amount=recovered_amount,
                aging_days=aging_days,
                recovery_probability=recovery_prob,
                assigned_agency_id=agency_id,
                assigned_agency_reason=assigned_reason,
                status=status,
                account_number=f'{customer.id.split("-")[1]}-{random.randint(100000, 999999)}',
                due_date=due_date.strftime('%Y-%m-%d'),
                last_contact=(fake.date_between(start_date=f'-{last_contact_days}d', end_date='today')).strftime('%Y-%m-%d'),
                created_at=created_time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                auto_assign_after_hours=random.choice([12, 24, 36, 48]) if status == 'pending' else None
            ))
        db.session.add_all(cases)
        db.session.commit()
        print(f"  ✓ Created {len(cases)} cases")
        
        print("Creating Timeline Events...")
        event_types = ['email', 'status_change', 'payment', 'call', 'legal_notice']
        actors = ['fedex', 'dca', 'customer']
        event_titles = {
            'email': ['Payment Reminder', 'Collection Notice', 'Customer Response', 'Final Notice', 'Payment Plan Proposal'],
            'status_change': ['Invoice Generated', 'Case Escalated', 'Assigned to DCA', 'Status Updated', 'Case Resolved'],
            'payment': ['Payment Received', 'Partial Payment', 'Full Payment', 'Payment Plan Initiated'],
            'call': ['Phone Contact Attempted', 'Customer Called Back', 'Successful Contact', 'Voicemail Left'],
            'legal_notice': ['Legal Notice Sent', 'Legal Proceedings Initiated', 'Court Filing Prepared']
        }
        
        events = []
        event_counter = 1
        
        # Generate timeline events for all cases (2-6 events per case)
        for case in cases:
            num_events = random.randint(2, 6)
            case_start = datetime.strptime(case.created_at, '%Y-%m-%dT%H:%M:%SZ')
            
            for j in range(num_events):
                event_type = random.choice(event_types)
                from_actor = random.choice(actors)
                to_actor = random.choice([a for a in actors if a != from_actor])
                title = random.choice(event_titles[event_type])
                
                # Event timestamp between case creation and now
                days_offset = int((datetime.now() - case_start).days * (j + 1) / (num_events + 1))
                event_time = case_start + timedelta(days=days_offset, hours=random.randint(8, 17))
                
                event = TimelineEvent(
                    id=f'evt-{event_counter:05d}',
                    case_id=case.id,
                    timestamp=event_time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    from_=from_actor,
                    to_=to_actor,
                    event_type=event_type,
                    title=title,
                    description=fake.sentence() + f' Account: {case.account_number}'
                )
                
                # Add metadata based on event type
                if event_type == 'payment':
                    max_payment = int(case.invoice_amount * 0.5)
                    event.meta_amount = random.randint(min(5000, max_payment), max(5000, max_payment))
                elif event_type == 'email':
                    event.meta_email_subject = f'{title} - {case.account_number}'
                    event.meta_email_content = fake.paragraph(nb_sentences=3)
                elif event_type == 'status_change':
                    event.meta_previous_status = random.choice(['pending', 'overdue', 'assigned'])
                    event.meta_new_status = case.status
                
                events.append(event)
                event_counter += 1
        
        db.session.add_all(events)
        db.session.commit()
        print(f"  ✓ Created {len(events)} timeline events")
        
        print("Creating Notifications...")
        notification_types = ['action_required', 'payment_received', 'status_change', 'reminder', 'case_update']
        notification_templates = {
            'action_required': [
                'Case {case_id} Requires Action',
                'Urgent: Review Required for {case_id}',
                'Action Needed: {case_id}',
                'Approval Required for {case_id}'
            ],
            'payment_received': [
                'Payment Received - ${amount}',
                'Partial Payment Received for {case_id}',
                'Payment Processed: {case_id}',
                'Customer Payment Confirmed'
            ],
            'status_change': [
                'Case Status Updated: {case_id}',
                '{case_id} Status Changed',
                'Status Update for {case_id}',
                'Case {case_id} Escalated'
            ],
            'reminder': [
                'Follow-up Reminder: {case_id}',
                'Payment Plan Deadline Approaching',
                'Auto-Assignment Scheduled for {case_id}',
                'Review Due: {case_id}'
            ],
            'case_update': [
                'New Case Assigned: {case_id}',
                'Customer Contact Established',
                'Case Update: {case_id}',
                'Agency Update for {case_id}'
            ]
        }
        
        notifications = []
        
        # Generate 120 notifications using Faker
        for i in range(1, 121):
            notif_type = random.choice(notification_types)
            case = random.choice(cases)
            priority = random.choice(['high', 'medium', 'low'])
            read = random.choice([True, False])
            
            template = random.choice(notification_templates[notif_type])
            title = template.format(case_id=case.id, amount=random.randint(5000, 50000))
            
            messages = {
                'action_required': fake.sentence() + f' for {case.customer_name}',
                'payment_received': f'Payment of ${random.randint(5000, 50000)} received for case {case.id}',
                'status_change': f'{case.id} status changed from {random.choice(statuses)} to "{case.status}"',
                'reminder': fake.sentence() + f' - Case {case.id}',
                'case_update': fake.sentence() + f' - {case.id}'
            }
            
            timestamp = fake.date_time_between(start_date='-30d', end_date='now')
            
            notifications.append(Notification(
                id=f'notif-{i:04d}',
                type=notif_type,
                title=title,
                message=messages[notif_type],
                timestamp=timestamp.strftime('%Y-%m-%dT%H:%M:%SZ'),
                read=read,
                case_id=case.id if i % 4 != 0 else None,
                priority=priority,
                link=f'/case/{case.id}' if i % 5 == 0 else None
            ))
        
        db.session.add_all(notifications)
        db.session.commit()
        print(f"  ✓ Created {len(notifications)} notifications")
        
        print("Creating Audit Logs...")
        audit_logs = []
        actions = [
            'User Login', 'User Logout', 'Case Created', 'Case Updated', 'Case Assigned',
            'Payment Recorded', 'Status Changed', 'Agency Assigned', 'Customer Updated',
            'Report Generated', 'Settings Changed', 'User Created', 'Notification Sent'
        ]
        
        # Generate 150 audit logs using Faker
        for i in range(1, 151):
            user = random.choice(users)
            action = random.choice(actions)
            timestamp = fake.date_time_between(start_date='-60d', end_date='now')
            
            # Generate relevant details based on action
            if 'Case' in action:
                case = random.choice(cases)
                details = f"{action} - {case.id} ({case.customer_name})"
            elif 'User' in action:
                details = f"{action} - {user.name} ({user.email})"
            elif 'Payment' in action:
                case = random.choice(cases)
                amount = random.randint(5000, 50000)
                details = f"{action} - ${amount} for {case.id}"
            else:
                details = f"{action} - {fake.sentence()}"
            
            audit_logs.append(AuditLog(
                timestamp=timestamp,
                user_id=user.id,
                action=action,
                details=details
            ))
        
        db.session.add_all(audit_logs)
        db.session.commit()
        print(f"  ✓ Created {len(audit_logs)} audit logs")
        
        print("\n" + "="*50)
        print("Database seeded successfully!")
        print("="*50)
        print(f"  Users:           {len(users)}")
        print(f"  Agencies:        {len(agencies)}")
        print(f"  Customers:       {len(customers)}")
        print(f"  Cases:           {len(cases)}")
        print(f"  Timeline Events: {len(events)}")
        print(f"  Notifications:   {len(notifications)}")
        print(f"  Audit Logs:      {len(audit_logs)}")
        print("="*50)

if __name__ == '__main__':
    seed_data()
