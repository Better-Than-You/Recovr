from app import create_app, db
from models import User, Agency, Customer, Case, TimelineEvent, Notification
from datetime import datetime, timedelta
import random

app = create_app()

def seed_data():
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        print("Creating Users...")
        first_names = ['John', 'Sarah', 'Mike', 'Emily', 'David', 'Jessica', 'Chris', 'Amanda', 'Ryan', 'Lisa',
                      'Kevin', 'Rachel', 'Brian', 'Nicole', 'Tom', 'Michelle', 'James', 'Laura', 'Daniel', 'Stephanie',
                      'Mark', 'Jennifer', 'Paul', 'Rebecca', 'Steve', 'Karen', 'Eric', 'Susan', 'Jason', 'Carol']
        last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                     'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                     'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']
        
        users = [
            User(id='u1', name='Admin User', email='admin@fedex.com', role='admin'),
            User(id='u2', name='FedEx Manager', email='manager@fedex.com', role='fedex'),
        ]
        
        # Generate 100+ users
        for i in range(3, 105):
            first = random.choice(first_names)
            last = random.choice(last_names)
            role = random.choice(['fedex', 'dca', 'admin'])
            domain = 'fedex.com' if role == 'fedex' else ('admin.com' if role == 'admin' else random.choice(['premier.com', 'elite.com', 'rapid.com']))
            users.append(User(
                id=f'u{i}',
                name=f'{first} {last}',
                email=f'{first.lower()}.{last.lower()}{i}@{domain}',
                role=role
            ))
        db.session.add_all(users)

        print("Creating Agencies...")
        agency_prefixes = ['Premier', 'Elite', 'Rapid', 'Swift', 'Apex', 'Global', 'National', 'Superior', 
                          'Prime', 'Precision', 'Champion', 'Reliable', 'Professional', 'Advanced', 'Strategic',
                          'Platinum', 'Diamond', 'Summit', 'Capital', 'Unified', 'Alliance', 'Proven', 'Trusted',
                          'Express', 'First', 'Quality', 'Metro', 'Central', 'United', 'Independent']
        agency_suffixes = ['Recovery Solutions', 'Collection Agency', 'Recovery Associates', 'Collections Inc',
                          'Debt Recovery', 'Financial Services', 'Recovery Group', 'Collection Services',
                          'Asset Recovery', 'Credit Solutions', 'Recovery Partners', 'Collection Experts']
        
        agencies = [
            Agency(id='prs', name='Premier Recovery Solutions', performance_score=0.87, total_recovered=2345000, 
                  email='contact@premier.com', phone='+1 (555) 100-0001'),
            Agency(id='eca', name='Elite Collection Agency', performance_score=0.92, total_recovered=3120000, 
                  email='contact@elite.com', phone='+1 (555) 100-0002'),
            Agency(id='rra', name='Rapid Recovery Associates', performance_score=0.79, total_recovered=1890000, 
                  email='contact@rapid.com', phone='+1 (555) 100-0003'),
        ]
        
        # Generate 100+ agencies
        used_names = {'Premier Recovery Solutions', 'Elite Collection Agency', 'Rapid Recovery Associates'}
        for i in range(4, 105):
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
                total_recovered=random.randint(500000, 5000000),
                email=f'contact@{prefix.lower()}{suffix.split()[0].lower()}.com',
                phone=f'+1 (555) {random.randint(100, 999)}-{random.randint(1000, 9999)}'
            ))
        db.session.add_all(agencies)
        
        print("Creating Customers...")
        company_prefixes = ['Acme', 'Global', 'Midwest', 'TechStart', 'Coastal', 'Northern', 'Summit', 'Pacific',
                           'Metro', 'Eastern', 'Western', 'Atlantic', 'Central', 'Southern', 'Mountain', 'United',
                           'Superior', 'Premium', 'Omega', 'Delta', 'Alpha', 'Beta', 'Quantum', 'Stellar', 'Pioneer',
                           'Frontier', 'Horizon', 'Apex', 'Nexus', 'Vertex', 'Zenith', 'Prime', 'Elite', 'Dynamic']
        company_suffixes = ['Corporation', 'Logistics Inc', 'Manufacturing', 'Solutions', 'Retail Group', 'Distributors',
                           'Industries', 'Imports LLC', 'Services Group', 'Supply Chain', 'Tech Corp', 'Shipping',
                           'Warehousing', 'Freight LLC', 'Express', 'Enterprises', 'Systems', 'Partners', 'Holdings',
                           'Group Inc', 'Technologies', 'International', 'Co', 'Associates', 'Ventures']
        
        cities_states = [
            ('New York', 'NY', '10001'), ('Los Angeles', 'CA', '90001'), ('Chicago', 'IL', '60601'),
            ('Houston', 'TX', '77001'), ('Phoenix', 'AZ', '85001'), ('Philadelphia', 'PA', '19101'),
            ('San Antonio', 'TX', '78201'), ('San Diego', 'CA', '92101'), ('Dallas', 'TX', '75201'),
            ('San Jose', 'CA', '95101'), ('Austin', 'TX', '78701'), ('Jacksonville', 'FL', '32099'),
            ('Fort Worth', 'TX', '76101'), ('Columbus', 'OH', '43085'), ('Charlotte', 'NC', '28201'),
            ('San Francisco', 'CA', '94101'), ('Indianapolis', 'IN', '46201'), ('Seattle', 'WA', '98101'),
            ('Denver', 'CO', '80201'), ('Boston', 'MA', '02101'), ('Nashville', 'TN', '37201'),
            ('Detroit', 'MI', '48201'), ('Portland', 'OR', '97201'), ('Las Vegas', 'NV', '89101'),
            ('Baltimore', 'MD', '21201'), ('Milwaukee', 'WI', '53201'), ('Atlanta', 'GA', '30301'),
            ('Miami', 'FL', '33101'), ('Kansas City', 'MO', '64101'), ('Salt Lake City', 'UT', '84101')
        ]
        
        street_types = ['Street', 'Avenue', 'Boulevard', 'Drive', 'Lane', 'Way', 'Circle', 'Plaza', 'Road', 'Court']
        street_names = ['Main', 'Commerce', 'Business Park', 'Industrial', 'Harbor', 'Innovation', 'Tech',
                       'Mountain View', 'Beach', 'Downtown', 'Market', 'Corporate', 'Enterprise', 'Executive']
        
        customers = []
        used_company_names = set()
        
        for i in range(1, 152):
            while True:
                prefix = random.choice(company_prefixes)
                suffix = random.choice(company_suffixes)
                name = f'{prefix} {suffix}'
                if name not in used_company_names:
                    used_company_names.add(name)
                    break
            
            city, state, zip_code = random.choice(cities_states)
            street_num = random.randint(100, 9999)
            street = f'{street_num} {random.choice(street_names)} {random.choice(street_types)}'
            
            company_short = prefix.lower().replace(' ', '')
            domain = f'{company_short}{suffix.split()[0].lower()}.com'
            
            customers.append(Customer(
                id=f'CUST-{i:03d}',
                name=name,
                email=f'{'accounts' if i % 3 == 0 else 'finance' if i % 3 == 1 else 'billing'}@{domain}',
                phone=f'+1 ({random.randint(200, 999)}) {random.randint(100, 999)}-{random.randint(1000, 9999)}',
                address=street,
                city=city,
                state=state,
                zip_code=zip_code,
                payment_history=random.choice(['excellent', 'good', 'fair', 'poor']),
                last_contact=(datetime.now() - timedelta(days=random.randint(0, 90))).strftime('%Y-%m-%d')
            ))
        db.session.add_all(customers)
        
        print("Creating Cases...")
        statuses = ['pending', 'assigned', 'in_progress', 'resolved', 'legal']
        cases = []
        
        # Generate 100+ cases
        for i in range(1, 152):
            customer = customers[(i - 1) % len(customers)]
            agency_id = random.choice([a.id for a in agencies]) if i % 7 != 0 else None  # Some cases unassigned
            status = random.choice(statuses) if agency_id else 'pending'
            
            aging_days = random.randint(15, 180)
            due_date = datetime.now() - timedelta(days=aging_days)
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
            
            cases.append(Case(
                id=f'CS-2024-{i:03d}',
                customer_name=customer.name,
                customer_id=customer.id,
                invoice_amount=invoice_amount,
                recovered_amount=recovered_amount,
                aging_days=aging_days,
                recovery_probability=recovery_prob,
                assigned_agency_id=agency_id,
                status=status,
                account_number=f'{customer.id.split("-")[1]}-{random.randint(100000, 999999)}',
                due_date=due_date.strftime('%Y-%m-%d'),
                last_contact=(datetime.now() - timedelta(days=last_contact_days)).strftime('%Y-%m-%d'),
                created_at=due_date.strftime('%Y-%m-%dT08:00:00Z'),
                auto_assign_after_hours=random.choice([12, 24, 36, 48]) if status == 'pending' else None
            ))
        db.session.add_all(cases)
        
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
        
        # Generate timeline events for cases (at least 2-5 events per case)
        for case in cases[:100]:  # Generate for first 100 cases to keep reasonable
            num_events = random.randint(2, 6)
            case_start = datetime.strptime(case.created_at, '%Y-%m-%dT%H:%M:%SZ')
            
            for j in range(num_events):
                event_type = random.choice(event_types)
                actor = random.choice(actors)
                title = random.choice(event_titles[event_type])
                
                # Event timestamp between case creation and now
                days_offset = int((datetime.now() - case_start).days * (j + 1) / (num_events + 1))
                event_time = case_start + timedelta(days=days_offset, hours=random.randint(8, 17))
                
                event = TimelineEvent(
                    id=f'evt-{event_counter:05d}',
                    case_id=case.id,
                    timestamp=event_time.strftime('%Y-%m-%dT%H:%M:%SZ'),
                    actor=actor,
                    event_type=event_type,
                    title=title,
                    description=f'{title} for account {case.account_number}'
                )
                
                # Add metadata based on event type
                if event_type == 'payment':
                    max_payment = int(case.invoice_amount * 0.5)
                    event.meta_amount = random.randint(min(5000, max_payment), max(5000, max_payment))
                elif event_type == 'email':
                    event.meta_email_subject = f'{title} - {case.account_number}'
                    event.meta_email_content = f'Content for {title} related to account {case.account_number}'
                elif event_type == 'status_change':
                    event.meta_previous_status = random.choice(['pending', 'overdue', 'assigned'])
                    event.meta_new_status = case.status
                
                events.append(event)
                event_counter += 1
                
                if event_counter > 300:  # Cap at 300 events
                    break
            
            if event_counter > 300:
                break
        
        db.session.add_all(events)
        
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
        
        # Generate 100+ notifications
        for i in range(1, 125):
            notif_type = random.choice(notification_types)
            case = random.choice(cases[:50])  # Reference first 50 cases
            priority = random.choice(['high', 'medium', 'low'])
            read = random.choice([True, False])
            
            template = random.choice(notification_templates[notif_type])
            title = template.format(case_id=case.id, amount=random.randint(5000, 50000))
            
            messages = {
                'action_required': f'Payment plan acceptance needs review and approval for {case.customer_name}',
                'payment_received': f'Payment received for case {case.id}',
                'status_change': f'{case.id} status changed to "{case.status}"',
                'reminder': f'{case.id} - Customer follow-up needed',
                'case_update': f'Case {case.id} has been updated'
            }
            
            timestamp = datetime.now() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
            
            notifications.append(Notification(
                id=f'notif-{i:03d}',
                type=notif_type,
                title=title,
                message=messages[notif_type],
                timestamp=timestamp.strftime('%Y-%m-%dT%H:%M:%SZ'),
                read=read,
                case_id=case.id if i % 4 != 0 else None,  # Some notifications without case_id
                priority=priority,
                link='/case-allocation' if i % 10 == 0 else None
            ))
        
        db.session.add_all(notifications)
        
        db.session.commit()
        print(f"Database seeded successfully!")
        print(f"  - {len(users)} users")
        print(f"  - {len(agencies)} agencies")
        print(f"  - {len(customers)} customers")
        print(f"  - {len(cases)} cases")
        print(f"  - {len(events)} timeline events")
        print(f"  - {len(notifications)} notifications")

if __name__ == '__main__':
    seed_data()
