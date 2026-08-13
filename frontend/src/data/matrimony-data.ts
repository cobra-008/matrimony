// src/data/matrimony-data.ts
// Complete dropdown data for all matrimony form fields
// Based on real BharatMatrimony platform data — comprehensive all-India
// ── TASK 1 FIX: Complete caste & sub-caste system rebuilt ──

export const PROFILE_FOR_OPTIONS = [
  { value: 'myself', label: 'Myself' },
  { value: 'son', label: 'My Son' },
  { value: 'daughter', label: 'My Daughter' },
  { value: 'brother', label: 'My Brother' },
  { value: 'sister', label: 'My Sister' },
  { value: 'relative', label: 'My Relative' },
  { value: 'friend', label: 'My Friend' },
];

export const RELIGIONS = [
  'Hindu',
  'Muslim',
  'Christian',
  'Jain',
  'Buddhist',
  'Sikh',
  'Parsi / Zoroastrian',
  'Jewish',
  'No Religion',
  'Spiritual - Not Religious',
  'Other',
];

export const MOTHER_TONGUES = [
  'Awadhi',
  'Bengali',
  'Bhojpuri',
  'Bihari',
  'Brij Bhasha',
  'Dogri',
  'English',
  'Garhwali',
  'Gujarati',
  'Haryanvi',
  'Hindi',
  'Kannada',
  'Kashmiri',
  'Konkani',
  'Kutchi',
  'Ladakhi',
  'Lepcha',
  'Maithili',
  'Malayalam',
  'Manipuri',
  'Marathi',
  'Marwari',
  'Meitei',
  'Mizo',
  'Mundari',
  'Nepali',
  'Odia',
  'Punjabi',
  'Rajasthani',
  'Sanskrit',
  'Santali',
  'Sindhi',
  'Sourashtra',
  'Tamil',
  'Telugu',
  'Tulu',
  'Urdu',
  'Other',
];

// ── CASTES BY RELIGION ──────────────────────────────────────────────

// Hindu Castes (All-India comprehensive)
// IMPORTANT: This list contains ONLY parent caste names.
// Combined "Caste - Sub-caste" entries have been removed.
// Sub-castes belong in CASTE_TO_SUBCASTE below.
export const HINDU_CASTES = [
  // Brahmin Communities
  'Brahmin',
  'Bhumihar Brahmin',
  // Kshatriya / Warrior
  'Kshatriya',
  'Rajput',
  // North Indian Trading
  'Agarwal',
  'Arora',
  'Baniya',
  'Khatri',
  'Lohana',
  'Maheshwari',
  'Oswal',
  'Sarawagi',
  // South Indian Business / Merchant
  'Chettiar',
  'Devanga',
  'Sourashtra',
  // Kayastha
  'Kayastha',
  // Tamil Vellalar Communities
  'Agamudaiyar',
  'Mudaliar',
  'Pillai',
  'Saiva Vellalar',
  'Sengunta Mudaliar',
  'Sengunthar',
  'Vellalar',
  // Gounder Communities
  'Gounder',
  'Kongu Vellalar',
  // Naidu Communities
  'Naidu',
  // Komati / Kamma / Telugu Communities
  'Kamma',
  'Komati',
  'Reddy',
  'Kapu',
  // Nadar / Shanar
  'Nadar',
  // Maratha / Maharashtra
  'Maratha',
  // Kallar / Maravar / Agamudaiyar (Mukkulathor)
  'Kallar',
  'Maravar',
  'Thevar / Mukkulathor',
  // Vanniyar
  'Vanniyar / Padayachi',
  // Ezhava / Thiyya (Kerala)
  'Ezhava',
  'Thiyya',
  // Nair (Kerala)
  'Nair',
  // Lingayat (Karnataka)
  'Lingayat',
  // Vishwakarma (Craftsmen)
  'Vishwakarma',
  // Other Tamil Communities
  'Idaiyar',
  'Konar / Yadav',
  'Muthuraja',
  'Naicker',
  'Nattar',
  'Nayaka',
  'Padayachi',
  // SC / ST / Dalit Communities
  'Adi Dravidar',
  'Arunthathiyar',
  'Chakkiliyar',
  'Pallar',
  'Paraiyar',
  'Pulaya',
  'SC / Scheduled Caste',
  'ST / Scheduled Tribe',
  // BC / MBC / OBC
  'BC / Backward Class',
  'MBC / Most Backward Class',
  'OBC / Other Backward Class',
  'OC / Open Category',
  // All-India Communities
  'Agri',
  'Bhandari',
  'Bhatia',
  'Bhoi',
  'Brahmbhatt',
  'Chamar',
  'Dhangar',
  'Dhobi',
  'Goud',
  'Gujar',
  'Gurjar',
  'Jat',
  'Jatav',
  'Kori',
  'Koshthi',
  'Kumhar',
  'Kunbi',
  'Kurmi',
  'Kuruba',
  'Lohar',
  'Mahar',
  'Mahishya',
  'Mali',
  'Mallah',
  'Maurya',
  'Meena',
  'Mochi',
  'Munnuru Kapu',
  'Patidaar / Patel',
  'Patil',
  'Rawat',
  'Shilpkar',
  'Sunar',
  'Teli',
  'Thakkar',
  'Udayar',
  'Vaishnav Vania',
  'Yadav',
  "Doesn't Matter / Inter-caste",
  'Other',
];

// ── SUB-CASTES BY CASTE ──────────────────────────────────────────────
// RULE: Every caste that has meaningful sub-divisions must be listed here.
// The Caste dropdown must ONLY show parent caste names.
// Sub-castes are shown ONLY after a caste is selected.
export const CASTE_TO_SUBCASTE: Record<string, string[]> = {

  // ── BRAHMIN (comprehensive Tamil + All-India) ──
  'Brahmin': [
    'Anavil', 'Ashtasahasram', 'Audichya', 'Bhoomi',
    'Brahacharanam', 'Brahmbhatt', 'Dadhich / Dadheech',
    'Deshastha', 'Dravida', 'Gaur', 'Goud Saraswat',
    'Gurukkal', 'Havyaka', 'Iyengar', 'Iyer',
    'Jangid', 'Kaniyan', 'Kanyakubj', 'Kashmiri Pandit',
    'Konkanastha', 'Koota Brahmin', 'Kumaoni',
    'Madhwa', 'Maithil', 'Namboothiri', 'Niyogi',
    'Panchagrami', 'Pandit', 'Pushkarna', 'Rigvedi',
    'Samavedi', 'Saraswat', 'Saryuparin', 'Shivhalli',
    'Sivacharya', 'Smartha', 'Srivaishnava',
    'Thenkalai', 'Tyagi', 'Vadakalai', 'Vadama',
    'Vaidiki', 'Vaikhanasa', 'Vathima', 'Velanadu',
    'Vyas', 'Yajurvedi', 'Others',
  ],

  // ── BHUMIHAR BRAHMIN ──
  'Bhumihar Brahmin': [
    'Babhan', 'Bihar Bhumihar', 'Maithil Bhumihar', 'UP Bhumihar', 'Others',
  ],

  // ── KSHATRIYA ──
  'Kshatriya': [
    'Agnivanshi', 'Chandravanshi', 'Suryavanshi',
    'Kshatriya Raju', 'Agnivanshi Kshatriya', 'Chandravanshi Kshatriya',
    'Suryavanshi Kshatriya', 'Others',
  ],

  // ── NAIDU (Tamil / Andhra sub-groups) ──
  'Naidu': [
    'Balija', 'Gavara', 'Kamma Naidu', 'Kavarai',
    'Koppala Velama', 'Munnuru Kapu', 'Panta Kapu',
    'Telugu Kamma', 'Turpu Kapu', 'Velama Naidu',
    'Others',
  ],

  // ── CHETTIAR (Tamil merchant communities — complete BharatMatrimony list) ──
  'Chettiar': [
    '24 Manal Telugu Chettiar',
    '24 Manai Telugu Chettiar 16 Veedu',
    '24 Manai Telugu Chettiar 8 Veedu',
    'Achirapakkam Chettiar',
    'Agaram Vellan Chettiar',
    'Arya Vysya',
    'Ayira Vysya',
    'Beri Chettiar',
    'Devanga Chettiar',
    'Elur',
    'Gandla / Ganiga',
    'Kasukara',
    'Kongu Chettiar',
    'Kuruhini Chetty',
    'Manjapudur Chettiar',
    'Nattukottai Chettiar',
    'Padma Sallar',
    'Pannirandam Chettiar',
    'Parvatha Rajakulam',
    'Pattinavar',
    'Pattusali',
    'Sadhu Chetty',
    'Senal Thalaivar',
    'Sozhia Chetty',
    'Telugupatti',
    'Vadambar',
    'Vaniya Chettiar',
    'Vellan Chettiars',
    "Don't know sub-caste",
    "Don't wish to specify",
    'Others',
  ],

  // ── DEVANGA ──
  'Devanga': [
    'Devanga Chettiar', 'Devanga Koshti', 'Devanga Saliya', 'Others',
  ],

  // ── SOURASHTRA ──
  'Sourashtra': [
    'Devanga Sourashtra', 'Koshti', 'Patnulkarars',
    'Pattegar', 'Others',
  ],

  // ── AGAMUDAIYAR ──
  'Agamudaiyar': [
    'Rajakula Agamudaiyar', 'Servai', 'Thuluva Vellalar',
    'Others',
  ],

  // ── AGARWAL ──
  'Agarwal': [
    'Bansal', 'Garg', 'Goyal', 'Kansal', 'Mittal',
    'Singhal', 'Others',
  ],

  // ── ARORA ──
  'Arora': [
    'Bhasin', 'Chawla', 'Khanna', 'Malhotra', 'Mehta',
    'Sehgal', 'Sethi', 'Taneja', 'Others',
  ],

  // ── BANIYA ──
  'Baniya': [
    'Gupta', 'Mahajan', 'Rastogi', 'Sahu', 'Vaish',
    'Others',
  ],

  // ── BRAHMBHATT ──
  'Brahmbhatt': ['Audich', 'Khedaval', 'Mewada', 'Nagar', 'Others'],

  // ── CHAKKILIYAR ──
  'Chakkiliyar': ['Madiga', 'Arunthathiyar', 'Others'],
  'Arunthathiyar': ['Madiga', 'Others'],

  // ── GOUNDER (Kongu Vellalar) ──
  'Gounder': [
    'Anupama Gounder', 'Kongu Vellalar Gounder', 'Kurumba Gounder',
    'Nattu Gounder', 'Senguntha Gounder', 'Vettuva Gounder',
    'Others',
  ],

  // ── JATAV ──
  'Jatav': ['Chamar', 'Jatia', 'Raidas', 'Others'],

  // ── JAT ──
  'Jat': ['Ahulana', 'Dahiya', 'Deswal', 'Malik', 'Mann', 'Mor', 'Others'],

  // ── KALLAR ──
  'Kallar': [
    'Ambalakarar', 'Gandarvakottai Kallar', 'Piramalai Kallar',
    'Thondaiman Kallar', 'Others',
  ],

  // ── KAMMA ──
  'Kamma': ['Goda Kamma', 'Illuvellani Kamma', 'Telaga', 'Others'],

  // ── KAPU ──
  'Kapu': ['Balija', 'Munnuru Kapu', 'Ontari', 'Turpu Kapu', 'Others'],

  // ── KAYASTHA ──
  'Kayastha': [
    'Asthana', 'Bhatnagar', 'Mathur', 'Nigam',
    'Saxena', 'Shrivastava', 'Srivastava', 'Others',
  ],

  // ── KHATRI ──
  'Khatri': ['Arora', 'Bedi', 'Chopra', 'Kapoor', 'Mehra', 'Sahani', 'Others'],

  // ── KOMATI ──
  'Komati': ['Arya Vysya', 'Balija', 'Gandla', 'Gavaras', 'Others'],

  // ── KONGU VELLALAR ──
  'Kongu Vellalar': [
    'Chella Gounder', 'Kannan Gounder', 'Koorai Gounder',
    'Nattu Gounder', 'Others',
  ],

  // ── KSHATRIYA (already defined above) ──

  // ── KURMI ──
  'Kurmi': ['Kachhi', 'Kushwaha', 'Maurya', 'Patwa', 'Shakya', 'Others'],

  // ── LINGAYAT ──
  'Lingayat': [
    'Banajiga', 'Dikshitar', 'Ganigas', 'Panchamasali',
    'Reddyakki', 'Sadar Lingayat', 'Veerashaiva', 'Others',
  ],

  // ── LOHANA ──
  'Lohana': ['Bhatia', 'Khoja', 'Lohana Kshatriya', 'Others'],

  // ── LOHAR ──
  'Lohar': ['Panchal', 'Vishwakarma Lohar', 'Others'],

  // ── MAHAR ──
  'Mahar': ['Buddhist Mahar', 'Chambhar', 'Mang', 'Others'],

  // ── MAHESHWARI ──
  'Maheshwari': ['Bagodia', 'Dalmia', 'Gattani', 'Kothiwal', 'Others'],

  // ── MALI ──
  'Mali': ['Phulmali', 'Saini', 'Others'],

  // ── MALLAH ──
  'Mallah': ['Bind', 'Kahar', 'Kewat', 'Nishad', 'Others'],

  // ── MARATHA ──
  'Maratha': [
    'Bhosale', 'Deshmukh', 'Jadhav', 'Kadam', 'Kale',
    'More', 'Patil', 'Pawar', 'Shinde', 'Others',
  ],

  // ── MARAVAR ──
  'Maravar': [
    'Appanad Kondayam Kottai Maravar', 'Sembanad Maravar',
    'Thanjavur Maravar', 'Piramalai Maravar', 'Others',
  ],

  // ── MAURYA ──
  'Maurya': ['Kushwaha', 'Shakya', 'Others'],

  // ── MEENA ──
  'Meena': ['Rawat Meena', 'Jat Meena', 'Others'],

  // ── MUDALIAR ──
  'Mudaliar': [
    'Agamudaya Mudaliar', 'Arcot Mudaliar', 'Karkatta Mudaliar',
    'Saiva Mudaliar', 'Sengunthar Mudaliar', 'Senguntha Mudaliar',
    'Thondaimandala Saiva Mudaliar', 'Others',
  ],

  // ── MUNNURU KAPU ──
  'Munnuru Kapu': ['Kapu', 'Ontari', 'Others'],

  // ── NADAR ──
  'Nadar': [
    'Christian Nadar', 'Hindu Nadar', 'Kongu Nadar',
    'NRI Nadar', 'Others',
  ],

  // ── NAICKER ──
  'Naicker': ['Koundanpatti Naicker', 'Peria Naicker', 'Others'],

  // ── NAIR ──
  'Nair': [
    'Ambalavasi Nair', 'Illathu Nair', 'Kiriyathil Nair',
    'Kottayathu Nair', 'Kulashekara Nair', 'Swaroopathil Nair',
    'Veluthedath Nair', 'Others',
  ],

  // ── NATTAR ──
  'Nattar': ['Karkatta Nattar', 'Vellala Nattar', 'Others'],

  // ── NAYAKA ──
  'Nayaka': ['Besta Nayaka', 'Valmiki Nayaka', 'Others'],

  // ── OSWAL ──
  'Oswal': ['Doshi', 'Kothari', 'Lodha', 'Mehta', 'Shah', 'Others'],

  // ── PADAYACHI ──
  'Padayachi': ['Agnikula Kshatriya', 'Palli', 'Vanniyar', 'Others'],

  // ── PALLAR ──
  'Pallar': ['Devendra Kula Vellalar', 'Kudumban', 'Others'],

  // ── PARAIYAR ──
  'Paraiyar': ['Adi Dravidar', 'Sambavar', 'Others'],

  // ── PATIDAAR / PATEL ──
  'Patidaar / Patel': [
    'Kadva Patel', 'Leva Patel', 'Anjana Patel',
    'Baria Patel', 'Charotar Patel', 'Others',
  ],

  // ── PATIL ──
  'Patil': ['Deshmukh Patil', 'Kunbi Patil', 'Maratha Patil', 'Others'],

  // ── PILLAI ──
  'Pillai': [
    'Karkathar Pillai', 'Nair Pillai', 'Nanjil Pillai',
    'Saiva Pillai', 'Vellalar Pillai', 'Others',
  ],

  // ── PULAYA ──
  'Pulaya': ['Cheramar', 'Sambavar', 'Others'],

  // ── RAJPUT ──
  'Rajput': [
    'Bais', 'Chauhan', 'Gahlot', 'Paramara', 'Parihar',
    'Rathore', 'Sisodia', 'Solanki', 'Tomar', 'Others',
  ],

  // ── RAWAT ──
  'Rawat': ['Ahir Rawat', 'Gaddi Rawat', 'Others'],

  // ── REDDY ──
  'Reddy': [
    'Desur Reddy', 'Erragunta Reddy', 'Kapu', 'Kamma',
    'Panta Reddy', 'Pedakanti Reddy', 'Pokanati Reddy',
    'Velama', 'Others',
  ],

  // ── SAIVA VELLALAR ──
  'Saiva Vellalar': [
    'Kanyakumari Saiva Vellalar', 'Tirunelveli Saiva Vellalar',
    'Others',
  ],

  // ── SARAWAGI ──
  'Sarawagi': ['Agrahari', 'Khandelwal', 'Others'],

  // ── SENGUNTA MUDALIAR ──
  'Sengunta Mudaliar': ['Kaikola', 'Senguntha', 'Others'],

  // ── SENGUNTHAR ──
  'Sengunthar': ['Kaikola Sengunthar', 'Mudaliar Sengunthar', 'Others'],

  // ── SUNAR ──
  'Sunar': ['Sonar', 'Swarnakar', 'Others'],

  // ── TELI ──
  'Teli': ['Gandabaniya', 'Rathia Teli', 'Sahu Teli', 'Others'],

  // ── THAKKAR ──
  'Thakkar': ['Koli Thakkar', 'Rajput Thakkar', 'Others'],

  // ── THEVAR / MUKKULATHOR ──
  'Thevar / Mukkulathor': [
    'Agamudaiyar Thevar', 'Kallar Thevar', 'Maravar Thevar',
    'Moopanar', 'Piramalai Kallar', 'Others',
  ],

  // ── UDAYAR ──
  'Udayar': ['Karkatta Udayar', 'Rajakambalam', 'Thondaimandalam Udayar', 'Others'],

  // ── VAISHNAV VANIA ──
  'Vaishnav Vania': ['Kapol Vaishnav', 'Lad Vaishnav', 'Others'],

  // ── VANNIYAR / PADAYACHI ──
  'Vanniyar / Padayachi': [
    'Agnikula Kshatriya', 'Gounder (Vanniyar)', 'Palli', 'Padayachi',
    'Vanniyar', 'Others',
  ],

  // ── VELLALAR ──
  'Vellalar': [
    'Cholapuram Vellalar', 'Karkatta Vellalar', 'Mudaliar Vellalar',
    'Pillai Vellalar', 'Saiva Vellalar', 'Thondaimandalam Vellalar',
    'Velthuva Vellalar', 'Others',
  ],

  // ── VISHWAKARMA ──
  'Vishwakarma': [
    'Asari', 'Kammalar (Goldsmith)', 'Kollan (Blacksmith)',
    'Thattan (Silversmith)', 'Viswabrahmin', 'Others',
  ],

  // ── YADAV / KONAR ──
  'Yadav': ['Golla', 'Idayar', 'Konar', 'Krishnauth', 'Others'],
  'Konar / Yadav': ['Golla', 'Idayar', 'Konar', 'Krishnauth', 'Others'],
  'Idaiyar': ['Kongu Idaiyar', 'Vellala Idaiyar', 'Others'],

  // ── MUTHURAJA ──
  'Muthuraja': ['Ambalakarar', 'Moopanar', 'Raja', 'Others'],

  // ── EZHAVA ──
  'Ezhava': ['Thiyya', 'Others'],
  'Thiyya': ['Ezhava Thiyya', 'Others'],

  // ── ADI DRAVIDAR ──
  'Adi Dravidar': ['Paraiyar', 'Pallar', 'Arunthathiyar', 'Sambavar', 'Others'],

  // ── SC / ST CATEGORIES ──
  'SC / Scheduled Caste': ['Not Specified', 'Others'],
  'ST / Scheduled Tribe': ['Not Specified', 'Others'],
  'BC / Backward Class': ['Not Specified', 'Others'],
  'MBC / Most Backward Class': ['Not Specified', 'Others'],
  'OBC / Other Backward Class': ['Not Specified', 'Others'],
  'OC / Open Category': ['Not Specified', 'Others'],

  // ── AGRI ──
  'Agri': ['Koli', 'Kunbi', 'Others'],

  // ── BHANDARI ──
  'Bhandari': ['Kshatriya Bhandari', 'Others'],

  // ── BHATIA ──
  'Bhatia': ['Bhatia Khatri', 'Lohana Bhatia', 'Others'],

  // ── BHOI ──
  'Bhoi': ['Kewat', 'Nishad', 'Others'],

  // ── CHAMAR ──
  'Chamar': ['Jatav', 'Raidas', 'Regar', 'Others'],

  // ── DHANGAR ──
  'Dhangar': ['Hatkar', 'Khutekar', 'Sangra', 'Others'],

  // ── DHOBI ──
  'Dhobi': ['Rajak', 'Vannan', 'Others'],

  // ── GOUD ──
  'Goud': ['Goud Saraswat', 'Surapur Goud', 'Others'],

  // ── GUJAR ──
  'Gujar': ['Gujar Bakarwal', 'Others'],

  // ── GURJAR ──
  'Gurjar': ['Agnivanshi Gurjar', 'Others'],

  // ── KORI ──
  'Kori': ['Kori Weaver', 'Others'],

  // ── KOSHTHI ──
  'Koshthi': ['Padmashali', 'Swakula Sali', 'Others'],

  // ── KUMHAR ──
  'Kumhar': ['Prajapati', 'Others'],

  // ── KUNBI ──
  'Kunbi': ['Kunbi Maratha', 'Kunbi Patil', 'Others'],

  // ── KURUBA ──
  'Kuruba': ['Dhangar', 'Hatkar', 'Shepherds', 'Others'],

  // ── MAHISHYA ──
  'Mahishya': ['Maity', 'Chashi', 'Others'],

  // ── MOCHI ──
  'Mochi': ['Chamars Mochi', 'Others'],

  // ── SHILPKAR ──
  'Shilpkar': ['Barhai', 'Lohar Shilpkar', 'Others'],

};

// ── CHRISTIAN CASTES ────────────────────────────────────────────────
export const CHRISTIAN_CASTES = [
  'Anglo Indian',
  'Baptist',
  'Born Again Christian',
  'Brethren',
  'Chaldean Syrian (Assyrian)',
  'Church of North India (CNI)',
  'Church of South India (CSI)',
  'Converts',
  'Evangelical',
  'Jacobite',
  "Jehovah's Witnesses",
  'Knanaya',
  'Latin Catholic',
  'Lutheran',
  'Malankara',
  'Marthoma',
  'Methodist',
  'Nadar Christian',
  'Pentecost',
  'Protestant',
  'Roman Catholic',
  'Seventh Day Adventist',
  'Syrian Catholic',
  'Syrian Orthodox',
  'Other',
];

// ── MUSLIM CASTES ────────────────────────────────────────────────────
export const MUSLIM_CASTES = [
  'Ansari',
  'Awan',
  'Bohra',
  'Deobandi',
  'Dudekula',
  'Hanafi',
  'Hanbali',
  'Julaha',
  'Khoja',
  'Lebbai',
  'Maliki',
  'Maraikayar',
  'Memon',
  'Muslim',
  'Pathan / Khan',
  'Qureshi',
  'Rajput Muslim',
  'Rowther',
  'Sayyad',
  "Shafi'i",
  'Sheikh',
  'Shia',
  'Siddiqui',
  'Sunni',
  'Other',
];

// ── JAIN CASTES ──────────────────────────────────────────────────────
export const JAIN_CASTES = [
  'Digambara',
  'Khandelwal',
  'Maheshwari',
  'Oswal',
  'Porwal',
  'Shrimali',
  'Shvetambara (Murtipujaka)',
  'Shvetambara (Sthanakvasi)',
  'Shvetambara (Terapanthi)',
  'Taranpanthi',
  'Bisapanthi',
  'Other',
];

// ── SIKH CASTES ──────────────────────────────────────────────────────
export const SIKH_CASTES = [
  'Arora',
  'Bedi',
  'Bhalla',
  'Bhatra',
  'Dhillon',
  'Gill',
  'Gursikh',
  'Jat Sikh',
  'Khatri',
  'Lubana',
  'Majhabi Sikh',
  'Ramgarhia',
  'Ravidasia',
  'Saini',
  'Sandhu',
  'Sidhu',
  'Sodhi',
  'Trehan',
  'Other',
];

// ── BUDDHIST CASTES ──────────────────────────────────────────────────
export const BUDDHIST_CASTES = [
  'Ambedkarite / Navayana',
  'Barua',
  'Chakma',
  'Gurung',
  'Mahayana',
  'Mang',
  'Tamang',
  'Theravada',
  'Tibetan Buddhist',
  'Other',
];

// ── CHRISTIAN SUB-CASTES ─────────────────────────────────────────────
// Appended directly to CASTE_TO_SUBCASTE
const CHRISTIAN_SUBCASTE_MAP: Record<string, string[]> = {
  'Church of South India (CSI)': [
    'Diocese of Coimbatore', 'Diocese of Madras', 'Diocese of Tirunelveli',
    'Diocese of Vellore', 'Others',
  ],
  'Church of North India (CNI)': [
    'Diocese of Agra', 'Diocese of Amritsar', 'Diocese of Delhi', 'Others',
  ],
  'Roman Catholic': ['Latin Rite', 'Syro-Malabar', 'Syro-Malankara', 'Others'],
  'Knanaya': ['Knanaya Catholic', 'Knanaya Jacobite', 'Others'],
  'Jacobite': ['Jacobite Syrian', 'Others'],
  'Syrian Catholic': ['Chaldean Rite', 'Others'],
  'Malankara': ['Malankara Catholic', 'Malankara Orthodox', 'Malankara Mar Thoma', 'Others'],
  'Marthoma': ['Mar Thoma Reformed', 'Others'],
  'Nadar Christian': ['CSI Nadar', 'Roman Catholic Nadar', 'Others'],
};

// ── MUSLIM SUB-CASTES ────────────────────────────────────────────────
const MUSLIM_SUBCASTE_MAP: Record<string, string[]> = {
  'Lebbai': ['Labbai Tamil', 'Others'],
  'Maraikayar': ['Kayalar', 'Others'],
  'Rowther': ['Rowther Tamil', 'Others'],
  'Bohra': ['Dawoodi Bohra', 'Sulaimani Bohra', 'Others'],
  'Khoja': ['Aga Khan Khoja', 'Ismaili Khoja', 'Twelver Khoja', 'Others'],
};

// ── JAIN SUB-CASTES ──────────────────────────────────────────────────
const JAIN_SUBCASTE_MAP: Record<string, string[]> = {
  'Oswal': ['Oswal Digambara', 'Oswal Shvetambara', 'Others'],
  'Khandelwal': ['Khandelwal Digambara', 'Khandelwal Shvetambara', 'Others'],
  'Digambara': ['Bisapanthi', 'Terapanthi', 'Others'],
  'Shvetambara (Murtipujaka)': ['Murtipujaka', 'Others'],
};

// ── SIKH SUB-CASTES ──────────────────────────────────────────────────
const SIKH_SUBCASTE_MAP: Record<string, string[]> = {
  'Jat Sikh': ['Dhillon', 'Gill', 'Mann', 'Sandhu', 'Sidhu', 'Others'],
  'Khatri': ['Bedi', 'Kapoor', 'Mehra', 'Sethi', 'Trehan', 'Others'],
  'Ramgarhia': ['Ramgarhia Jat', 'Ramgarhia Khatri', 'Others'],
  'Arora': ['Bhasin', 'Chawla', 'Malhotra', 'Mehta', 'Others'],
};

// Merge all sub-caste maps into one unified export
Object.assign(CASTE_TO_SUBCASTE, CHRISTIAN_SUBCASTE_MAP, MUSLIM_SUBCASTE_MAP, JAIN_SUBCASTE_MAP, SIKH_SUBCASTE_MAP);

// ── RELIGION TO CASTES MAP ───────────────────────────────────────────
export const RELIGION_TO_CASTES: Record<string, string[]> = {
  Hindu: HINDU_CASTES,
  Christian: CHRISTIAN_CASTES,
  Muslim: MUSLIM_CASTES,
  Jain: JAIN_CASTES,
  Sikh: SIKH_CASTES,
  Buddhist: BUDDHIST_CASTES,
  'Parsi / Zoroastrian': ['Irani Zoroastrian', 'Parsi', 'Others'],
  Jewish: ['Ashkenazi', 'Bene Israel', 'Cochin Jewish', 'Mizrahi', 'Sephardi', 'Others'],
  'No Religion': ['Not Applicable'],
  'Spiritual - Not Religious': ['Not Applicable'],
  Other: ['Others'],
};

// ── MARITAL STATUS ──────────────────────────────────────────────────
export const MARITAL_STATUS = [
  { value: 'never_married', label: 'Never Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'awaiting_divorce', label: 'Awaiting Divorce' },
  { value: 'separated', label: 'Separated' },
];

// ── PHYSICAL STATUS ─────────────────────────────────────────────────
export const PHYSICAL_STATUS = [
  { value: 'normal', label: 'Normal' },
  { value: 'physically_challenged', label: 'Physically Challenged' },
];

// ── BODY TYPE ───────────────────────────────────────────────────────
export const BODY_TYPES = [
  { value: 'slim', label: 'Slim' },
  { value: 'athletic', label: 'Athletic' },
  { value: 'average', label: 'Average' },
  { value: 'heavy', label: 'Heavy' },
];

// ── HEIGHTS ─────────────────────────────────────────────────────────
// Generate from feet/inches directly to guarantee unique labels.
// Range: 4'6" (137cm) to 6'6" (198cm)
export const HEIGHTS = (() => {
  const result: { value: number; label: string }[] = [];
  // 4'6" → 6'6": feet 4–6, inches 0–11
  for (let feet = 4; feet <= 6; feet++) {
    const startInches = feet === 4 ? 6 : 0;
    const endInches   = feet === 6 ? 6 : 11;
    for (let inches = startInches; inches <= endInches; inches++) {
      const cm = Math.round((feet * 12 + inches) * 2.54);
      result.push({ value: cm, label: `${feet}'${inches}"` });
    }
  }
  return result;
})();

// ── EDUCATION ───────────────────────────────────────────────────────
export const EDUCATION_LEVELS = [
  // Doctorate
  'Ph.D / Doctorate',
  'M.Phil',
  // Post Graduate
  'MBA / PGDM',
  'M.Tech / M.E.',
  'M.Sc',
  'M.Com',
  'M.A.',
  'MCA',
  'MBBS',
  'MS (Medical)',
  'MD (Medical)',
  'LLM',
  'M.Arch',
  'MDS',
  'MPharm',
  'MSW',
  'Other Post Graduate',
  // Graduate
  'B.Tech / B.E.',
  'B.Sc',
  'B.Com',
  'B.A.',
  'BCA',
  'BBA',
  'B.Arch',
  'B.Ed',
  'B.Pharm',
  'LLB',
  'BDS',
  'MBBS (studying)',
  'Other Graduate',
  // Diploma / Professional
  'Diploma',
  'ITI',
  'CA / CMA / CS',
  // Below Graduate
  'HSC / 12th',
  'SSLC / 10th',
  'Less than 10th',
];

// ── OCCUPATIONS ─────────────────────────────────────────────────────
export const OCCUPATIONS = [
  // IT & Tech
  'Software Engineer / IT',
  'Software Architect',
  'Data Scientist / AI Engineer',
  'Product Manager (Tech)',
  'DevOps / Cloud Engineer',
  'UI/UX Designer',
  'QA / Test Engineer',
  'IT Consultant',
  'Network Engineer',
  'Cyber Security Analyst',
  // Engineering
  'Civil Engineer',
  'Mechanical Engineer',
  'Electrical Engineer',
  'Electronics Engineer',
  'Chemical Engineer',
  'Aerospace Engineer',
  // Medical
  'Doctor - General Physician',
  'Doctor - Specialist',
  'Dentist',
  'Nurse',
  'Pharmacist',
  'Physiotherapist',
  'Medical Researcher',
  'Veterinary Doctor',
  // Finance
  'Chartered Accountant (CA)',
  'Financial Analyst',
  'Investment Banker',
  'Banker',
  'Accountant',
  'Auditor',
  'Insurance Professional',
  'Stock Broker',
  // Legal
  'Lawyer / Advocate',
  'Judge',
  'Legal Advisor',
  // Education
  'Teacher',
  'Professor / Lecturer',
  'Educational Administrator',
  'Researcher',
  'Tutor',
  // Government & Defence
  'IAS / IPS / IFS Officer',
  'Government Employee',
  'Defence / Military',
  'Police Officer',
  'Air Force',
  'Navy',
  'Army',
  // Business
  'Business Owner / Entrepreneur',
  'Businessman',
  'Trader / Merchant',
  // Arts / Media
  'Artist',
  'Journalist',
  'Writer / Author',
  'Actor / Performer',
  'Film/TV Professional',
  'Photographer',
  // Agriculture
  'Agriculture / Farming',
  // Other
  'Manager',
  'Officer',
  'HR Professional',
  'Marketing Professional',
  'Sales Professional',
  'Real Estate',
  'Homemaker',
  'Student',
  'Not Working',
  'Others',
];

// ── ANNUAL INCOME ───────────────────────────────────────────────────
export const INCOME_RANGES = [
  { value: 'no_income', label: 'No Income' },
  { value: '0_1l', label: '₹0 - 1 Lakh' },
  { value: '1l_2l', label: '₹1 - 2 Lakh' },
  { value: '2l_3l', label: '₹2 - 3 Lakh' },
  { value: '3l_4l', label: '₹3 - 4 Lakh' },
  { value: '4l_5l', label: '₹4 - 5 Lakh' },
  { value: '5l_6l', label: '₹5 - 6 Lakh' },
  { value: '6l_7l', label: '₹6 - 7 Lakh' },
  { value: '7l_8l', label: '₹7 - 8 Lakh' },
  { value: '8l_9l', label: '₹8 - 9 Lakh' },
  { value: '9l_10l', label: '₹9 - 10 Lakh' },
  { value: '10l_12l', label: '₹10 - 12 Lakh' },
  { value: '12l_15l', label: '₹12 - 15 Lakh' },
  { value: '15l_20l', label: '₹15 - 20 Lakh' },
  { value: '20l_25l', label: '₹20 - 25 Lakh' },
  { value: '25l_35l', label: '₹25 - 35 Lakh' },
  { value: '35l_50l', label: '₹35 - 50 Lakh' },
  { value: '50l_75l', label: '₹50 - 75 Lakh' },
  { value: '75l_1cr', label: '₹75 Lakh - 1 Crore' },
  { value: 'above_1cr', label: '₹1 Crore & above' },
];

// ── COUNTRIES (comprehensive) ────────────────────────────────────────
export const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Singapore',
  'United Arab Emirates',
  'Malaysia',
  'Germany',
  'France',
  'Netherlands',
  'Sweden',
  'Switzerland',
  'New Zealand',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Sri Lanka',
  'South Africa',
  'Japan',
  'Hong Kong',
  'Austria',
  'Belgium',
  'Denmark',
  'Finland',
  'Ireland',
  'Italy',
  'Norway',
  'Portugal',
  'Spain',
  'Other',
];

// ── INDIAN STATES ────────────────────────────────────────────────────
export const INDIAN_STATES = [
  'Andaman & Nicobar Islands',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Dadra & Nagar Haveli',
  'Daman & Diu',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Lakshadweep',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

// Cities by state — all-India comprehensive (36 states/UTs)
export const CITIES_BY_STATE: Record<string, string[]> = {
  'Tamil Nadu': [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli (Trichy)',
    'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi (Tuticorin)',
    'Dindigul', 'Thanjavur', 'Kanchipuram', 'Kumbakonam', 'Nagercoil',
    'Tirupur', 'Hosur', 'Sivakasi', 'Karur', 'Rajapalayam',
    'Pudukkottai', 'Namakkal', 'Cuddalore', 'Villupuram', 'Dharmapuri',
    'Krishnagiri', 'Perambalur', 'Ariyalur', 'Nagapattinam', 'Tiruvarur',
    'Ramanathapuram', 'Sivaganga', 'Virudhunagar', 'Theni', 'Tiruvannamalai',
    'Ranipet', 'Chengalpet', 'Kallakurichi', 'Tenkasi', 'Other',
  ],
  'Karnataka': [
    'Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi-Dharwad', 'Belagavi',
    'Kalaburagi', 'Davangere', 'Ballari', 'Tumakuru', 'Shivamogga', 'Other',
  ],
  'Andhra Pradesh': [
    'Hyderabad (Andhra Part)', 'Visakhapatnam', 'Vijayawada', 'Tirupati',
    'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Kakinada', 'Anantapur', 'Other',
  ],
  'Telangana': [
    'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar',
    'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Other',
  ],
  'Kerala': [
    'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam',
    'Palakkad', 'Alappuzha', 'Malappuram', 'Kottayam', 'Kannur', 'Kasaragod', 'Other',
  ],
  'Maharashtra': [
    'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad',
    'Solapur', 'Amravati', 'Nanded', 'Kolhapur', 'Sangli', 'Other',
  ],
  'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Other'],
  'Gujarat': [
    'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar',
    'Bhavnagar', 'Jamnagar', 'Junagadh', 'Anand', 'Other',
  ],
  'Rajasthan': [
    'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur',
    'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Other',
  ],
  'Uttar Pradesh': [
    'Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad (Prayagraj)',
    'Ghaziabad', 'Noida', 'Meerut', 'Bareilly', 'Aligarh', 'Moradabad',
    'Gorakhpur', 'Jhansi', 'Saharanpur', 'Firozabad', 'Muzaffarnagar', 'Other',
  ],
  'West Bengal': [
    'Kolkata', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman',
    'Malda', 'Howrah', 'Kharagpur', 'Haldia', 'Cooch Behar', 'Other',
  ],
  'Punjab': [
    'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda',
    'Mohali', 'Hoshiarpur', 'Pathankot', 'Moga', 'Barnala', 'Other',
  ],
  'Haryana': [
    'Faridabad', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar',
    'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Bhiwani', 'Other',
  ],
  'Madhya Pradesh': [
    'Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Rewa',
    'Sagar', 'Satna', 'Dewas', 'Chhindwara', 'Ratlam', 'Other',
  ],
  'Bihar': [
    'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga',
    'Arrah', 'Begusarai', 'Chhapra', 'Katihar', 'Purnia',
    'Samastipur', 'Hajipur', 'Bihar Sharif', 'Sasaram', 'Other',
  ],
  'Assam': [
    'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon',
    'Tinsukia', 'Dhubri', 'Bongaigaon', 'Sivasagar', 'Lakhimpur',
    'Goalpara', 'Karimganj', 'Other',
  ],
  'Odisha': [
    'Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur (Berhampur)', 'Sambalpur',
    'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda',
    'Koraput', 'Angul', 'Keonjhar', 'Other',
  ],
  'Chhattisgarh': [
    'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg',
    'Rajnandgaon', 'Raigarh', 'Ambikapur', 'Jagdalpur', 'Other',
  ],
  'Jharkhand': [
    'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh',
    'Deoghar', 'Giridih', 'Ramgarh', 'Phusro', 'Other',
  ],
  'Uttarakhand': [
    'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur',
    'Kashipur', 'Rishikesh', 'Nainital', 'Mussoorie', 'Kotdwar', 'Other',
  ],
  'Himachal Pradesh': [
    'Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Bilaspur',
    'Kullu', 'Hamirpur', 'Una', 'Baddi', 'Palampur', 'Other',
  ],
  'Goa': [
    'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda',
    'Bicholim', 'Calangute', 'Other',
  ],
  'Jammu & Kashmir': [
    'Srinagar', 'Jammu', 'Sopore', 'Anantnag', 'Baramulla',
    'Kathua', 'Udhampur', 'Punch', 'Rajouri', 'Other',
  ],
  'Ladakh': ['Leh', 'Kargil', 'Other'],
  'Chandigarh': ['Chandigarh', 'Other'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Yanam', 'Mahe', 'Other'],
  'Andaman & Nicobar Islands': ['Port Blair', 'Havelock Island', 'Car Nicobar', 'Other'],
  'Lakshadweep': ['Kavaratti', 'Minicoy', 'Amini', 'Other'],
  'Dadra & Nagar Haveli': ['Silvassa', 'Daman', 'Other'],
  'Daman & Diu': ['Daman', 'Diu', 'Other'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Other'],
  'Manipur': ['Imphal', 'Churachandpur', 'Thoubal', 'Bishnupur', 'Other'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailasahar', 'Other'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Other'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Wokha', 'Other'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Tawang', 'Ziro', 'Pasighat', 'Other'],
  'Sikkim': ['Gangtok', 'Namchi', 'Pelling', 'Mangan', 'Other'],
};

// ── DIET / HABITS ────────────────────────────────────────────────────
export const EATING_HABITS = [
  { value: 'doesnt_matter', label: "Doesn't Matter" },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'non_vegetarian', label: 'Non-Vegetarian' },
  { value: 'eggetarian', label: 'Eggetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'jain', label: 'Jain Vegetarian' },
  { value: 'occasionally_non_veg', label: 'Occasionally Non-Vegetarian' },
];

export const SMOKING_OPTIONS = [
  { value: 'doesnt_matter', label: "Doesn't Matter" },
  { value: 'no', label: "Doesn't Smoke" },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'yes', label: 'Yes, Smokes' },
];

export const DRINKING_OPTIONS = [
  { value: 'doesnt_matter', label: "Doesn't Matter" },
  { value: 'no', label: "Doesn't Drink" },
  { value: 'occasionally', label: 'Occasionally' },
  { value: 'yes', label: 'Yes, Drinks' },
];

// ── FAMILY ───────────────────────────────────────────────────────────
export const FAMILY_TYPE = [
  { value: 'nuclear', label: 'Nuclear Family' },
  { value: 'joint', label: 'Joint Family' },
  { value: 'extended', label: 'Extended Family' },
];

export const FAMILY_STATUS = [
  { value: 'middle_class', label: 'Middle Class' },
  { value: 'upper_middle', label: 'Upper Middle Class' },
  { value: 'affluent', label: 'Affluent' },
  { value: 'rich', label: 'Rich' },
  { value: 'higher_middle_class', label: 'Higher Middle Class' },
];

export const FAMILY_VALUES = [
  { value: 'orthodox', label: 'Orthodox' },
  { value: 'traditional', label: 'Traditional' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'liberal', label: 'Liberal' },
];

// ── ASTROLOGY ────────────────────────────────────────────────────────
export const STARS = [
  'Aswini (அஸ்வினி)',
  'Bharani (பரணி)',
  'Karthigai (கார்த்திகை)',
  'Rohini (ரோகிணி)',
  'Mrigashirisham (மிருகசீரிஷம்)',
  'Thiruvadhirai (திருவாதிரை)',
  'Punarpoosam (புனர்பூசம்)',
  'Poosam (பூசம்)',
  'Ayilyam (ஆயில்யம்)',
  'Magam (மகம்)',
  'Pooram (பூரம்)',
  'Uthiram (உத்திரம்)',
  'Hastham (ஹஸ்தம்)',
  'Chittirai (சித்திரை)',
  'Swathi (சுவாதி)',
  'Vishakam (விசாகம்)',
  'Anusham (அனுஷம்)',
  'Kettai (கேட்டை)',
  'Moolam (மூலம்)',
  'Pooradam (பூராடம்)',
  'Uthiradam (உத்திராடம்)',
  'Thiruvonam (திருவோணம்)',
  'Avittam (அவிட்டம்)',
  'Sadhayam (சதயம்)',
  'Poorattadhi (பூரட்டாதி)',
  'Uthirattadhi (உத்திரட்டாதி)',
  'Revathi (ரேவதி)',
];

export const RAASI_LIST = [
  'Mesha (Aries / மேஷம்)',
  'Rishabha (Taurus / ரிஷபம்)',
  'Mithuna (Gemini / மிதுனம்)',
  'Kadaga (Cancer / கடகம்)',
  'Simha (Leo / சிம்மம்)',
  'Kanni (Virgo / கன்னி)',
  'Thulam (Libra / துலாம்)',
  'Viruchigam (Scorpio / விருச்சிகம்)',
  'Dhanus (Sagittarius / தனுசு)',
  'Makara (Capricorn / மகரம்)',
  'Kumbha (Aquarius / கும்பம்)',
  'Meena (Pisces / மீனம்)',
];

export const STAR_TO_RASI: Record<string, string> = {
  'Aswini (அஸ்வினி)': 'Mesha (Aries / மேஷம்)',
  'Bharani (பரணி)': 'Mesha (Aries / மேஷம்)',
  'Karthigai (கார்த்திகை)': 'Mesha (Aries / மேஷம்)',
  'Rohini (ரோகிணி)': 'Rishabha (Taurus / ரிஷபம்)',
  'Mrigashirisham (மிருகசீரிஷம்)': 'Rishabha (Taurus / ரிஷபம்)',
  'Thiruvadhirai (திருவாதிரை)': 'Mithuna (Gemini / மிதுனம்)',
  'Punarpoosam (புனர்பூசம்)': 'Mithuna (Gemini / மிதுனம்)',
  'Poosam (பூசம்)': 'Kadaga (Cancer / கடகம்)',
  'Ayilyam (ஆயில்யம்)': 'Kadaga (Cancer / கடகம்)',
  'Magam (மகம்)': 'Simha (Leo / சிம்மம்)',
  'Pooram (பூரம்)': 'Simha (Leo / சிம்மம்)',
  'Uthiram (உத்திரம்)': 'Simha (Leo / சிம்மம்)',
  'Hastham (ஹஸ்தம்)': 'Kanni (Virgo / கன்னி)',
  'Chittirai (சித்திரை)': 'Kanni (Virgo / கன்னி)',
  'Swathi (சுவாதி)': 'Thulam (Libra / துலாம்)',
  'Vishakam (விசாகம்)': 'Thulam (Libra / துலாம்)',
  'Anusham (அனுஷம்)': 'Viruchigam (Scorpio / விருச்சிகம்)',
  'Kettai (கேட்டை)': 'Viruchigam (Scorpio / விருச்சிகம்)',
  'Moolam (மூலம்)': 'Dhanus (Sagittarius / தனுசு)',
  'Pooradam (பூராடம்)': 'Dhanus (Sagittarius / தனுசு)',
  'Uthiradam (உத்திராடம்)': 'Dhanus (Sagittarius / தனுசு)',
  'Thiruvonam (திருவோணம்)': 'Makara (Capricorn / மகரம்)',
  'Avittam (அவிட்டம்)': 'Makara (Capricorn / மகரம்)',
  'Sadhayam (சதயம்)': 'Kumbha (Aquarius / கும்பம்)',
  'Poorattadhi (பூரட்டாதி)': 'Kumbha (Aquarius / கும்பம்)',
  'Uthirattadhi (உத்திரட்டாதி)': 'Meena (Pisces / மீனம்)',
  'Revathi (ரேவதி)': 'Meena (Pisces / மீனம்)',
};

export const DHOSHAM_OPTIONS = [
  { value: 'none', label: 'No Dhosham' },
  { value: 'chevvai', label: 'Chevvai Dosham (Manglik)' },
  { value: 'raghu', label: 'Raghu Dosham' },
  { value: 'ketu', label: 'Ketu Dosham' },
  { value: 'sarrpa', label: 'Sarrpa Dosham' },
  { value: 'unknown', label: "Don't Know" },
];

// ── HOBBIES ──────────────────────────────────────────────────────────
export const HOBBIES_INTERESTS = [
  'Reading', 'Cooking', 'Travelling', 'Music', 'Dance', 'Yoga',
  'Meditation', 'Photography', 'Painting / Art', 'Sports', 'Fitness / Gym',
  'Swimming', 'Cricket', 'Badminton', 'Chess', 'Trekking / Hiking',
  'Gardening', 'Volunteering / Social Work', 'Movies', 'Theatre', 'Writing',
  'Gaming', 'Cycling', 'Foodie / Culinary', 'Fashion', 'Technology',
  'Entrepreneurship', 'Singing', 'Carnatic Music', 'Classical Dance',
];

// ── MOCK DATA ────────────────────────────────────────────────────────
export const SUCCESS_STORIES = [
  {
    id: '1',
    name: 'Priya & Karthik',
    city: 'Chennai',
    married: 'March 2024',
    story: 'We connected through Elite Tamil Matrimony and knew immediately we were meant for each other. The AI matching was spot on — same values, similar family backgrounds, and we both love Carnatic music.',
    photoUrl: '/images/couple-1.jpg',
    community: 'Vellalar',
  },
  {
    id: '2',
    name: 'Deepa & Arun',
    city: 'Coimbatore',
    married: 'January 2024',
    story: "As an NRI settled in Singapore, finding a Tamil match was challenging. Elite Tamil Matrimony's verified profiles and video call feature made it easy. We got married within 6 months of connecting!",
    photoUrl: '/images/couple-2.jpg',
    community: 'Mudaliar',
  },
  {
    id: '3',
    name: 'Kavitha & Suresh',
    city: 'Madurai',
    married: 'June 2024',
    story: 'My parents created my profile. Within two weeks, we found Suresh — a perfect match in every way. The horoscope compatibility feature helped my parents feel confident.',
    photoUrl: '/images/couple-3.jpg',
    community: 'Thevar',
  },
];

export const TRUST_STATS = [
  { value: '25 Lakh+', label: 'Tamil Profiles' },
  { value: '3.2 Lakh+', label: 'Happy Couples' },
  { value: '98%', label: 'Verified Profiles' },
  { value: '4.8★', label: 'App Rating' },
];

// ── PROFILE_CREATED_BY options ──────────────────────────────────────
export const PROFILE_CREATED_BY = [
  { value: 'any', label: 'Any' },
  { value: 'self', label: 'Self' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'relative', label: 'Relative' },
  { value: 'friend', label: 'Friend' },
];

// ── AGE RANGE ─────────────────────────────────────────────────────────
export const AGE_OPTIONS = Array.from({ length: 53 }, (_, i) => ({
  value: 18 + i,
  label: `${18 + i} Yrs`,
}));

// ── BACKWARD COMPATIBILITY ALIASES ────────────────────────────────────
// TAMIL_NADU_CITIES — alias for cities in Tamil Nadu from CITIES_BY_STATE
export const TAMIL_NADU_CITIES: string[] = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli (Trichy)',
  'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi (Tuticorin)',
  'Dindigul', 'Thanjavur', 'Kanchipuram', 'Kumbakonam', 'Nagercoil',
  'Tirupur', 'Hosur', 'Sivakasi', 'Karur', 'Rajapalayam',
  'Pudukkottai', 'Namakkal', 'Cuddalore', 'Villupuram', 'Dharmapuri',
  'Krishnagiri', 'Perambalur', 'Ariyalur', 'Nagapattinam', 'Tiruvarur',
  'Ramanathapuram', 'Sivaganga', 'Virudhunagar', 'Theni', 'Tiruvannamalai',
  'Ranipet', 'Chengalpet', 'Kallakurichi', 'Tenkasi', 'Other',
];

// Alias for old DIET_OPTIONS
export const DIET_OPTIONS = EATING_HABITS;

// Alias for old TAMIL_STAR_RASI — uses STAR_TO_RASI lookup (correct, by name not index)
export const TAMIL_STAR_RASI = STARS.map((star) => ({
  star,
  rasi: STAR_TO_RASI[star] || 'Unknown',
}));
