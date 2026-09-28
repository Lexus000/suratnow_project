-- Create Enum for Roles
CREATE TYPE user_role AS ENUM ('user', 'admin', 'petugas');

-- Create users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nik TEXT UNIQUE,
  phone TEXT,
  role user_role DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create letter_requests table
CREATE TABLE letter_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  letter_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  purpose TEXT,
  status TEXT DEFAULT 'pending',
  attachments JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE letter_requests ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- Letter Requests policies
CREATE POLICY "Users can view own requests" 
ON letter_requests FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests" 
ON letter_requests FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" 
ON letter_requests FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND (users.role = 'admin' OR users.role = 'petugas')
  )
);

CREATE POLICY "Admins can update all requests" 
ON letter_requests FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND (users.role = 'admin' OR users.role = 'petugas')
  )
);
