// src/data/compatibility-questions.ts
// 21-point compatibility questionnaire for Elite Tamil Matrimony
// 3 questions per category × 7 categories = 21 questions

export type AnswerOption = {
  value: string;
  label: string;
};

export type CompatibilityQuestion = {
  id: string;           // e.g. "lifestyle_1"
  category: string;     // e.g. "Lifestyle"
  question: string;
  options: AnswerOption[];
  weight: number;       // 1 = standard, higher = more important
};

export const COMPATIBILITY_CATEGORIES = [
  'Lifestyle',
  'Family Values',
  'Career & Education',
  'Location & Future Plans',
  'Personal Values',
  'Social Life',
  'Relationship Expectations',
];

export const COMPATIBILITY_QUESTIONS: CompatibilityQuestion[] = [
  // ── LIFESTYLE ───────────────────────────────────────────────────
  {
    id: 'lifestyle_1',
    category: 'Lifestyle',
    question: 'How do you prefer to spend weekends?',
    options: [
      { value: 'home_family', label: 'At home with family' },
      { value: 'outdoor_activities', label: 'Outdoor activities & travel' },
      { value: 'social_gatherings', label: 'Social gatherings & events' },
      { value: 'personal_hobbies', label: 'Personal hobbies & me-time' },
    ],
    weight: 1,
  },
  {
    id: 'lifestyle_2',
    category: 'Lifestyle',
    question: 'What best describes your dietary preference?',
    options: [
      { value: 'vegetarian', label: 'Strictly vegetarian' },
      { value: 'non_veg_occasional', label: 'Vegetarian but occasional non-veg OK' },
      { value: 'non_vegetarian', label: 'Non-vegetarian' },
      { value: 'flexible', label: "Flexible / doesn't matter" },
    ],
    weight: 1,
  },
  {
    id: 'lifestyle_3',
    category: 'Lifestyle',
    question: 'How important is fitness and health to you?',
    options: [
      { value: 'very_important', label: 'Very important — active lifestyle' },
      { value: 'moderately_important', label: 'Moderately important' },
      { value: 'not_priority', label: 'Not a priority currently' },
      { value: 'flexible', label: "Flexible" },
    ],
    weight: 1,
  },

  // ── FAMILY VALUES ──────────────────────────────────────────────
  {
    id: 'family_1',
    category: 'Family Values',
    question: 'What type of family setup do you prefer after marriage?',
    options: [
      { value: 'joint_family', label: 'Joint family' },
      { value: 'nuclear_open', label: 'Nuclear but close to family' },
      { value: 'nuclear_independent', label: 'Fully nuclear / independent' },
      { value: 'flexible', label: 'Flexible' },
    ],
    weight: 1,
  },
  {
    id: 'family_2',
    category: 'Family Values',
    question: 'How involved should families be in major life decisions?',
    options: [
      { value: 'very_involved', label: 'Very involved — family first' },
      { value: 'consulted', label: 'Consulted but couple decides' },
      { value: 'minimal', label: 'Minimal — couple is independent' },
      { value: 'flexible', label: 'Flexible' },
    ],
    weight: 1,
  },
  {
    id: 'family_3',
    category: 'Family Values',
    question: 'What are your thoughts on having children?',
    options: [
      { value: 'want_soon', label: 'Want children soon after marriage' },
      { value: 'want_later', label: 'Want children, but after a few years' },
      { value: 'open', label: 'Open to having children' },
      { value: 'no_children', label: 'Not keen on having children' },
    ],
    weight: 1,
  },

  // ── CAREER & EDUCATION ─────────────────────────────────────────
  {
    id: 'career_1',
    category: 'Career & Education',
    question: 'How important is your career/professional life to you?',
    options: [
      { value: 'top_priority', label: 'Top priority — career-driven' },
      { value: 'balanced', label: 'Balance between career and family' },
      { value: 'family_first', label: 'Family comes first over career' },
      { value: 'flexible', label: 'Flexible' },
    ],
    weight: 1,
  },
  {
    id: 'career_2',
    category: 'Career & Education',
    question: 'After marriage, do you expect your partner to work?',
    options: [
      { value: 'yes_both_work', label: 'Yes, both should work' },
      { value: 'partners_choice', label: "Partner's personal choice" },
      { value: 'prefer_home', label: 'Prefer partner focuses on home/family' },
      { value: 'flexible', label: 'Flexible / situation-dependent' },
    ],
    weight: 1,
  },
  {
    id: 'career_3',
    category: 'Career & Education',
    question: 'How do you prefer to manage household finances?',
    options: [
      { value: 'joint_account', label: 'Joint account — transparent sharing' },
      { value: 'separate_contribute', label: 'Separate accounts, contribute to household' },
      { value: 'one_manages', label: 'One person manages finances' },
      { value: 'discuss_together', label: 'Discuss and decide together' },
    ],
    weight: 1,
  },

  // ── LOCATION & FUTURE PLANS ────────────────────────────────────
  {
    id: 'location_1',
    category: 'Location & Future Plans',
    question: 'Where do you see yourself living long-term?',
    options: [
      { value: 'tamil_nadu', label: 'Tamil Nadu / South India' },
      { value: 'metro_india', label: 'Metro city in India' },
      { value: 'nri_abroad', label: 'Abroad (NRI)' },
      { value: 'open', label: 'Open to anywhere' },
    ],
    weight: 1,
  },
  {
    id: 'location_2',
    category: 'Location & Future Plans',
    question: 'Are you open to relocating after marriage?',
    options: [
      { value: 'yes_anywhere', label: 'Yes, anywhere in the world' },
      { value: 'yes_india', label: 'Yes, within India' },
      { value: 'no_prefer_here', label: 'Prefer to stay in current location' },
      { value: 'discuss', label: 'Will discuss and decide together' },
    ],
    weight: 1,
  },
  {
    id: 'location_3',
    category: 'Location & Future Plans',
    question: 'What are your long-term financial goals?',
    options: [
      { value: 'own_home', label: 'Own a home within 5 years' },
      { value: 'savings_investment', label: 'Focus on savings & investments' },
      { value: 'business_own', label: 'Start own business' },
      { value: 'comfortable_lifestyle', label: 'Comfortable lifestyle, not over-plan' },
    ],
    weight: 1,
  },

  // ── PERSONAL VALUES ────────────────────────────────────────────
  {
    id: 'values_1',
    category: 'Personal Values',
    question: 'How important is religion/spirituality in your life?',
    options: [
      { value: 'very_religious', label: 'Very important — follow traditions' },
      { value: 'moderately', label: 'Moderately important' },
      { value: 'cultural_only', label: 'Cultural/festival observance only' },
      { value: 'not_important', label: 'Not important' },
    ],
    weight: 1,
  },
  {
    id: 'values_2',
    category: 'Personal Values',
    question: 'How do you handle disagreements or conflicts?',
    options: [
      { value: 'talk_immediately', label: 'Talk it out immediately' },
      { value: 'take_space', label: 'Take time, then discuss' },
      { value: 'avoid_conflict', label: 'Prefer to avoid conflict' },
      { value: 'depends', label: 'Depends on the situation' },
    ],
    weight: 1,
  },
  {
    id: 'values_3',
    category: 'Personal Values',
    question: 'What does a successful marriage mean to you?',
    options: [
      { value: 'emotional_partnership', label: 'Deep emotional partnership' },
      { value: 'mutual_respect', label: 'Mutual respect & understanding' },
      { value: 'shared_goals', label: 'Shared life goals & growth' },
      { value: 'all_above', label: 'All of the above equally' },
    ],
    weight: 1,
  },

  // ── SOCIAL LIFE ────────────────────────────────────────────────
  {
    id: 'social_1',
    category: 'Social Life',
    question: 'How would you describe your social personality?',
    options: [
      { value: 'very_social', label: 'Very social — enjoy large gatherings' },
      { value: 'social_selective', label: 'Social but selective with friends' },
      { value: 'introverted', label: 'Introverted — prefer small circles' },
      { value: 'ambiverted', label: 'Ambiverted — depends on mood' },
    ],
    weight: 1,
  },
  {
    id: 'social_2',
    category: 'Social Life',
    question: 'How often do you enjoy travelling?',
    options: [
      { value: 'frequent', label: 'Frequently — love exploring' },
      { value: 'occasionally', label: 'Occasionally — a few times a year' },
      { value: 'rarely', label: 'Rarely — prefer staying home' },
      { value: 'depends', label: 'Depends on circumstances' },
    ],
    weight: 1,
  },
  {
    id: 'social_3',
    category: 'Social Life',
    question: 'How important is maintaining friendships after marriage?',
    options: [
      { value: 'very_important', label: 'Very important — keep social life active' },
      { value: 'balanced', label: 'Balance between friends and family' },
      { value: 'family_focus', label: 'Family becomes the main social circle' },
      { value: 'flexible', label: 'Flexible' },
    ],
    weight: 1,
  },

  // ── RELATIONSHIP EXPECTATIONS ──────────────────────────────────
  {
    id: 'relationship_1',
    category: 'Relationship Expectations',
    question: 'How much personal space do you need in a relationship?',
    options: [
      { value: 'lots_of_space', label: 'A lot — independence is important' },
      { value: 'balanced', label: 'Balanced — together yet independent' },
      { value: 'close_bonded', label: 'Prefer being very close and bonded' },
      { value: 'flexible', label: 'Flexible' },
    ],
    weight: 1,
  },
  {
    id: 'relationship_2',
    category: 'Relationship Expectations',
    question: 'How do you prefer to show and receive affection?',
    options: [
      { value: 'words', label: 'Words of affirmation' },
      { value: 'acts', label: 'Acts of service & care' },
      { value: 'quality_time', label: 'Quality time together' },
      { value: 'all_ways', label: 'All of the above' },
    ],
    weight: 1,
  },
  {
    id: 'relationship_3',
    category: 'Relationship Expectations',
    question: 'What is most important to you in a life partner?',
    options: [
      { value: 'values_character', label: 'Values & character' },
      { value: 'emotional_connect', label: 'Emotional connection' },
      { value: 'shared_goals', label: 'Shared life goals' },
      { value: 'family_compatibility', label: 'Family compatibility' },
    ],
    weight: 1,
  },
];

// Map: compatible answer pairs (beyond exact matches)
// If user A picks value X and user B picks value Y, they still get points
export const COMPATIBLE_PAIRS: Record<string, string[]> = {
  // Lifestyle
  'home_family':         ['home_family', 'flexible'],
  'outdoor_activities':  ['outdoor_activities', 'social_gatherings', 'flexible'],
  'social_gatherings':   ['social_gatherings', 'outdoor_activities', 'flexible'],
  'personal_hobbies':    ['personal_hobbies', 'flexible'],
  'vegetarian':          ['vegetarian', 'non_veg_occasional'],
  'non_veg_occasional':  ['vegetarian', 'non_veg_occasional', 'non_vegetarian', 'flexible'],
  'non_vegetarian':      ['non_veg_occasional', 'non_vegetarian', 'flexible'],
  'flexible':            ['vegetarian', 'non_veg_occasional', 'non_vegetarian', 'flexible',
                          'home_family', 'outdoor_activities', 'social_gatherings', 'personal_hobbies',
                          'very_important', 'moderately_important', 'not_priority',
                          'joint_family', 'nuclear_open', 'nuclear_independent',
                          'very_involved', 'consulted', 'minimal',
                          'yes_anywhere', 'yes_india', 'no_prefer_here', 'discuss',
                          'lots_of_space', 'balanced', 'close_bonded',
                          'top_priority', 'family_first', 'balanced',
                          'very_social', 'social_selective', 'introverted', 'ambiverted',
                          'frequent', 'occasionally', 'rarely', 'depends',
                          'very_important', 'balanced', 'family_focus'],
  // Family
  'joint_family':        ['joint_family', 'nuclear_open', 'flexible'],
  'nuclear_open':        ['joint_family', 'nuclear_open', 'nuclear_independent', 'flexible'],
  'nuclear_independent': ['nuclear_open', 'nuclear_independent', 'flexible'],
  'very_involved':       ['very_involved', 'consulted', 'flexible'],
  'consulted':           ['very_involved', 'consulted', 'minimal', 'flexible'],
  'minimal':             ['consulted', 'minimal', 'flexible'],
  'want_soon':           ['want_soon', 'open', 'flexible'],
  'want_later':          ['want_later', 'open', 'flexible'],
  'open':                ['want_soon', 'want_later', 'open', 'tamil_nadu', 'metro_india', 'nri_abroad'],
  // Career
  'top_priority':        ['top_priority', 'balanced'],
  'balanced':            ['top_priority', 'balanced', 'family_first'],
  'family_first':        ['balanced', 'family_first'],
  'yes_both_work':       ['yes_both_work', 'partners_choice', 'flexible'],
  'partners_choice':     ['yes_both_work', 'partners_choice', 'prefer_home', 'flexible'],
  'prefer_home':         ['partners_choice', 'prefer_home', 'flexible'],
  // Location
  'tamil_nadu':          ['tamil_nadu', 'metro_india', 'open'],
  'metro_india':         ['tamil_nadu', 'metro_india', 'open'],
  'nri_abroad':          ['nri_abroad', 'open'],
  // Relationship
  'lots_of_space':       ['lots_of_space', 'balanced', 'flexible'],
  'close_bonded':        ['close_bonded', 'balanced', 'flexible'],
  // Social
  'very_social':         ['very_social', 'social_selective', 'ambiverted'],
  'social_selective':    ['very_social', 'social_selective', 'ambiverted'],
  'introverted':         ['introverted', 'ambiverted', 'social_selective'],
  'ambiverted':          ['very_social', 'social_selective', 'introverted', 'ambiverted'],
  'frequent':            ['frequent', 'occasionally', 'depends'],
  'occasionally':        ['frequent', 'occasionally', 'rarely', 'depends'],
  'rarely':              ['occasionally', 'rarely', 'depends'],
  'depends':             ['frequent', 'occasionally', 'rarely', 'depends'],
};
