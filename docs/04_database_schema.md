# 04 — Database Schema

## Overview
PostgreSQL database via Supabase. All tables use UUID primary keys and have `created_at`, `updated_at` timestamps.

---

## Core Tables

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  mobile VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'premium', 'support', 'verifier', 'admin')),
  is_email_verified BOOLEAN DEFAULT FALSE,
  is_mobile_verified BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profile_for VARCHAR(20) NOT NULL CHECK (profile_for IN ('self','son','daughter','brother','sister','relative','friend')),
  full_name VARCHAR(100) NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('male','female','other')),
  date_of_birth DATE NOT NULL,
  height_cm INTEGER,
  weight_kg INTEGER,
  complexion VARCHAR(20),
  body_type VARCHAR(20),
  marital_status VARCHAR(20) DEFAULT 'never_married' CHECK (marital_status IN ('never_married','divorced','widowed','awaiting_divorce')),
  about_me TEXT,
  -- Religion & Community
  religion VARCHAR(50),
  mother_tongue VARCHAR(50),
  caste VARCHAR(100),
  sub_caste VARCHAR(100),
  gotra VARCHAR(100),
  dhosam VARCHAR(50),
  -- Education & Career
  education_level VARCHAR(50),
  education_detail VARCHAR(200),
  college_name VARCHAR(200),
  occupation VARCHAR(100),
  occupation_detail VARCHAR(200),
  company_name VARCHAR(200),
  income_range VARCHAR(50),
  -- Location
  country VARCHAR(100) DEFAULT 'India',
  state VARCHAR(100),
  city VARCHAR(100),
  -- Lifestyle
  diet VARCHAR(20) CHECK (diet IN ('vegetarian','non_vegetarian','eggetarian','vegan','jain')),
  smoking VARCHAR(20) CHECK (smoking IN ('no','occasionally','yes')),
  drinking VARCHAR(20) CHECK (drinking IN ('no','occasionally','yes')),
  physical_fitness TEXT,
  -- Horoscope
  star_rasi VARCHAR(50),
  nakshatra VARCHAR(50),
  horoscope_match_required BOOLEAN DEFAULT FALSE,
  manglik VARCHAR(20),
  -- Profile Status
  profile_completion_pct INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  admin_status VARCHAR(20) DEFAULT 'pending' CHECK (admin_status IN ('pending','approved','rejected','suspended')),
  -- Profile creator (if not self)
  creator_user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### family_details
```sql
CREATE TABLE family_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  family_type VARCHAR(20) CHECK (family_type IN ('joint','nuclear','extended')),
  family_status VARCHAR(30) CHECK (family_status IN ('middle_class','upper_middle','affluent','rich')),
  family_values VARCHAR(20) CHECK (family_values IN ('orthodox','traditional','moderate','liberal')),
  father_status VARCHAR(50),
  mother_status VARCHAR(50),
  num_brothers INTEGER DEFAULT 0,
  num_sisters INTEGER DEFAULT 0,
  brothers_married INTEGER DEFAULT 0,
  sisters_married INTEGER DEFAULT 0,
  native_place VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### partner_preferences
```sql
CREATE TABLE partner_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  age_min INTEGER DEFAULT 18,
  age_max INTEGER DEFAULT 45,
  height_min_cm INTEGER,
  height_max_cm INTEGER,
  marital_status_pref TEXT[], -- array of acceptable statuses
  religion_pref TEXT[],
  caste_pref TEXT[],
  caste_no_bar BOOLEAN DEFAULT FALSE,
  mother_tongue_pref TEXT[],
  education_pref TEXT[],
  occupation_pref TEXT[],
  income_min VARCHAR(50),
  location_pref TEXT[],
  diet_pref TEXT[],
  smoking_pref VARCHAR(20) DEFAULT 'no',
  drinking_pref VARCHAR(20) DEFAULT 'no',
  star_rasi_pref TEXT[],
  about_partner TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### photos
```sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  cloudinary_public_id VARCHAR(200),
  is_primary BOOLEAN DEFAULT FALSE,
  is_visible_to VARCHAR(20) DEFAULT 'all' CHECK (is_visible_to IN ('all','members','matches_only','hidden')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### verifications
```sql
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  id_verified BOOLEAN DEFAULT FALSE,
  photo_verified BOOLEAN DEFAULT FALSE,
  aadhaar_verified BOOLEAN DEFAULT FALSE, -- SKIPPED - placeholder
  verification_score INTEGER DEFAULT 0,
  id_document_type VARCHAR(50),
  id_document_url VARCHAR(500),
  selfie_url VARCHAR(500),
  admin_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### match_scores
```sql
CREATE TABLE match_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_a UUID REFERENCES profiles(id),
  profile_b UUID REFERENCES profiles(id),
  score INTEGER NOT NULL,
  grade VARCHAR(20),
  community_score INTEGER,
  education_score INTEGER,
  age_score INTEGER,
  location_score INTEGER,
  lifestyle_score INTEGER,
  family_score INTEGER,
  interests_score INTEGER,
  income_score INTEGER,
  reasons TEXT[],
  computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_a, profile_b)
);
```

### interests
```sql
CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(sender_id, receiver_id)
);
```

### shortlists
```sql
CREATE TABLE shortlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  shortlisted_profile_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, shortlisted_profile_id)
);
```

### messages / chat_threads
```sql
CREATE TABLE chat_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_a UUID REFERENCES profiles(id),
  profile_b UUID REFERENCES profiles(id),
  interest_id UUID REFERENCES interests(id),
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES chat_threads(id),
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### membership_plans + subscriptions
```sql
CREATE TABLE membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL, -- 'free', 'gold', 'diamond', 'platinum'
  price_inr INTEGER NOT NULL,
  duration_months INTEGER,
  interests_per_month INTEGER,
  contact_reveals_per_month INTEGER,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES membership_plans(id),
  starts_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_reference VARCHAR(200),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### reports + block_list + audit_logs
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES profiles(id),
  reported_id UUID REFERENCES profiles(id),
  reason VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','reviewed','resolved','dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE block_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES profiles(id),
  blocked_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  ip_address INET,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
