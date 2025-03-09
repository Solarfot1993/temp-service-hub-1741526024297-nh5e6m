/*
  # Add test data for service marketplace

  This migration adds sample data for testing the service marketplace application:
  - Sample services across different categories
  - Sample reviews and bookings
  - Sample messages between users
*/

-- First, create auth.users entries for the test accounts
DO $$
BEGIN
  -- Only run this if the auth schema exists and we have permission
  IF EXISTS (
    SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth'
  ) THEN
    -- Try to insert the users, but don't error if we can't
    BEGIN
      INSERT INTO auth.users (id, email, created_at, updated_at)
      VALUES
        ('00000000-0000-0000-0000-000000000001', 'customer1@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000002', 'customer2@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000003', 'customer3@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000004', 'customer4@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000005', 'customer5@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000006', 'customer6@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000007', 'customer7@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000008', 'customer8@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000009', 'customer9@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000010', 'customer10@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000011', 'provider1@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000012', 'provider2@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000013', 'provider3@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000014', 'provider4@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000015', 'provider5@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000016', 'provider6@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000017', 'provider7@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000018', 'provider8@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000019', 'provider9@example.com', now(), now()),
        ('00000000-0000-0000-0000-000000000020', 'provider10@example.com', now(), now());
    EXCEPTION
      WHEN OTHERS THEN
        -- Do nothing if we can't insert into auth.users
        NULL;
    END;
  END IF;
END
$$;

-- Create customer profiles
DO $$
BEGIN
  -- Only insert if the user exists in auth.users
  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000001', 
    'customer1@example.com', 
    'Alex Johnson', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000002', 
    'customer2@example.com', 
    'Jamie Smith', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000002'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000003', 
    'customer3@example.com', 
    'Taylor Wilson', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000003'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000004', 
    'customer4@example.com', 
    'Morgan Brown', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000004'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000005', 
    'customer5@example.com', 
    'Casey Davis', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000005'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000006', 
    'customer6@example.com', 
    'Riley Martinez', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000006'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000007', 
    'customer7@example.com', 
    'Jordan Lee', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000007'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000008', 
    'customer8@example.com', 
    'Quinn Thompson', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000008'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000009', 
    'customer9@example.com', 
    'Avery Garcia', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000009'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000010', 
    'customer10@example.com', 
    'Reese Miller', 
    false, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000010'
  );
END
$$;

-- Create service provider profiles
DO $$
BEGIN
  -- Only insert if the user exists in auth.users
  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000011', 
    'provider1@example.com', 
    'CleanPro Services', 
    true, 
    '2020-01-01', 
    'Professional cleaning services with over 5 years of experience. We specialize in residential and commercial cleaning.', 
    120, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000011'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000012', 
    'provider2@example.com', 
    'Quick Fix Plumbing', 
    true, 
    '2018-03-15', 
    'Licensed plumbers available 24/7 for all your plumbing needs. Emergency services available.', 
    215, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000012'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000013', 
    'provider3@example.com', 
    'Dr. Michael Chen', 
    true, 
    '2019-09-01', 
    'Ph.D. in Mathematics with 10+ years of teaching experience. Specializing in high school and college-level math tutoring.', 
    85, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000013'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000014', 
    'provider4@example.com', 
    'Elena Rodriguez Photography', 
    true, 
    '2017-06-20', 
    'Award-winning photographer specializing in portraits, events, and commercial photography.', 
    62, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000014'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000015', 
    'provider5@example.com', 
    'Green Thumb Landscaping', 
    true, 
    '2016-04-10', 
    'Family-owned landscaping business offering lawn care, garden design, and maintenance services.', 
    320, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000015'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000016', 
    'provider6@example.com', 
    'Bright Spark Electric', 
    true, 
    '2015-01-15', 
    'Licensed electricians providing residential and commercial electrical services. Safety is our top priority.', 
    187, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000016'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000017', 
    'provider7@example.com', 
    'Pristine Auto Detailing', 
    true, 
    '2018-07-01', 
    'Mobile car detailing service using eco-friendly products. We come to you!', 
    145, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000017'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000018', 
    'provider8@example.com', 
    'Digital Craft Studios', 
    true, 
    '2019-10-15', 
    'Web design and development team specializing in custom websites for small businesses.', 
    21, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000018'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000019', 
    'provider9@example.com', 
    'Fitness With Sarah', 
    true, 
    '2020-02-01', 
    'Certified personal trainer offering one-on-one and group fitness sessions. Specializing in weight loss and strength training.', 
    95, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000019'
  );

  INSERT INTO profiles (id, email, full_name, is_provider, provider_since, provider_bio, completed_jobs, created_at)
  SELECT 
    '00000000-0000-0000-0000-000000000020', 
    'provider10@example.com', 
    'Tech Support Wizards', 
    true, 
    '2019-05-10', 
    'IT professionals providing computer repair, software troubleshooting, and tech support for individuals and small businesses.', 
    110, 
    now()
  WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000020'
  );
END
$$;

-- Create sample services
DO $$
BEGIN
  -- Only insert if the provider exists in profiles
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    '11111111-1111-1111-1111-111111111111', 
    'Professional House Cleaning', 
    'Comprehensive house cleaning service that leaves your home spotless. Our professional cleaners use eco-friendly products and pay attention to every detail.', 
    35, 
    'Cleaning', 
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 
    4.8, 
    156, 
    'New York, NY', 
    '3-4 hours', 
    'Mon-Sat, 8am-6pm', 
    ARRAY['Kitchen deep cleaning', 'Bathroom sanitization', 'Dusting and vacuuming', 'Floor mopping', 'Bed making'], 
    'Please ensure pets are secured during the cleaning service. Additional fees may apply for extremely dirty conditions or special cleaning requests.', 
    '00000000-0000-0000-0000-000000000011', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000011'
  );
  
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    '22222222-2222-2222-2222-222222222222', 
    'Emergency Plumbing Repair', 
    'Fast and reliable emergency plumbing services. Available 24/7 for all your plumbing emergencies including leaks, clogs, and broken pipes.', 
    75, 
    'Plumbing', 
    'https://images.unsplash.com/photo-1606274741559-d3a3b4857be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 
    4.9, 
    89, 
    'Chicago, IL', 
    '1-2 hours', 
    '24/7, including holidays', 
    ARRAY['Emergency response', 'Leak detection and repair', 'Drain unclogging', 'Pipe repair', 'Basic parts included'], 
    NULL, 
    '00000000-0000-0000-0000-000000000012', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000012'
  );
  
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    '33333333-3333-3333-3333-333333333333', 
    'Math Tutoring for High School Students', 
    'Expert math tutoring for high school students. Specializing in algebra, calculus, geometry, and test preparation. Personalized lessons tailored to your learning style.', 
    45, 
    'Tutoring', 
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 
    4.7, 
    64, 
    'Online / Boston, MA', 
    '1 hour', 
    'Mon-Fri, 3pm-8pm; Sat, 10am-4pm', 
    ARRAY['Personalized lesson plans', 'Homework help', 'Practice problems', 'Test preparation', 'Progress reports'], 
    'Sessions can be conducted online via Zoom or in-person. Group rates available for 2-3 students.', 
    '00000000-0000-0000-0000-000000000013', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000013'
  );
  
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    '44444444-4444-4444-4444-444444444444', 
    'Professional Portrait Photography', 
    'Capture your best self with our professional portrait photography service. Perfect for LinkedIn profiles, professional websites, or personal branding.', 
    120, 
    'Photography', 
    'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 
    4.9, 
    78, 
    'Los Angeles, CA', 
    '1-2 hours', 
    'Tue-Sun, by appointment', 
    ARRAY['1-hour photo session', 'Multiple outfit changes', 'Professional lighting', '5 fully edited digital photos', 'Online gallery of all photos'], 
    'Additional edited photos available for purchase. Indoor studio and outdoor locations available.', 
    '00000000-0000-0000-0000-000000000014', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000014'
  );
  
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    '55555555-5555-5555-5555-555555555555', 
    'Lawn Mowing and Garden Maintenance', 
    'Regular lawn mowing and garden maintenance service to keep your outdoor space looking its best. We provide professional equipment and eco-friendly practices.', 
    50, 
    'Gardening', 
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 
    4.6, 
    112, 
    'Seattle, WA', 
    '1-3 hours', 
    'Mon-Fri, 8am-5pm', 
    ARRAY['Lawn mowing', 'Edge trimming', 'Debris cleanup', 'Garden bed weeding', 'Fertilization (upon request)'], 
    NULL, 
    '00000000-0000-0000-0000-000000000015', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000015'
  );
  
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    '66666666-6666-6666-6666-666666666666', 
    'Electrical Wiring and Repairs', 
    'Licensed electrician providing safe and reliable electrical services. From simple repairs to complete rewiring, we handle all your electrical needs.', 
    85, 
    'Electrical', 
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80', 
    4.8, 
    95, 
    'Denver, CO', 
    '1-4 hours', 
    'Mon-Sat, 7am-7pm', 
    ARRAY['Safety inspection', 'Outlet and switch repair', 'Lighting installation', 'Circuit troubleshooting', 'Minor parts included'], 
    'All work is performed by licensed and insured electricians. We follow all local codes and safety standards.', 
    '00000000-0000-0000-0000-000000000016', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000016'
  );
  
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    '77777777-7777-7777-7777-777777777777', 
    'Mobile Car Detailing', 
    'Premium car detailing service that comes to you. We provide a thorough cleaning of your vehicle''s interior and exterior, leaving it looking like new.', 
    150, 
    'Automotive', 
    'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80', 
    4.7, 
    83, 
    'Miami, FL', 
    '2-3 hours', 
    'Mon-Sun, by appointment', 
    ARRAY['Exterior wash and wax', 'Interior vacuuming', 'Dashboard and console cleaning', 'Window cleaning', 'Tire and rim detailing'], 
    'Additional services available: leather conditioning, engine bay cleaning, headlight restoration. We bring our own water and power supply.', 
    '00000000-0000-0000-0000-000000000017', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000017'
  );
  
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    '88888888-8888-8888-8888-888888888888', 
    'Website Design and Development', 
    'Custom website design and development services for small businesses and entrepreneurs. We create responsive, user-friendly websites that help you achieve your business goals.', 
    65, 
    'Design', 
    'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 
    4.9, 
    47, 
    'Remote / Austin, TX', 
    'Varies by project', 
    'Mon-Fri, 9am-6pm', 
    ARRAY['Custom design', 'Mobile responsiveness', 'Basic SEO setup', 'Contact form', '1 hour of training'], 
    'We specialize in WordPress, Shopify, and custom-coded websites. Maintenance packages available after completion.', 
    '00000000-0000-0000-0000-000000000018', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000018'
  );
  
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    '99999999-9999-9999-9999-999999999999', 
    'Personal Fitness Training', 
    'Personalized fitness training sessions tailored to your goals. Whether you want to lose weight, build muscle, or improve overall fitness, we have a program for you.', 
    60, 
    'Health & Fitness', 
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 
    4.8, 
    72, 
    'Portland, OR', 
    '1 hour', 
    'Mon-Sat, 6am-8pm', 
    ARRAY['Fitness assessment', 'Customized workout plan', 'Nutritional guidance', 'Progress tracking', 'Equipment provided'], 
    'Sessions can be conducted at your home, a local park, or a gym of your choice. Virtual training options also available.', 
    '00000000-0000-0000-0000-000000000019', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000019'
  );
  
  INSERT INTO services (id, title, description, price, category, image_url, rating, review_count, location, duration, availability, includes, additional_info, provider_id, created_at)
  SELECT
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
    'Computer Repair and IT Support', 
    'Professional computer repair and IT support for individuals and small businesses. We diagnose and fix hardware and software issues, remove viruses, and optimize performance.', 
    70, 
    'Technology', 
    'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80', 
    4.7, 
    65, 
    'San Francisco, CA', 
    '1-2 hours', 
    'Mon-Fri, 9am-7pm; Sat, 10am-4pm', 
    ARRAY['Hardware diagnostics', 'Software troubleshooting', 'Virus removal', 'Data recovery', 'System optimization'], 
    'We offer both in-home and remote support services. Most issues can be resolved in a single visit.', 
    '00000000-0000-0000-0000-000000000020', 
    now()
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000020'
  );
END
$$;

-- Create sample reviews
DO $$
BEGIN
  -- Only insert if the service and user exist
  INSERT INTO reviews (id, service_id, user_id, rating, comment, created_at)
  SELECT
    'aaaaaaaa-0000-0000-0000-000000000001', 
    '11111111-1111-1111-1111-111111111111', 
    '00000000-0000-0000-0000-000000000001', 
    5, 
    'Absolutely amazing service! My house has never been this clean. The team was professional, thorough, and paid attention to every detail. Will definitely book again!', 
    now() - interval '15 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '11111111-1111-1111-1111-111111111111'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001'
  );
  
  INSERT INTO reviews (id, service_id, user_id, rating, comment, created_at)
  SELECT
    'bbbbbbbb-0000-0000-0000-000000000002', 
    '11111111-1111-1111-1111-111111111111', 
    '00000000-0000-0000-0000-000000000002', 
    4, 
    'Very good cleaning service. They did a great job with most areas, though I noticed a few spots under furniture were missed. Still, I would recommend them.', 
    now() - interval '22 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '11111111-1111-1111-1111-111111111111'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000002'
  );
  
  INSERT INTO reviews (id, service_id, user_id, rating, comment, created_at)
  SELECT
    'cccccccc-0000-0000-0000-000000000003', 
    '22222222-2222-2222-2222-222222222222', 
    '00000000-0000-0000-0000-000000000003', 
    5, 
    'Had a major leak at 2 AM and they were at my door within 30 minutes. Fixed the problem quickly and professionally. Saved me from major water damage. Worth every penny!', 
    now() - interval '7 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '22222222-2222-2222-2222-222222222222'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000003'
  );
  
  INSERT INTO reviews (id, service_id, user_id, rating, comment, created_at)
  SELECT
    'dddddddd-0000-0000-0000-000000000004', 
    '33333333-3333-3333-3333-333333333333', 
    '00000000-0000-0000-0000-000000000004', 
    5, 
    'Dr. Chen is an exceptional math tutor. My son''s grades improved from a C to an A- in just two months. He explains complex concepts in a way that''s easy to understand.', 
    now() - interval '10 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '33333333-3333-3333-3333-333333333333'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000004'
  );
  
  INSERT INTO reviews (id, service_id, user_id, rating, comment, created_at)
  SELECT
    'eeeeeeee-0000-0000-0000-000000000005', 
    '44444444-4444-4444-4444-444444444444', 
    '00000000-0000-0000-0000-000000000005', 
    5, 
    'Elena is incredibly talented! She made me feel comfortable during the shoot and the photos turned out better than I could have imagined. Highly recommend!', 
    now() - interval '5 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '44444444-4444-4444-4444-444444444444'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000005'
  );
END
$$;

-- Create sample bookings
DO $$
BEGIN
  -- Only insert if the service, user, and provider exist
  INSERT INTO bookings (id, service_id, user_id, provider_id, date, time, duration, price, status, notes, created_at)
  SELECT
    'aaaaaaaa-0000-0000-0000-000000000001', 
    '11111111-1111-1111-1111-111111111111', 
    '00000000-0000-0000-0000-000000000001', 
    '00000000-0000-0000-0000-000000000011', 
    '2025-04-15', 
    '10:00 AM', 
    3, 
    105, 
    'Upcoming', 
    'Please focus on kitchen and bathrooms', 
    now() - interval '2 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '11111111-1111-1111-1111-111111111111'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000011'
  );
  
  INSERT INTO bookings (id, service_id, user_id, provider_id, date, time, duration, price, status, notes, created_at)
  SELECT
    'bbbbbbbb-0000-0000-0000-000000000002', 
    '33333333-3333-3333-3333-333333333333', 
    '00000000-0000-0000-0000-000000000002', 
    '00000000-0000-0000-0000-000000000013', 
    '2025-04-10', 
    '4:00 PM', 
    1, 
    45, 
    'Upcoming', 
    'Need help with calculus', 
    now() - interval '3 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '33333333-3333-3333-3333-333333333333'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000002'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000013'
  );
  
  INSERT INTO bookings (id, service_id, user_id, provider_id, date, time, duration, price, status, notes, created_at)
  SELECT
    'cccccccc-0000-0000-0000-000000000003', 
    '55555555-5555-5555-5555-555555555555', 
    '00000000-0000-0000-0000-000000000003', 
    '00000000-0000-0000-0000-000000000015', 
    '2025-03-25', 
    '9:00 AM', 
    2, 
    100, 
    'Completed', 
    NULL, 
    now() - interval '15 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '55555555-5555-5555-5555-555555555555'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000003'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000015'
  );
  
  INSERT INTO bookings (id, service_id, user_id, provider_id, date, time, duration, price, status, notes, created_at)
  SELECT
    'dddddddd-0000-0000-0000-000000000004', 
    '77777777-7777-7777-7777-777777777777', 
    '00000000-0000-0000-0000-000000000004', 
    '00000000-0000-0000-0000-000000000017', 
    '2025-03-20', 
    '1:00 PM', 
    3, 
    450, 
    'Completed', 
    'Please pay special attention to the leather seats', 
    now() - interval '20 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '77777777-7777-7777-7777-777777777777'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000004'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000017'
  );
  
  INSERT INTO bookings (id, service_id, user_id, provider_id, date, time, duration, price, status, notes, created_at)
  SELECT
    'eeeeeeee-0000-0000-0000-000000000005', 
    '99999999-9999-9999-9999-999999999999', 
    '00000000-0000-0000-0000-000000000005', 
    '00000000-0000-0000-0000-000000000019', 
    '2025-04-05', 
    '7:00 AM', 
    1, 
    60, 
    'Upcoming', 
    'Focus on strength training', 
    now() - interval '5 days'
  WHERE EXISTS (
    SELECT 1 FROM services WHERE id = '99999999-9999-9999-9999-999999999999'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000005'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000019'
  );
END
$$;

-- Create sample messages
DO $$
BEGIN
  -- Only insert if the sender and recipient exist
  INSERT INTO messages (id, sender_id, recipient_id, content, read, created_at)
  SELECT
    '11111111-0000-0000-0000-000000000001', 
    '00000000-0000-0000-0000-000000000001', 
    '00000000-0000-0000-0000-000000000011', 
    'Hi, I''m interested in booking a cleaning service. Do you have availability next week?', 
    true, 
    now() - interval '5 days'
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000011'
  );
  
  INSERT INTO messages (id, sender_id, recipient_id, content, read, created_at)
  SELECT
    '22222222-0000-0000-0000-000000000002', 
    '00000000-0000-0000-0000-000000000011', 
    '00000000-0000-0000-0000-000000000001', 
    'Hello! Yes, we have availability on Tuesday and Thursday next week. What time works best for you?', 
    true, 
    now() - interval '5 days'
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000011'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001'
  );
  
  INSERT INTO messages (id, sender_id, recipient_id, content, read, created_at)
  SELECT
    '33333333-0000-0000-0000-000000000003', 
    '00000000-0000-0000-0000-000000000001', 
    '00000000-0000-0000-0000-000000000011', 
    'Tuesday morning would be perfect. Do you need any specific information about my home?', 
    true, 
    now() - interval '4 days'
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000011'
  );
  
  INSERT INTO messages (id, sender_id, recipient_id, content, read, created_at)
  SELECT
    '44444444-0000-0000-0000-000000000004', 
    '00000000-0000-0000-0000-000000000011', 
    '00000000-0000-0000-0000-000000000001', 
    'Great! It would be helpful to know the size of your home and if you have any pets. Also, are there any areas you want us to focus on?', 
    true, 
    now() - interval '4 days'
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000011'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001'
  );
  
  INSERT INTO messages (id, sender_id, recipient_id, content, read, created_at)
  SELECT
    '55555555-0000-0000-0000-000000000005', 
    '00000000-0000-0000-0000-000000000002', 
    '00000000-0000-0000-0000-000000000013', 
    'Hello Dr. Chen, my son is struggling with calculus. Are you available for tutoring sessions?', 
    true, 
    now() - interval '3 days'
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000002'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000013'
  );
  
  INSERT INTO messages (id, sender_id, recipient_id, content, read, created_at)
  SELECT
    '66666666-0000-0000-0000-000000000006', 
    '00000000-0000-0000-0000-000000000013', 
    '00000000-0000-0000-0000-000000000002', 
    'Hi there! I''d be happy to help your son with calculus. Could you tell me what specific topics he''s struggling with?', 
    false, 
    now() - interval '2 days'
  WHERE EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000013'
  ) AND EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000002'
  );
END
$$;