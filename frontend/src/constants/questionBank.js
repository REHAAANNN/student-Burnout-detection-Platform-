/**
 * Complete question bank for the advanced burnout assessment.
 * Questions are organized by section and stressor category.
 * No questions are hardcoded in components.
 */

// Section 1 — Mood Snapshot
export const MOOD_SNAPSHOT = [
  {
    id: 'mood_1',
    question: 'How are you feeling right now?',
    type: 'emoji-select',
    required: true,
    options: [
      { id: 'great', label: 'Great', emoji: '😄', color: 'success' },
      { id: 'good', label: 'Good', emoji: '😊', color: 'success' },
      { id: 'okay', label: 'Okay', emoji: '😐', color: 'warning' },
      { id: 'stressed', label: 'Stressed', emoji: '😰', color: 'warning' },
      { id: 'exhausted', label: 'Exhausted', emoji: '😫', color: 'danger' }
    ]
  },
  {
    id: 'mood_2',
    question: 'How would you rate your energy level today?',
    type: 'slider',
    required: true,
    min: 1,
    max: 10,
    lowLabel: 'Very Low',
    highLabel: 'Very High'
  },
  {
    id: 'mood_3',
    question: 'How emotionally overwhelmed do you feel right now?',
    type: 'slider',
    required: true,
    min: 1,
    max: 10,
    lowLabel: 'Not at all',
    highLabel: 'Completely'
  },
  {
    id: 'mood_4',
    question: 'How mentally exhausted do you feel?',
    type: 'slider',
    required: true,
    min: 1,
    max: 10,
    lowLabel: 'Rested',
    highLabel: 'Exhausted'
  }
]

// Section 2 — Stressor Selection Options
export const STRESSOR_SELECTION = [
  { id: 'studies', label: 'Studies', icon: 'BookOpen', description: 'Academic workload and pressure' },
  { id: 'exams', label: 'Exams', icon: 'FileCheck', description: 'Exam stress and performance anxiety' },
  { id: 'assignments', label: 'Assignments', icon: 'ClipboardList', description: 'Submission deadlines and workload' },
  { id: 'sleep', label: 'Sleep', icon: 'Moon', description: 'Sleep quality and consistency' },
  { id: 'family', label: 'Family', icon: 'Users', description: 'Family dynamics and expectations' },
  { id: 'friends', label: 'Friends', icon: 'UserPlus', description: 'Social connections and peer relations' },
  { id: 'relationship', label: 'Relationship', icon: 'Heart', description: 'Romantic relationship concerns' },
  { id: 'career', label: 'Career / Placement', icon: 'Briefcase', description: 'Career uncertainty and placement stress' },
  { id: 'financial', label: 'Financial Issues', icon: 'CreditCard', description: 'Money worries and tuition stress' },
  { id: 'physical_health', label: 'Physical Health', icon: 'Activity', description: 'Exercise, diet and physical wellbeing' },
  { id: 'mental_health', label: 'Mental Health', icon: 'Brain', description: 'Anxiety, mood and emotional state' },
  { id: 'social_pressure', label: 'Social Pressure', icon: 'MessageCircle', description: 'Social expectations and comparisons' },
  { id: 'loneliness', label: 'Loneliness', icon: 'Frown', description: 'Feeling isolated or disconnected' },
  { id: 'time_management', label: 'Time Management', icon: 'Clock', description: 'Balancing priorities and deadlines' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal', description: 'Anything else affecting you' }
]

// Section 3 — Core Burnout Assessment (All users answer)
export const CORE_BURNOUT = [
  {
    id: 'core_1',
    question: 'How often do you feel emotionally drained by daily responsibilities?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'core_2',
    question: 'How often do you feel unmotivated to study?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'core_3',
    question: 'How difficult is it to concentrate during study sessions?',
    type: 'slider',
    required: true,
    min: 1,
    max: 10,
    lowLabel: 'Very Easy',
    highLabel: 'Very Difficult'
  },
  {
    id: 'core_4',
    question: 'Do you feel productive most days?',
    type: 'radio',
    required: true,
    options: ['Yes', 'No', 'Sometimes']
  },
  {
    id: 'core_5',
    question: 'How frequently do you procrastinate important tasks?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'core_6',
    question: 'Do small tasks feel overwhelming?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'core_7',
    question: 'How often do you feel mentally tired even after rest?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'core_8',
    question: 'Do you feel less interested in activities you used to enjoy?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'core_9',
    question: 'How often do you feel anxious without knowing why?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'core_10',
    question: 'How often do you feel hopeless about your workload?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  }
]

// Section 4 — Dynamic Stressor-Specific Questions
export const STRESSOR_QUESTIONS = {
  studies: [
    { id: 'studies_1', question: 'How many hours do you typically study per day?', type: 'number', required: true },
    { id: 'studies_2', question: 'How overwhelming does your coursework feel?', type: 'slider', min: 1, max: 10, lowLabel: 'Manageable', highLabel: 'Overwhelming', required: true },
    { id: 'studies_3', question: 'How many assignments are currently pending?', type: 'number', required: true },
    { id: 'studies_4', question: 'How stressed are you about your grades?', type: 'slider', min: 1, max: 10, lowLabel: 'Not Stressed', highLabel: 'Extremely Stressed', required: true },
    { id: 'studies_5', question: 'Do deadlines cause you anxiety?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'studies_6', question: 'Do you struggle to focus while studying?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'studies_7', question: 'Do you compare yourself to classmates?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'studies_8', question: 'Do you feel academic pressure from your parents?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'studies_9', question: 'How often do you feel behind in your studies?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false },
    { id: 'studies_10', question: 'Do you have a clear study schedule you follow?', type: 'radio', options: ['Yes', 'No', 'Sometimes'], required: true }
  ],

  exams: [
    { id: 'exams_1', question: 'How many upcoming exams do you have?', type: 'number', required: true },
    { id: 'exams_2', question: 'How would you rate your exam stress level?', type: 'slider', min: 1, max: 10, lowLabel: 'Low', highLabel: 'Severe', required: true },
    { id: 'exams_3', question: 'Do you fear failure in exams?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'exams_4', question: 'Do you experience panic before exams?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'exams_5', question: 'Has your sleep been affected due to exams?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'exams_6', question: 'How confident do you feel about your exam preparation?', type: 'slider', min: 1, max: 10, lowLabel: 'Not Confident', highLabel: 'Very Confident', required: true },
    { id: 'exams_7', question: 'Do you feel pressure from peers regarding exam performance?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false },
    { id: 'exams_8', question: 'How often do you study past midnight before exams?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false }
  ],

  assignments: [
    { id: 'assign_1', question: 'How many pending assignments do you have?', type: 'number', required: true },
    { id: 'assign_2', question: 'How much pressure do you feel about submissions?', type: 'slider', min: 1, max: 10, lowLabel: 'No Pressure', highLabel: 'Extreme Pressure', required: true },
    { id: 'assign_3', question: 'Do you often complete work at the last minute?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'assign_4', question: 'How difficult is it to manage multiple deadlines?', type: 'slider', min: 1, max: 10, lowLabel: 'Easy', highLabel: 'Very Difficult', required: true },
    { id: 'assign_5', question: 'Does group project work stress you out?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'assign_6', question: 'Do you feel assignments affect your mental peace?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'assign_7', question: 'How often do you ask for extensions?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false }
  ],

  sleep: [
    { id: 'sleep_1', question: 'How many hours do you sleep on average?', type: 'number', required: true },
    { id: 'sleep_2', question: 'How would you rate your sleep quality?', type: 'slider', min: 1, max: 10, lowLabel: 'Very Poor', highLabel: 'Excellent', required: true },
    { id: 'sleep_3', question: 'Do you have difficulty falling asleep?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'sleep_4', question: 'Do you wake up feeling tired?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'sleep_5', question: 'How often do you wake up in the middle of the night?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'sleep_6', question: 'Is your sleep schedule consistent?', type: 'radio', options: ['Yes', 'No', 'Somewhat'], required: true },
    { id: 'sleep_7', question: 'Do you use screens late at night?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'sleep_8', question: 'How much does poor sleep affect your productivity?', type: 'slider', min: 1, max: 10, lowLabel: 'Not at All', highLabel: 'Severely', required: true },
    { id: 'sleep_9', question: 'Do you consume caffeine or energy drinks to stay awake?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false },
    { id: 'sleep_10', question: 'Do you have nightmares or disturbing dreams?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false }
  ],

  family: [
    { id: 'family_1', question: 'How often do family conflicts occur?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'family_2', question: 'Do you feel emotionally supported at home?', type: 'radio', options: ['Yes', 'No', 'Sometimes'], required: true },
    { id: 'family_3', question: 'Do you feel pressure from your family?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'family_4', question: 'How stressed do you feel about family expectations?', type: 'slider', min: 1, max: 10, lowLabel: 'Not Stressed', highLabel: 'Extremely Stressed', required: true },
    { id: 'family_5', question: 'Is your home environment peaceful?', type: 'radio', options: ['Yes', 'No', 'Sometimes'], required: true },
    { id: 'family_6', question: 'How would you rate communication with your family?', type: 'slider', min: 1, max: 10, lowLabel: 'Poor', highLabel: 'Excellent', required: true },
    { id: 'family_7', question: 'Do family responsibilities affect your studies?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false },
    { id: 'family_8', question: 'Do you feel understood by your family?', type: 'radio', options: ['Yes', 'No', 'Sometimes'], required: false }
  ],

  friends: [
    { id: 'friends_1', question: 'Do you have a supportive friend circle?', type: 'radio', options: ['Yes', 'No', 'Somewhat'], required: true },
    { id: 'friends_2', question: 'How often do you feel isolated from others?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'friends_3', question: 'Do you experience social conflicts?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'friends_4', question: 'Do you feel peer pressure?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'friends_5', question: 'How difficult is it to express your feelings to friends?', type: 'slider', min: 1, max: 10, lowLabel: 'Very Easy', highLabel: 'Very Difficult', required: true },
    { id: 'friends_6', question: 'Do you feel left out in social situations?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'friends_7', question: 'How often do you spend quality time with friends?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false }
  ],

  relationship: [
    { id: 'rel_1', question: 'How much is your relationship affecting your mood?', type: 'slider', min: 1, max: 10, lowLabel: 'Not at All', highLabel: 'Very Much', required: true },
    { id: 'rel_2', question: 'How often do conflicts occur in your relationship?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'rel_3', question: 'Do you feel emotionally dependent on your partner?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'rel_4', question: 'Do you have trust issues in your relationship?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'rel_5', question: 'How would you rate communication with your partner?', type: 'slider', min: 1, max: 10, lowLabel: 'Poor', highLabel: 'Excellent', required: true },
    { id: 'rel_6', question: 'Does your relationship distract you from your goals?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'rel_7', question: 'Do you feel your relationship is balanced and healthy?', type: 'radio', options: ['Yes', 'No', 'Not Sure'], required: false }
  ],

  career: [
    { id: 'career_1', question: 'How anxious do you feel about placements and career?', type: 'slider', min: 1, max: 10, lowLabel: 'Not Anxious', highLabel: 'Extremely Anxious', required: true },
    { id: 'career_2', question: 'How uncertain do you feel about your future?', type: 'slider', min: 1, max: 10, lowLabel: 'Very Certain', highLabel: 'Very Uncertain', required: true },
    { id: 'career_3', question: 'Do you fear being unemployed after graduation?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'career_4', question: 'Do you feel pressure to build a strong resume?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'career_5', question: 'How worried are you about skill gaps?', type: 'slider', min: 1, max: 10, lowLabel: 'Not Worried', highLabel: 'Very Worried', required: true },
    { id: 'career_6', question: 'How stressed do you feel about interviews?', type: 'slider', min: 1, max: 10, lowLabel: 'Not Stressed', highLabel: 'Very Stressed', required: true },
    { id: 'career_7', question: 'Do you compare your career progress with peers?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'career_8', question: 'Do you feel your degree alone may not be enough?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'career_9', question: 'How often do you think about switching career paths?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false },
    { id: 'career_10', question: 'Do you feel supported by your college for placements?', type: 'radio', options: ['Yes', 'No', 'Somewhat'], required: false }
  ],

  financial: [
    { id: 'fin_1', question: 'How stressed are you about tuition and fees?', type: 'slider', min: 1, max: 10, lowLabel: 'Not Stressed', highLabel: 'Extremely Stressed', required: true },
    { id: 'fin_2', question: 'Do family finances affect your ability to focus on studies?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'fin_3', question: 'Do you need to work part-time to support yourself?', type: 'radio', options: ['Yes', 'No'], required: true },
    { id: 'fin_4', question: 'How often do you worry about money?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'fin_5', question: 'Does financial stress affect your mental health?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'fin_6', question: 'Do you feel you are missing out due to financial constraints?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false }
  ],

  physical_health: [
    { id: 'phys_1', question: 'How often do you experience chronic fatigue?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'phys_2', question: 'How frequently do you get headaches?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'phys_3', question: 'How many days a week do you exercise?', type: 'number', required: true },
    { id: 'phys_4', question: 'How would you describe your eating habits?', type: 'radio', options: ['Healthy', 'Moderate', 'Poor', 'Very Poor'], required: true },
    { id: 'phys_5', question: 'Do health issues affect your academic performance?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'phys_6', question: 'How often do you skip meals?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'phys_7', question: 'Do you have any chronic health conditions affecting you?', type: 'radio', options: ['Yes', 'No'], required: false }
  ],

  mental_health: [
    { id: 'mh_1', question: 'How often do you feel anxious?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'mh_2', question: 'Have you experienced panic episodes?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'mh_3', question: 'How often do you experience emotional breakdowns?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'mh_4', question: 'Do you struggle with negative thoughts?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'mh_5', question: 'How often do you feel persistent sadness?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'mh_6', question: 'Do you feel emotionally numb or disconnected?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'mh_7', question: 'Have you sought professional help for mental health?', type: 'radio', options: ['Yes, currently', 'Yes, in the past', 'No, but I want to', 'No, I do not need it'], required: true },
    { id: 'mh_8', question: 'Do you feel your emotions are hard to control?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'mh_9', question: 'How often do you feel overwhelmed by your thoughts?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false },
    { id: 'mh_10', question: 'Do you have someone you can talk to about your feelings?', type: 'radio', options: ['Yes', 'No', 'Not sure'], required: false }
  ],

  social_pressure: [
    { id: 'sp_1', question: 'Do you feel pressure to fit in socially?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'sp_2', question: 'How often do you compare yourself to others on social media?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'sp_3', question: 'Do you feel judged by your peers?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'sp_4', question: 'How much does social approval matter to you?', type: 'slider', min: 1, max: 10, lowLabel: 'Not at All', highLabel: 'Very Much', required: true },
    { id: 'sp_5', question: 'Do you feel the need to pretend everything is fine?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'sp_6', question: 'How often do social situations drain your energy?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'sp_7', question: 'Do you feel pressure to be perfect in every area?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false }
  ],

  loneliness: [
    { id: 'lone_1', question: 'How often do you feel isolated from others?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'lone_2', question: 'Do you feel understood by the people around you?', type: 'radio', options: ['Yes', 'No', 'Sometimes'], required: true },
    { id: 'lone_3', question: 'Do you lack emotional support when you need it?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'lone_4', question: 'How disconnected do you feel from others?', type: 'slider', min: 1, max: 10, lowLabel: 'Very Connected', highLabel: 'Completely Disconnected', required: true },
    { id: 'lone_5', question: 'How often do you wish you had closer relationships?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'lone_6', question: 'Do you feel comfortable reaching out to someone when lonely?', type: 'radio', options: ['Yes', 'No', 'Sometimes'], required: true },
    { id: 'lone_7', question: 'Has loneliness affected your motivation?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false }
  ],

  time_management: [
    { id: 'tm_1', question: 'How often do you miss deadlines?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'tm_2', question: 'Do you tend to overcommit yourself?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'tm_3', question: 'How would you rate your scheduling and planning skills?', type: 'slider', min: 1, max: 10, lowLabel: 'Poor', highLabel: 'Excellent', required: true },
    { id: 'tm_4', question: 'Do you feel like you are constantly rushing?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'tm_5', question: 'How well do you balance study and personal life?', type: 'slider', min: 1, max: 10, lowLabel: 'Very Poorly', highLabel: 'Very Well', required: true },
    { id: 'tm_6', question: 'Do you often feel there is not enough time in the day?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'tm_7', question: 'How often do you procrastinate?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: true },
    { id: 'tm_8', question: 'Do you use any time management tools or techniques?', type: 'radio', options: ['Yes, consistently', 'Yes, sometimes', 'No, but I want to', 'No, I do not need them'], required: true },
    { id: 'tm_9', question: 'How often are you late to classes or appointments?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false },
    { id: 'tm_10', question: 'Do you feel guilty when taking breaks?', type: 'scale', options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'], required: false }
  ],

  other: [
    { id: 'other_1', question: 'What else has been affecting your wellbeing?', type: 'textarea', required: false },
    { id: 'other_2', question: 'How intense does this feel?', type: 'slider', min: 1, max: 10, lowLabel: 'Mild', highLabel: 'Severe', required: false }
  ]
}

// Section 5 — Lifestyle Assessment (All users answer)
export const LIFESTYLE_ASSESSMENT = [
  {
    id: 'life_1',
    question: 'What is your average daily screen time (in hours)?',
    type: 'number',
    required: true
  },
  {
    id: 'life_2',
    question: 'How many days per week do you exercise?',
    type: 'number',
    required: true
  },
  {
    id: 'life_3',
    question: 'How many glasses of water do you drink daily?',
    type: 'number',
    required: true
  },
  {
    id: 'life_4',
    question: 'How many meals do you skip in a typical week?',
    type: 'number',
    required: true
  },
  {
    id: 'life_5',
    question: 'How much time do you spend outdoors daily?',
    type: 'radio',
    required: true,
    options: ['<30 mins', '30 mins–1 hr', '1–2 hrs', '2+ hrs', 'Almost none']
  },
  {
    id: 'life_6',
    question: 'How often do you take breaks during study sessions?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'life_7',
    question: 'How frequently do you interact with friends/family socially?',
    type: 'scale',
    required: true,
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    id: 'life_8',
    question: 'How well do you recover on weekends?',
    type: 'slider',
    required: true,
    min: 1,
    max: 10,
    lowLabel: 'Not at All',
    highLabel: 'Completely Recharged'
  }
]

// Section 6 — Emotional Vent Journal
export const VENT_JOURNAL = [
  {
    id: 'vent_1',
    question: 'Would you like to share anything else?',
    subtitle: "What's bothering you? What feels hardest right now? What do you wish people understood?",
    type: 'journal',
    required: false,
    maxLength: 2000,
    placeholder: 'Share your thoughts freely... This is a safe space.'
  }
]

// Section definitions for the wizard
export const ASSESSMENT_SECTIONS = [
  {
    id: 'mood',
    title: 'Mood Snapshot',
    subtitle: 'How are you feeling right now?',
    icon: 'Heart',
    questions: MOOD_SNAPSHOT
  },
  {
    id: 'stressors',
    title: 'Stressor Selection',
    subtitle: 'What areas are affecting your wellbeing?',
    icon: 'AlertTriangle',
    questions: STRESSOR_SELECTION
  },
  {
    id: 'core',
    title: 'Core Burnout Assessment',
    subtitle: 'Understanding your burnout patterns',
    icon: 'Activity',
    questions: CORE_BURNOUT
  },
  {
    id: 'dynamic',
    title: 'Stress-Specific Questions',
    subtitle: 'Diving deeper into your concerns',
    icon: 'FileText',
    questions: [] // Dynamic based on selected stressors
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Assessment',
    subtitle: 'Your daily habits and routines',
    icon: 'Sun',
    questions: LIFESTYLE_ASSESSMENT
  },
  {
    id: 'vent',
    title: 'Emotional Vent',
    subtitle: 'Share what is on your mind',
    icon: 'MessageSquare',
    questions: VENT_JOURNAL
  }
]