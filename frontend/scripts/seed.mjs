import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uvuviufnmuaoeptngfjt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_txkN-fk2Z8nG-Rno4664UQ_Na5RnD9N';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ── Tamil Data Sets ────────────────────────────────────────────────────

const MALE_NAMES = [
  'Arjun Krishnamurthy', 'Vikram Subramanian', 'Karthik Ramaswamy', 'Surya Venkataraman',
  'Arun Balakrishnan', 'Rahul Thyagarajan', 'Deepak Sundaram', 'Naveen Natarajan',
  'Sathish Rajan', 'Dinesh Murugesan', 'Manoj Pillai', 'Praveen Iyer',
  'Sachin Annamalai', 'Rajesh Gopalakrishnan', 'Vivek Chandrasekaran', 'Ashwin Kannan',
  'Shankar Venkatesan', 'Pradeep Muthukumar', 'Suresh Lakshmanan', 'Balaji Narayanan',
  'Harish Palaniswamy', 'Siva Kumar Thangavel', 'Prasad Duraipandian', 'Manivannan Selvam',
  'Gokul Saravanan', 'Abishek Ramachandran', 'Yuvaraj Thiruvengadam', 'Balamurugan Palanivel',
];

const FEMALE_NAMES = [
  'Priya Krishnamurthy', 'Kavitha Subramaniam', 'Deepa Ramaswamy', 'Anitha Venkataraman',
  'Meena Balakrishnan', 'Saranya Thyagarajan', 'Divya Sundaram', 'Nandhini Natarajan',
  'Pavithra Murugesan', 'Keerthana Rajan', 'Lakshmi Pillai', 'Nithya Iyer',
  'Swetha Annamalai', 'Revathi Gopalakrishnan', 'Pooja Chandrasekaran', 'Anusha Kannan',
  'Gayathri Venkatesan', 'Ramya Muthukumar', 'Srimathi Lakshmanan', 'Bhuvana Narayanan',
  'Janani Palaniswamy', 'Mythili Thangavel', 'Sowmiya Duraipandian', 'Sathyapriya Selvam',
  'Vaishnavi Saravanan', 'Abinaya Ramachandran', 'Mahalakshmi Thiruvengadam',
];

const CASTES = [
  'Brahmin', 'Pillai', 'Nadar', 'Mudaliar', 'Chettiar', 'Gounder', 'Vellalar',
  'Naicker', 'Yadav', 'Thevar', 'Vanniyar', 'Senguntha Mudaliar',
];

const STARS = [
  'Ashwini', 'Bharani', 'Krithika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Moola', 'Purva Ashadha', 'Uttara Ashadha', 'Shravan', 'Dhanishtha',
  'Shatabhisha', 'Purva Bhadra', 'Uttara Bhadra', 'Revati',
];

const RASIS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const TN_CITIES = [
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy', 'Tirunelveli',
  'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Kumbakonam', 'Thanjavur',
  'Karur', 'Namakkal', 'Hosur', 'Nagercoil', 'Tiruppur', 'Kanchipuram',
];

const MALE_EDUCATIONS = [
  'B.E. Computer Science', 'M.Tech Software Engineering', 'B.Tech Information Technology',
  'MBA Finance', 'M.Sc Computer Science', 'B.E. Electrical Engineering',
  'M.E. Civil Engineering', 'B.Tech Mechanical Engineering', 'CA', 'B.Sc Mathematics',
];

const FEMALE_EDUCATIONS = [
  'B.E. Computer Science', 'B.Sc Nursing', 'MBA HR', 'M.Sc Biotechnology',
  'B.Ed', 'B.Tech IT', 'MA English Literature', 'B.Com', 'M.Sc Chemistry',
  'B.Pharm', 'M.Tech CSE', 'B.Sc Psychology',
];

const MALE_OCCUPATIONS = [
  'Software Engineer', 'Senior Developer', 'Product Manager', 'Data Scientist',
  'Business Analyst', 'DevOps Engineer', 'System Architect', 'Team Lead',
  'Bank Manager', 'Civil Engineer', 'Doctor', 'Professor',
];

const FEMALE_OCCUPATIONS = [
  'Software Engineer', 'Nurse', 'Teacher', 'HR Manager', 'Accountant',
  'Content Writer', 'Data Analyst', 'Doctor', 'Pharmacist', 'Architect',
  'Research Scientist', 'UX Designer',
];

const INCOMES = [
  '3-5 Lakhs', '5-7 Lakhs', '7-10 Lakhs',
  '10-15 Lakhs', '15-20 Lakhs', '20-25 Lakhs',
  '25-35 Lakhs', '35+ Lakhs',
];

const HEIGHTS_MALE = [
  "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"",
];

const HEIGHTS_FEMALE = [
  "5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"",
];

const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian'];
const HOBBIES = [
  'Reading', 'Cooking', 'Travelling', 'Music', 'Photography', 'Yoga',
  'Gardening', 'Dancing', 'Cricket', 'Badminton', 'Painting', 'Cycling',
];

const ABOUT_TEMPLATES = [
  'Looking for a life partner who values family, tradition, and mutual respect. I am a simple person with strong family values.',
  'I am a hardworking professional who believes in balancing career and family. Looking for someone who shares similar values.',
  'Family-oriented person seeking a compatible life partner for a happy and prosperous life together.',
  'Simple, educated and family-oriented. Looking for a well-educated and understanding life partner.',
  'Seeking a partner with good values, education and family background for a meaningful relationship.',
];

// ── Utilities ──────────────────────────────────────────────────────────

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function randomDob(minAge, maxAge) {
  const now = new Date();
  const minYear = now.getFullYear() - maxAge;
  const maxYear = now.getFullYear() - minAge;
  const year = minYear + Math.floor(Math.random() * (maxYear - minYear + 1));
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function mobileFor(index) {
  // Generate unique 10-digit mobile numbers starting with 9, 8, 7, or 6
  const prefix = ['9', '8', '7', '6'][index % 4];
  const num = String(100000000 + index * 7919).padStart(9, '0');
  return prefix + num.slice(0, 9);
}

// ── Registration function (mirrors auth-store.registerUser) ────────────

async function registerProfile(payload, index) {
  const mobile = payload.mobile;
  const baseEmail = `${mobile}@etm.app`;
  const password = `ETM_${mobile}_2024`;

  // 1. Sign up in Supabase auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: baseEmail,
    password,
    options: {
      data: {
        name: payload.name,
        mobile,
        profile_for: payload.profileFor,
      },
    },
  });

  if (authError) {
    console.error(`  ✗ Auth signup failed for ${payload.name}: ${authError.message}`);
    return null;
  }

  if (!authData.user) {
    console.error(`  ✗ No user returned for ${payload.name}`);
    return null;
  }

  const userId = authData.user.id;

  // Build the profile row (matching our schema column names)
  const profileRow = {
    id: userId,
    profile_for: payload.profileFor,
    name: payload.name,
    mobile,
    gender: payload.gender,
    dob: payload.dob,
    height: payload.height,
    physical_status: 'Normal',
    marital_status: 'Never Married',
    religion: 'Hindu',
    caste: payload.caste,
    mother_tongue: 'Tamil',
    education: payload.education,
    occupation: payload.occupation,
    income: payload.income,
    country: 'India',
    state: 'Tamil Nadu',
    city: payload.city,
    diet: payload.diet,
    star: payload.star,
    rasi: payload.rasi,
    hobbies: payload.hobbies,
    about: payload.about,
    is_verified: Math.random() > 0.3,
    is_premium: Math.random() > 0.7,
    partner_age_min: payload.gender === 'male' ? 22 : 25,
    partner_age_max: payload.gender === 'male' ? 30 : 35,
    partner_religion: 'Hindu',
    partner_country: 'India',
    auth_email: baseEmail,  // Store so login works instantly
    created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    last_active: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // 2. Upsert the full profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .upsert(profileRow, { onConflict: 'id' })
    .select('id, name, mobile, auth_email')
    .single();

  if (profileError) {
    console.error(`  ✗ Profile upsert failed for ${payload.name}: ${profileError.message}`);
    return null;
  }

  return profile;
}

// ── Main seeder ────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Elite Tamil Matrimony — Database Seeder');
  console.log('==========================================\n');

  const profiles = [];

  // Build 28 male + 27 female profiles
  for (let i = 0; i < MALE_NAMES.length; i++) {
    profiles.push({
      name: MALE_NAMES[i],
      gender: 'male',
      mobile: mobileFor(i),
      profileFor: 'Myself',
      dob: randomDob(24, 35),
      height: pick(HEIGHTS_MALE),
      caste: pick(CASTES),
      education: pick(MALE_EDUCATIONS),
      occupation: pick(MALE_OCCUPATIONS),
      income: pick(INCOMES),
      city: pick(TN_CITIES),
      diet: pick(DIETS),
      star: pick(STARS),
      rasi: pick(RASIS),
      hobbies: pickN(HOBBIES, 3),
      about: pick(ABOUT_TEMPLATES),
    });
  }

  for (let i = 0; i < FEMALE_NAMES.length; i++) {
    profiles.push({
      name: FEMALE_NAMES[i],
      gender: 'female',
      mobile: mobileFor(100 + i),
      profileFor: 'Myself',
      dob: randomDob(22, 32),
      height: pick(HEIGHTS_FEMALE),
      caste: pick(CASTES),
      education: pick(FEMALE_EDUCATIONS),
      occupation: pick(FEMALE_OCCUPATIONS),
      income: pick(INCOMES),
      city: pick(TN_CITIES),
      diet: pick(DIETS),
      star: pick(STARS),
      rasi: pick(RASIS),
      hobbies: pickN(HOBBIES, 3),
      about: pick(ABOUT_TEMPLATES),
    });
  }

  console.log(`📋 Registering ${profiles.length} profiles...\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < profiles.length; i++) {
    const p = profiles[i];
    process.stdout.write(`[${String(i + 1).padStart(2, '0')}/${profiles.length}] ${p.gender === 'male' ? '👨' : '👩'} ${p.name} (${p.mobile})... `);

    const result = await registerProfile(p, i);

    if (result) {
      console.log(`✅ ID: ${result.id.slice(0, 8)}...`);
      success++;
    } else {
      console.log(`❌ FAILED`);
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n==========================================');
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log(`📊 Total:   ${profiles.length}`);

  // Print login credentials for testing
  console.log('\n🔑 Test login credentials (use OTP 123456):');
  console.log('  Male accounts:');
  profiles.filter(p => p.gender === 'male').slice(0, 5).forEach(p => {
    console.log(`    📱 ${p.mobile} — ${p.name}`);
  });
  console.log('  Female accounts:');
  profiles.filter(p => p.gender === 'female').slice(0, 5).forEach(p => {
    console.log(`    📱 ${p.mobile} — ${p.name}`);
  });
}

seed().catch(console.error);
