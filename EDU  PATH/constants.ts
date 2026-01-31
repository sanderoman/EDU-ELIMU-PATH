
import { University, Course, Grade } from './types';

const LOGO_PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523050853021-ea754f3915ef?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a91?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?w=128&h=128&fit=crop&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=128&h=128&fit=crop&q=80'
];

const getPlaceholder = (i: number) => LOGO_PLACEHOLDERS[i % LOGO_PLACEHOLDERS.length];

export const UNIVERSITIES: University[] = [
  // PUBLIC CHARTERED (35)
  { id: 'pub1', apiSlug: 'uon', name: 'University of Nairobi', logo: getPlaceholder(0), category: 'PUBLIC', description: 'Premier institution for Medicine, Law, and Business.', topCourses: [] },
  { id: 'pub2', apiSlug: 'moi', name: 'Moi University', logo: getPlaceholder(1), category: 'PUBLIC', description: 'Academic excellence in Eldoret highlands.', topCourses: [] },
  { id: 'pub3', apiSlug: 'ku', name: 'Kenyatta University', logo: getPlaceholder(2), category: 'PUBLIC', description: 'Leader in Education and Applied Sciences.', topCourses: [] },
  { id: 'pub4', apiSlug: 'egerton', name: 'Egerton University', logo: getPlaceholder(3), category: 'PUBLIC', description: 'The engine of agricultural research.', topCourses: [] },
  { id: 'pub5', apiSlug: 'jkuat', name: 'Jomo Kenyatta University of Agriculture and Technology', logo: getPlaceholder(4), category: 'PUBLIC', description: 'Technological engine of Kenya.', topCourses: [] },
  { id: 'pub6', apiSlug: 'maseno', name: 'Maseno University', logo: getPlaceholder(5), category: 'PUBLIC', description: 'Lakeside academic excellence.', topCourses: [] },
  { id: 'pub7', apiSlug: 'mmust', name: 'Masinde Muliro University of Science and Technology', logo: getPlaceholder(6), category: 'PUBLIC', description: 'Technical hub in Western Kenya.', topCourses: [] },
  { id: 'pub8', apiSlug: 'dkut', name: 'Dedan Kimathi University of Technology', logo: getPlaceholder(7), category: 'PUBLIC', description: 'Technological pioneer in Nyeri.', topCourses: [] },
  { id: 'pub9', apiSlug: 'chuka', name: 'Chuka University', logo: getPlaceholder(8), category: 'PUBLIC', description: 'The prophetic university.', topCourses: [] },
  { id: 'pub10', apiSlug: 'tuk', name: 'Technical University of Kenya', logo: getPlaceholder(9), category: 'PUBLIC', description: 'Applied technology leader.', topCourses: [] },
  { id: 'pub11', apiSlug: 'tum', name: 'Technical University of Mombasa', logo: getPlaceholder(10), category: 'PUBLIC', description: 'Coastal technical hub.', topCourses: [] },
  { id: 'pub12', apiSlug: 'pwani', name: 'Pwani University', logo: getPlaceholder(11), category: 'PUBLIC', description: 'Research focused institution in Kilifi.', topCourses: [] },
  { id: 'pub13', apiSlug: 'kisii', name: 'Kisii University', logo: getPlaceholder(12), category: 'PUBLIC', description: 'Excellence in social sciences and arts.', topCourses: [] },
  { id: 'pub14', apiSlug: 'uoeld', name: 'University of Eldoret', logo: getPlaceholder(13), category: 'PUBLIC', description: 'Leading in agriculture and biotechnology.', topCourses: [] },
  { id: 'pub15', apiSlug: 'mara', name: 'Maasai Mara University', logo: getPlaceholder(14), category: 'PUBLIC', description: 'Gateway to environmental research.', topCourses: [] },
  { id: 'pub16', apiSlug: 'jooust', name: 'Jaramogi Oginga Odinga University of Science and Technology', logo: getPlaceholder(15), category: 'PUBLIC', description: 'Scientific innovation in Bondo.', topCourses: [] },
  { id: 'pub17', apiSlug: 'laikipia', name: 'Laikipia University', logo: getPlaceholder(16), category: 'PUBLIC', description: 'The hub of arts and sciences.', topCourses: [] },
  { id: 'pub18', apiSlug: 'seku', name: 'South Eastern Kenya University', logo: getPlaceholder(17), category: 'PUBLIC', description: 'Arid land research experts.', topCourses: [] },
  { id: 'pub19', apiSlug: 'meru', name: 'Meru University of Science and Technology', logo: getPlaceholder(18), category: 'PUBLIC', description: 'Technological advancement in Meru.', topCourses: [] },
  { id: 'pub20', apiSlug: 'mmu', name: 'Multimedia University of Kenya', logo: getPlaceholder(19), category: 'PUBLIC', description: 'IT and communication hub.', topCourses: [] },
  { id: 'pub21', apiSlug: 'kabianga', name: 'University of Kabianga', logo: getPlaceholder(20), category: 'PUBLIC', description: 'Excellence in tea and agricultural research.', topCourses: [] },
  { id: 'pub22', apiSlug: 'karu', name: 'Karatina University', logo: getPlaceholder(21), category: 'PUBLIC', description: 'Research excellence in Central Kenya.', topCourses: [] },
  { id: 'pub23', apiSlug: 'kibu', name: 'Kibabii University', logo: getPlaceholder(22), category: 'PUBLIC', description: 'Information technology specialists.', topCourses: [] },
  { id: 'pub24', apiSlug: 'rongo', name: 'Rongo University', logo: getPlaceholder(23), category: 'PUBLIC', description: 'Empowering knowledge and innovation.', topCourses: [] },
  { id: 'pub25', apiSlug: 'cuk', name: 'The Co-operative University of Kenya', logo: getPlaceholder(24), category: 'PUBLIC', description: 'The hub of cooperative management.', topCourses: [] },
  { id: 'pub26', apiSlug: 'ttu', name: 'Taita Taveta University', logo: getPlaceholder(25), category: 'PUBLIC', description: 'Mining and technical hub.', topCourses: [] },
  { id: 'pub27', apiSlug: 'mut', name: 'Murang’a University of Technology', logo: getPlaceholder(26), category: 'PUBLIC', description: 'Technical excellence hub.', topCourses: [] },
  { id: 'pub28', apiSlug: 'embu', name: 'University of Embu', logo: getPlaceholder(27), category: 'PUBLIC', description: 'Knowledge and discovery.', topCourses: [] },
  { id: 'pub29', apiSlug: 'machakos', name: 'Machakos University', logo: getPlaceholder(28), category: 'PUBLIC', description: 'Innovation and entrepreneurship.', topCourses: [] },
  { id: 'pub30', apiSlug: 'kirinyaga', name: 'Kirinyaga University', logo: getPlaceholder(29), category: 'PUBLIC', description: 'Leading in engineering and technical sciences.', topCourses: [] },
  { id: 'pub31', apiSlug: 'garissa', name: 'Garissa University', logo: getPlaceholder(30), category: 'PUBLIC', description: 'Educational hub in North Eastern.', topCourses: [] },
  { id: 'pub32', apiSlug: 'alupe', name: 'Alupe University', logo: getPlaceholder(31), category: 'PUBLIC', description: 'Specialized science and health hub.', topCourses: [] },
  { id: 'pub33', apiSlug: 'kaimosi', name: 'Kaimosi Friends University', logo: getPlaceholder(32), category: 'PUBLIC', description: 'Values based education.', topCourses: [] },
  { id: 'pub34', apiSlug: 'tmu', name: 'Tom Mboya University', logo: getPlaceholder(33), category: 'PUBLIC', description: 'Academic innovation in Homa Bay.', topCourses: [] },
  { id: 'pub35', apiSlug: 'tharaka', name: 'Tharaka University', logo: getPlaceholder(34), category: 'PUBLIC', description: 'New frontier in high-tier education.', topCourses: [] },

  // PRIVATE CHARTERED (32)
  { id: 'pvt1', apiSlug: 'baraton', name: 'University of Eastern Africa, Baraton', logo: getPlaceholder(35), category: 'PRIVATE', description: 'Holistic Christian education.', topCourses: [] },
  { id: 'pvt2', apiSlug: 'cuea', name: 'Catholic University of Eastern Africa (CUEA)', logo: getPlaceholder(36), category: 'PRIVATE', description: 'Leadership and ethics.', topCourses: [] },
  { id: 'pvt3', apiSlug: 'daystar', name: 'Daystar University', logo: getPlaceholder(37), category: 'PRIVATE', description: 'Excellence in communication and arts.', topCourses: [] },
  { id: 'pvt4', apiSlug: 'scott', name: 'Scott Christian University', logo: getPlaceholder(38), category: 'PRIVATE', description: 'Foundational Christian training.', topCourses: [] },
  { id: 'pvt5', apiSlug: 'usiu', name: 'United States International University', logo: getPlaceholder(39), category: 'PRIVATE', description: 'Global education hub.', topCourses: [] },
  { id: 'pvt6', apiSlug: 'nazarene', name: 'Africa Nazarene University', logo: getPlaceholder(40), category: 'PRIVATE', description: 'Character and competence.', topCourses: [] },
  { id: 'pvt7', apiSlug: 'kemu', name: 'Kenya Methodist University', logo: getPlaceholder(41), category: 'PRIVATE', description: 'Practical and innovative learning.', topCourses: [] },
  { id: 'pvt8', apiSlug: 'spu', name: 'St. Paul’s University', logo: getPlaceholder(42), category: 'PRIVATE', description: 'Theology and social science leader.', topCourses: [] },
  { id: 'pvt9', apiSlug: 'pac', name: 'Pan Africa Christian University', logo: getPlaceholder(43), category: 'PRIVATE', description: 'Leadership development.', topCourses: [] },
  { id: 'pvt10', apiSlug: 'strathmore', name: 'Strathmore University', logo: getPlaceholder(44), category: 'PRIVATE', description: 'Elite business and law training.', topCourses: [] },
  { id: 'pvt11', apiSlug: 'kabarak', name: 'Kabarak University', logo: getPlaceholder(45), category: 'PRIVATE', description: 'Education and biblical values.', topCourses: [] },
  { id: 'pvt12', apiSlug: 'mku', name: 'Mount Kenya University', logo: getPlaceholder(46), category: 'PRIVATE', description: 'Scale and accessibility leader.', topCourses: [] },
  { id: 'pvt13', apiSlug: 'aiu', name: 'Africa International University', logo: getPlaceholder(47), category: 'PRIVATE', description: 'Graduate theological focus.', topCourses: [] },
  { id: 'pvt14', apiSlug: 'kehu', name: 'Kenya Highlands Evangelical University', logo: getPlaceholder(48), category: 'PRIVATE', description: 'Commitment to faith and knowledge.', topCourses: [] },
  { id: 'pvt15', apiSlug: 'gluk', name: 'Great Lakes University of Kisumu', logo: getPlaceholder(49), category: 'PRIVATE', description: 'Community health focus.', topCourses: [] },
  { id: 'pvt16', apiSlug: 'kcau', name: 'KCA University', logo: getPlaceholder(50), category: 'PRIVATE', description: 'The hub of accounting and IT.', topCourses: [] },
  { id: 'pvt17', apiSlug: 'aua', name: 'Adventist University of Africa', logo: getPlaceholder(51), category: 'PRIVATE', description: 'Advanced professional study.', topCourses: [] },
  { id: 'pvt18', apiSlug: 'east', name: 'KAG EAST University', logo: getPlaceholder(52), category: 'PRIVATE', description: 'Ministerial training excellence.', topCourses: [] },
  { id: 'pvt19', apiSlug: 'umma', name: 'Umma University', logo: getPlaceholder(53), category: 'PRIVATE', description: 'Islamic values and professional skills.', topCourses: [] },
  { id: 'pvt20', apiSlug: 'puea', name: 'Presbyterian University of East Africa', logo: getPlaceholder(54), category: 'PRIVATE', description: 'Integrity and scholarship.', topCourses: [] },
  { id: 'pvt21', apiSlug: 'aku', name: 'Aga Khan University', logo: getPlaceholder(55), category: 'PRIVATE', description: 'World-class medical training.', topCourses: [] },
  { id: 'pvt22', apiSlug: 'kiriri', name: 'Kiriri Women’s University of Science and Technology', logo: getPlaceholder(56), category: 'PRIVATE', description: 'Empowering women in STEM.', topCourses: [] },
  { id: 'pvt23', apiSlug: 'teau', name: 'The East African University', logo: getPlaceholder(57), category: 'PRIVATE', description: 'Regional academic hub.', topCourses: [] },
  { id: 'pvt24', apiSlug: 'zetech', name: 'Zetech University', logo: getPlaceholder(58), category: 'PRIVATE', description: 'Invent your future.', topCourses: [] },
  { id: 'pvt25', apiSlug: 'lukenya', name: 'Lukenya University', logo: getPlaceholder(59), category: 'PRIVATE', description: 'Community centered education.', topCourses: [] },
  { id: 'pvt26', apiSlug: 'mua', name: 'Management University of Africa', logo: getPlaceholder(60), category: 'PRIVATE', description: 'Management and leadership hub.', topCourses: [] },
  { id: 'pvt27', apiSlug: 'tangaza', name: 'Tangaza University', logo: getPlaceholder(61), category: 'PRIVATE', description: 'Social transformation experts.', topCourses: [] },
  { id: 'pvt28', apiSlug: 'iuk', name: 'Islamic University of Kenya', logo: getPlaceholder(62), category: 'PRIVATE', description: 'Global values and high standards.', topCourses: [] },
  { id: 'pvt29', apiSlug: 'riara', name: 'Riara University', logo: getPlaceholder(63), category: 'PRIVATE', description: 'Holistic legal and IT training.', topCourses: [] },
  { id: 'pvt30', apiSlug: 'uzima', name: 'Uzima University', logo: getPlaceholder(64), category: 'PRIVATE', description: 'Specialized health education.', topCourses: [] },
  { id: 'pvt31', apiSlug: 'gretsa', name: 'Gretsa University', logo: getPlaceholder(65), category: 'PRIVATE', description: 'Dynamic professional courses.', topCourses: [] },
  { id: 'pvt32', apiSlug: 'amref', name: 'Amref International University', logo: getPlaceholder(66), category: 'PRIVATE', description: 'Leading health research training.', topCourses: [] }
];

export const KMTC_CAMPUSES = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Machakos', 'Thika', 'Voi', 'Garissa', 'Lodwar', 'Embu',
  'Kakamega', 'Nyeri', 'Meru', 'Bomet', 'Homa Bay', 'Kapenguria', 'Msambweni', 'Murang\'a', 'Webuye', 'Chuka', 'Makindu'
];

export const NATIONAL_POLYTECHNICS = [
  'Kenya Coast National Polytechnic', 'Kisumu National Polytechnic', 'Eldoret National Polytechnic', 
  'Kabete National Polytechnic', 'Meru National Polytechnic', 'Nyeri National Polytechnic', 
  'Sigalagala National Polytechnic', 'Kitale National Polytechnic', 'Northeastern National Polytechnic',
  'Bungoma National Polytechnic', 'Keroka Technical Training Institute', 'Kiambu Institute of Science and Technology',
  'Ramogi Institute of Advanced Technology', 'Friends College Kaimosi', 'Wote Technical Training Institute',
  'Mawego Technical Training Institute', 'Sang\'alo Institute of Science and Technology'
];

const TEMPLATES = {
  DEGREE: [
    { name: 'Medicine & Surgery', grade: 'A' as Grade }, { name: 'Nursing', grade: 'B+' as Grade },
    { name: 'Pharmacy', grade: 'A-' as Grade }, { name: 'Law (LLB)', grade: 'B+' as Grade },
    { name: 'Civil Engineering', grade: 'A-' as Grade }, { name: 'Mechatronics', grade: 'B+' as Grade },
    { name: 'Computer Science', grade: 'B+' as Grade }, { name: 'Software Engineering', grade: 'B' as Grade },
    { name: 'Architecture', grade: 'A' as Grade }, { name: 'Quantity Surveying', grade: 'B' as Grade },
    { name: 'Actuarial Science', grade: 'A-' as Grade }, { name: 'Accounting (B.Com)', grade: 'C+' as Grade },
    { name: 'Finance', grade: 'B-' as Grade }, { name: 'Education (Arts)', grade: 'C+' as Grade },
    { name: 'Education (Science)', grade: 'C+' as Grade }, { name: 'Environmental Science', grade: 'C+' as Grade },
    { name: 'Agribusiness', grade: 'C+' as Grade }, { name: 'Project Management', grade: 'C+' as Grade },
    { name: 'Economics', grade: 'C+' as Grade }, { name: 'International Relations', grade: 'B-' as Grade },
    { name: 'Information Technology', grade: 'C+' as Grade }, { name: 'Statistics', grade: 'B-' as Grade },
    { name: 'Journalism', grade: 'C+' as Grade }, { name: 'Real Estate', grade: 'B-' as Grade },
    { name: 'Applied Physics', grade: 'B' as Grade }, { name: 'Theology', grade: 'C+' as Grade },
    { name: 'Counseling Psychology', grade: 'C+' as Grade }, { name: 'Medical Lab Science', grade: 'B+' as Grade },
    { name: 'Dental Surgery', grade: 'A' as Grade }, { name: 'Biomedical Technology', grade: 'B' as Grade },
    { name: 'Hospitality Management', grade: 'C+' as Grade }, { name: 'Tourism Management', grade: 'C+' as Grade },
    { name: 'Criminology', grade: 'C+' as Grade }, { name: 'Social Work', grade: 'C+' as Grade }
  ],
  DIPLOMA: [
    { name: 'Clinical Medicine', grade: 'C' as Grade }, { name: 'Nursing (KRCHN)', grade: 'C' as Grade },
    { name: 'Pharmacy Tech', grade: 'C' as Grade }, { name: 'Medical Lab', grade: 'C' as Grade },
    { name: 'Radiography', grade: 'C' as Grade }, { name: 'Electrical Engineering', grade: 'C' as Grade },
    { name: 'Civil Eng Diploma', grade: 'C-' as Grade }, { name: 'Business Management', grade: 'C-' as Grade },
    { name: 'Human Resource', grade: 'C-' as Grade }, { name: 'Nutrition', grade: 'C-' as Grade },
    { name: 'Social Work', grade: 'C-' as Grade }, { name: 'Catering & Hotel Management', grade: 'C' as Grade },
    { name: 'ICT Diploma', grade: 'C-' as Grade }, { name: 'Supply Chain', grade: 'C-' as Grade },
    { name: 'Journalism', grade: 'C-' as Grade }, { name: 'Public Relations', grade: 'C-' as Grade }
  ],
  CERT_ARTISAN: [
    { name: 'Certificate in Plumbing', grade: 'D' as Grade }, { name: 'Certificate in Electrical', grade: 'D' as Grade },
    { name: 'Artisan in Welding', grade: 'E' as Grade }, { name: 'Artisan in Masonry', grade: 'E' as Grade },
    { name: 'Certificate in Catering', grade: 'D' as Grade }, { name: 'Artisan in Carpentry', grade: 'E' as Grade },
    { name: 'Certificate in Beauty', grade: 'D-' as Grade }, { name: 'Certificate in ICT', grade: 'D' as Grade },
    { name: 'Artisan in Motor Vehicle', grade: 'E' as Grade }, { name: 'Certificate in Fashion', grade: 'D' as Grade }
  ]
};

const generateFullDataset = (): Course[] => {
  const courses: Course[] = [];
  let idCounter = 1;

  // Map Degrees to ALL 67 Universities
  UNIVERSITIES.forEach(uni => {
    TEMPLATES.DEGREE.forEach(t => {
      courses.push({
        id: `deg-${idCounter++}`,
        name: `Bachelor of ${t.name}`,
        institution: uni.name,
        type: 'University',
        duration: '4-6 Years',
        minGrade: t.grade,
        clusterSubjects: ['Math', 'Eng', 'Sci'],
        kuccpsLink: 'https://students.kuccps.net/'
      });
    });
  });

  // Map Diplomas to Colleges (KMTC and Polytechnics)
  const allColleges = [...KMTC_CAMPUSES.map(c => `KMTC ${c}`), ...NATIONAL_POLYTECHNICS];
  allColleges.forEach(inst => {
    TEMPLATES.DIPLOMA.forEach(t => {
      courses.push({
        id: `dip-${idCounter++}`,
        name: `Diploma in ${t.name}`,
        institution: inst,
        type: 'College',
        duration: '2-3 Years',
        minGrade: t.grade,
        clusterSubjects: ['Relevant Science', 'Eng'],
        kuccpsLink: 'https://students.kuccps.net/'
      });
    });
  });

  // Map Certs to TVETs (Polytechnics)
  NATIONAL_POLYTECHNICS.forEach(inst => {
    // Fixed typo in property access from CERT_ARTisAN to CERT_ARTISAN
    TEMPLATES.CERT_ARTISAN.forEach(t => {
      courses.push({
        id: `cert-${idCounter++}`,
        name: t.name,
        institution: inst,
        type: t.name.includes('Artisan') ? 'TVET' : 'College',
        duration: '1-2 Years',
        minGrade: t.grade,
        clusterSubjects: ['Practical Skills'],
        kuccpsLink: 'https://students.kuccps.net/'
      });
    });
  });

  return courses;
};

export const MOCK_COURSES = generateFullDataset();

export const fetchCourses = async (): Promise<Course[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_COURSES), 500);
  });
};

export const SUBJECT_GROUPS = [
  { id: 'group1', name: 'Group 1: Compulsory', description: 'Core foundational subjects.', subjects: ['Mathematics', 'English', 'Kiswahili'] },
  { id: 'group2', name: 'Group 2: Sciences', description: 'Technical science subjects.', subjects: ['Biology', 'Chemistry', 'Physics'] },
  { id: 'group3', name: 'Group 3: Humanities', description: 'Social and historical studies.', subjects: ['History & Government', 'Geography', 'CRE/IRE/HRE'] },
  { id: 'group4', name: 'Group 4: Applieds', description: 'Vocational and professional electives.', subjects: ['Agriculture', 'Computer Studies', 'Home Science', 'Business Studies'] },
  { id: 'group5', name: 'Group 5: Technicals & Languages', description: 'Specialized electives including foreign languages.', subjects: ['Arabic', 'French', 'Music', 'German'] }
];

export const CONTACT_PHONE = '0743315353';
