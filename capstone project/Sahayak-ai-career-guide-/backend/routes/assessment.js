const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Attempt = require('../models/Attempt');

// Gemini/OpenAI integration removed per request.
// Provide lightweight local stubs for suggestions and questions so the app continues working.

// Calculate average marks from the marks object
function calculateAverageMarks(marks) {
  const values = Object.values(marks).filter(v => v !== '' && v !== null && !isNaN(parseFloat(v)));
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + parseFloat(val), 0);
  return sum / values.length;
}

function generateCareerSuggestionsStub(profile) {
  const { marks = {}, interests = [], currentClass = '', stream = '' } = profile || {};
  const topInterest = interests && interests.length ? interests[0] : 'General';
  const avgMarks = calculateAverageMarks(marks);
  
  // Generate career suggestions based on interests and marks
  const suggestedCareers = [];
  const lowerInterests = interests.map(i => i.toLowerCase()).join(' ');
  
  if (lowerInterests.includes('engineering') || lowerInterests.includes('non-med')) {
    if (avgMarks >= 85) {
      suggestedCareers.push(
        { name: 'Software Engineer', description: 'Build applications and systems. High demand, excellent salary prospects.' },
        { name: 'Data Scientist', description: 'Analyze data to drive business decisions. Growing field with AI/ML integration.' },
        { name: 'Mechanical Engineer', description: 'Design and develop mechanical systems. Core engineering discipline.' }
      );
    } else if (avgMarks >= 70) {
      suggestedCareers.push(
        { name: 'Software Developer', description: 'Develop software solutions. Good opportunities with skill development.' },
        { name: 'Electronics Engineer', description: 'Work with electronic systems and circuits.' },
        { name: 'Civil Engineer', description: 'Design infrastructure projects. Stable career option.' }
      );
    } else {
      suggestedCareers.push(
        { name: 'Diploma Engineer', description: 'Start with diploma courses and upgrade skills gradually.' },
        { name: 'Technical Support', description: 'Provide technical assistance and support.' }
      );
    }
  }
  
  if (lowerInterests.includes('medical') || lowerInterests.includes('med')) {
    if (avgMarks >= 85) {
      suggestedCareers.push(
        { name: 'Doctor (MBBS)', description: 'Practice medicine and save lives. Requires NEET qualification.' },
        { name: 'Surgeon', description: 'Specialize in surgical procedures. High skill requirement.' },
        { name: 'Medical Researcher', description: 'Conduct research in medical sciences.' }
      );
    } else if (avgMarks >= 70) {
      suggestedCareers.push(
        { name: 'Nursing', description: 'Provide patient care. Growing demand in healthcare.' },
        { name: 'Pharmacy', description: 'Dispense medications and provide pharmaceutical care.' },
        { name: 'Physiotherapy', description: 'Help patients recover from injuries.' }
      );
    } else {
      suggestedCareers.push(
        { name: 'Medical Lab Technician', description: 'Perform diagnostic tests in laboratories.' },
        { name: 'Healthcare Assistant', description: 'Support healthcare professionals.' }
      );
    }
  }
  
  if (lowerInterests.includes('commerce')) {
    suggestedCareers.push(
      { name: 'Chartered Accountant (CA)', description: 'Financial expert, high earning potential.' },
      { name: 'Business Analyst', description: 'Analyze business processes and improve efficiency.' },
      { name: 'Investment Banker', description: 'Work in finance and investment sectors.' }
    );
  }
  
  if (lowerInterests.includes('law')) {
    suggestedCareers.push(
      { name: 'Lawyer', description: 'Practice law, represent clients in court.' },
      { name: 'Corporate Lawyer', description: 'Handle corporate legal matters.' },
      { name: 'Legal Advisor', description: 'Provide legal consultation and advice.' }
    );
  }
  
  if (suggestedCareers.length === 0) {
    suggestedCareers.push(
      { name: 'General Professional', description: 'Explore various career options based on your interests.' },
      { name: 'Skill Development Track', description: 'Focus on building foundational skills and certifications.' }
    );
  }

  // Generate colleges based on marks, stream, and interests
  const colleges = generateCollegeListStub({ stream, interests, currentClass, marks });
  
  // Generate competitive exam roadmap
  const roadmapData = generateRoadmapStub({ stream, interests, currentClass });
  
  const preparationSteps = roadmapData.roadmap || [
    'Identify your top interest and research related careers',
    'Work on basic subject fundamentals based on marks',
    'Take short online courses to build practical skills',
    'Prepare application documents (resume, certificates)'
  ];

  const keySkills = [];
  if (lowerInterests.includes('engineering') || lowerInterests.includes('non-med')) {
    keySkills.push('Problem Solving', 'Mathematics', 'Logical Reasoning', 'Programming', 'Analytical Thinking');
  } else if (lowerInterests.includes('medical')) {
    keySkills.push('Biology', 'Chemistry', 'Memory Skills', 'Attention to Detail', 'Empathy');
  } else if (lowerInterests.includes('commerce')) {
    keySkills.push('Numerical Ability', 'Analytical Skills', 'Business Acumen', 'Communication');
  } else {
    keySkills.push('Communication', 'Critical Thinking', 'Research Skills', 'Problem Solving');
  }

  const entranceExams = roadmapData.exams || (currentClass === '12th' ? ['JEE / NEET / CLAT (depending on stream)'] : ['State board exams and early aptitude tests']);
  
  const studyStrategy = currentClass === '12th' 
    ? `Based on your ${stream} stream and ${avgMarks.toFixed(1)}% average marks:\n\n` +
      `1. Focus on strengthening weak subjects - aim for at least 80% in all subjects\n` +
      `2. Start competitive exam preparation early - ${entranceExams.join(', ')}\n` +
      `3. Create a daily study schedule: 4-6 hours for board exams + 2-3 hours for competitive prep\n` +
      `4. Take weekly mock tests and analyze performance\n` +
      `5. Revise NCERT thoroughly before moving to advanced materials\n` +
      `6. Join coaching or online courses for competitive exams\n` +
      `7. Maintain physical and mental health - exercise and proper sleep are crucial`
    : `Start with core subjects, schedule 2 hours/day for weak topics, and add 1-2 practical projects in ${topInterest}.`;

  return { suggestedCareers, colleges, preparationSteps, keySkills, entranceExams, studyStrategy, competitiveExamRoadmap: roadmapData };
}

function generateAptitudeQuestionsStub(interests, count = 20) {
  const questions = [];
  for (let i = 1; i <= count; i++) {
    questions.push({
      id: i,
      question: `Sample aptitude question ${i} related to ${interests.join(', ') || 'General Aptitude'}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'This is a sample question explanation.'
    });
  }
  return questions;
}

// Generate a comprehensive list of colleges based on course/stream/interests and marks
function generateCollegeListStub({ course = '', stream = '', interests = [], currentClass = '', marks = {} } = {}) {
  const list = [];
  const avgMarks = calculateAverageMarks(marks);
  const lowerCourse = (course || '').toLowerCase();
  const lowerInterests = (interests || []).join(' ').toLowerCase();
  const lowerStream = (stream || '').toLowerCase();

  // Engineering Colleges
  if (lowerCourse.includes('engineering') || lowerInterests.includes('engineering') || lowerInterests.includes('non-med') || lowerInterests.includes('computer') || lowerStream.includes('pcm')) {
    if (avgMarks >= 90) {
      // Top tier - IITs
      list.push(
        { name: 'IIT Bombay', city: 'Mumbai', link: 'https://www.iitb.ac.in/', course: 'B.Tech CSE/ECE/ME', cutoff: 'JEE Advanced: 95+ percentile', exam: 'JEE Advanced', fees: '₹2-2.5 L/year' },
        { name: 'IIT Delhi', city: 'New Delhi', link: 'https://home.iitd.ac.in/', course: 'B.Tech CSE/ECE', cutoff: 'JEE Advanced: 94+ percentile', exam: 'JEE Advanced', fees: '₹2-2.5 L/year' },
        { name: 'IIT Madras', city: 'Chennai', link: 'https://www.iitm.ac.in/', course: 'B.Tech CSE/ECE', cutoff: 'JEE Advanced: 93+ percentile', exam: 'JEE Advanced', fees: '₹2-2.5 L/year' },
        { name: 'IIT Kanpur', city: 'Kanpur', link: 'https://www.iitk.ac.in/', course: 'B.Tech CSE/ECE', cutoff: 'JEE Advanced: 92+ percentile', exam: 'JEE Advanced', fees: '₹2-2.5 L/year' }
      );
    }
    if (avgMarks >= 80) {
      // Second tier - NITs and top private
      list.push(
        { name: 'NIT Trichy', city: 'Tiruchirappalli', link: 'https://www.nitt.edu/', course: 'B.Tech CSE/ECE', cutoff: 'JEE Main: 85+ percentile', exam: 'JEE Main', fees: '₹1.5-2 L/year' },
        { name: 'NIT Surathkal', city: 'Mangalore', link: 'https://www.nitk.ac.in/', course: 'B.Tech CSE/ECE', cutoff: 'JEE Main: 84+ percentile', exam: 'JEE Main', fees: '₹1.5-2 L/year' },
        { name: 'BITS Pilani', city: 'Pilani', link: 'https://www.bits-pilani.ac.in/', course: 'B.E. CSE/ECE', cutoff: 'BITSAT: 300+ marks', exam: 'BITSAT', fees: '₹4-5 L/year' },
        { name: 'NIT Warangal', city: 'Warangal', link: 'https://www.nitw.ac.in/', course: 'B.Tech CSE/ECE', cutoff: 'JEE Main: 82+ percentile', exam: 'JEE Main', fees: '₹1.5-2 L/year' }
      );
    }
    if (avgMarks >= 70) {
      // Third tier - Other NITs and good private colleges
      list.push(
        { name: 'NIT Calicut', city: 'Calicut', link: 'https://www.nitc.ac.in/', course: 'B.Tech', cutoff: 'JEE Main: 75+ percentile', exam: 'JEE Main', fees: '₹1.5-2 L/year' },
        { name: 'VIT Vellore', city: 'Vellore', link: 'https://vit.ac.in/', course: 'B.Tech CSE/ECE', cutoff: 'VITEEE: Good score', exam: 'VITEEE', fees: '₹2-3 L/year' },
        { name: 'SRM University', city: 'Chennai', link: 'https://www.srmist.edu.in/', course: 'B.Tech CSE/ECE', cutoff: 'SRMJEEE: Good score', exam: 'SRMJEEE', fees: '₹2-3 L/year' },
        { name: 'Manipal Institute of Technology', city: 'Manipal', link: 'https://manipal.edu/mit.html', course: 'B.Tech CSE/ECE', cutoff: 'MET: Good score', exam: 'MET', fees: '₹2.5-3.5 L/year' }
      );
    }
    // Always include some options
    if (list.length === 0) {
      list.push(
        { name: 'State Engineering Colleges', city: 'Various', link: '#', course: 'B.Tech', cutoff: 'State CET: Varies', exam: 'State CET', fees: '₹50K-1.5 L/year' },
        { name: 'Private Engineering Colleges', city: 'Various', link: '#', course: 'B.Tech', cutoff: 'Direct admission or entrance', exam: 'Various', fees: '₹1-3 L/year' }
      );
    }
  }
  
  // Medical Colleges
  else if (lowerCourse.includes('medical') || lowerInterests.includes('medical') || lowerInterests.includes('med') || lowerStream.includes('pcb')) {
    if (avgMarks >= 90) {
      list.push(
        { name: 'AIIMS New Delhi', city: 'New Delhi', link: 'https://www.aiims.edu/', course: 'MBBS', cutoff: 'NEET: 700+ marks (AIR 1-100)', exam: 'NEET-UG', fees: '₹5K-10K/year' },
        { name: 'AIIMS Jodhpur', city: 'Jodhpur', link: 'https://www.aiimsjodhpur.edu.in/', course: 'MBBS', cutoff: 'NEET: 680+ marks', exam: 'NEET-UG', fees: '₹5K-10K/year' },
        { name: 'Christian Medical College Vellore', city: 'Vellore', link: 'https://www.cmch-vellore.edu/', course: 'MBBS', cutoff: 'NEET: 650+ marks', exam: 'NEET-UG', fees: '₹50K-1 L/year' }
      );
    }
    if (avgMarks >= 80) {
      list.push(
        { name: 'Maulana Azad Medical College', city: 'New Delhi', link: 'https://www.mamc.ac.in/', course: 'MBBS', cutoff: 'NEET: 620+ marks', exam: 'NEET-UG', fees: '₹10K-50K/year' },
        { name: 'King George\'s Medical University', city: 'Lucknow', link: 'https://www.kgmu.org/', course: 'MBBS', cutoff: 'NEET: 600+ marks', exam: 'NEET-UG', fees: '₹10K-50K/year' },
        { name: 'Grant Medical College', city: 'Mumbai', link: 'https://www.grantmedicalcollege-jjhospital.org/', course: 'MBBS', cutoff: 'NEET: 580+ marks', exam: 'NEET-UG', fees: '₹10K-50K/year' }
      );
    }
    if (avgMarks >= 70) {
      list.push(
        { name: 'State Medical Colleges', city: 'Various', link: '#', course: 'MBBS', cutoff: 'NEET: 550+ marks', exam: 'NEET-UG', fees: '₹10K-1 L/year' },
        { name: 'Private Medical Colleges', city: 'Various', link: '#', course: 'MBBS', cutoff: 'NEET: 500+ marks', exam: 'NEET-UG', fees: '₹5-20 L/year' }
      );
    }
    if (list.length === 0) {
      list.push(
        { name: 'Government Medical Colleges', city: 'Various', link: '#', course: 'MBBS', cutoff: 'NEET: Varies by state', exam: 'NEET-UG', fees: '₹10K-1 L/year' },
        { name: 'Private Medical Colleges', city: 'Various', link: '#', course: 'MBBS', cutoff: 'NEET: Minimum qualifying', exam: 'NEET-UG', fees: '₹5-25 L/year' }
      );
    }
  }
  
  // Commerce Colleges
  else if (lowerCourse.includes('commerce') || lowerInterests.includes('commerce') || lowerStream === 'commerce') {
    list.push(
      { name: 'Shri Ram College of Commerce (SRCC)', city: 'New Delhi', link: 'https://www.srcc.edu/', course: 'B.Com (Hons) / BBA', cutoff: 'CUET: 95+ percentile', exam: 'CUET', fees: '₹20K-50K/year' },
      { name: 'St. Xavier\'s College', city: 'Kolkata / Mumbai', link: 'https://www.sxccal.edu/', course: 'B.Com / BBA', cutoff: 'Merit-based: 95%+', exam: 'Merit/Entrance', fees: '₹30K-80K/year' },
      { name: 'Loyola College', city: 'Chennai', link: 'https://www.loyolacollege.edu/', course: 'B.Com / BBA', cutoff: 'Merit-based: 90%+', exam: 'Merit', fees: '₹25K-60K/year' },
      { name: 'Christ University', city: 'Bangalore', link: 'https://christuniversity.in/', course: 'B.Com / BBA', cutoff: 'CUET/Entrance: Good score', exam: 'CUET/Entrance', fees: '₹1-2 L/year' },
      { name: 'Narsee Monjee College', city: 'Mumbai', link: 'https://www.nmims.edu/', course: 'B.Com / BBA', cutoff: 'NMIMS NPAT: Good score', exam: 'NPAT', fees: '₹1.5-2.5 L/year' }
    );
  }
  
  // Law Colleges
  else if (lowerCourse.includes('law') || lowerInterests.includes('law') || lowerInterests.includes('political')) {
    list.push(
      { name: 'National Law School of India University (NLSIU)', city: 'Bangalore', link: 'https://www.nls.ac.in/', course: 'BA LLB (Hons)', cutoff: 'CLAT: 100+ marks', exam: 'CLAT', fees: '₹2-3 L/year' },
      { name: 'NALSAR University of Law', city: 'Hyderabad', link: 'https://nalsar.ac.in/', course: 'BA LLB (Hons)', cutoff: 'CLAT: 95+ marks', exam: 'CLAT', fees: '₹2-3 L/year' },
      { name: 'National Law University Delhi', city: 'New Delhi', link: 'https://nludelhi.ac.in/', course: 'BA LLB (Hons)', cutoff: 'AILET: Good score', exam: 'AILET', fees: '₹2-3 L/year' },
      { name: 'Symbiosis Law School', city: 'Pune', link: 'https://www.symlaw.ac.in/', course: 'BA LLB / BBA LLB', cutoff: 'SLAT: Good score', exam: 'SLAT', fees: '₹2-4 L/year' },
      { name: 'Jindal Global Law School', city: 'Sonipat', link: 'https://www.jgu.edu.in/jgls/', course: 'BA LLB / BBA LLB', cutoff: 'LSAT-India: Good score', exam: 'LSAT-India', fees: '₹3-5 L/year' }
    );
  }
  
  // General / Arts / Multidisciplinary
  else {
    list.push(
      { name: 'Delhi University', city: 'New Delhi', link: 'http://www.du.ac.in/', course: 'BA / B.Sc / B.Com', cutoff: 'CUET: 85+ percentile', exam: 'CUET', fees: '₹10K-50K/year' },
      { name: 'University of Mumbai', city: 'Mumbai', link: 'https://mu.ac.in/', course: 'Various UG courses', cutoff: 'Merit-based', exam: 'Merit/Entrance', fees: '₹10K-50K/year' },
      { name: 'Jawaharlal Nehru University', city: 'New Delhi', link: 'https://www.jnu.ac.in/', course: 'BA / B.Sc', cutoff: 'JNUEE: Good score', exam: 'JNUEE', fees: '₹5K-20K/year' },
      { name: 'University of Calcutta', city: 'Kolkata', link: 'https://www.caluniv.ac.in/', course: 'Various UG courses', cutoff: 'Merit-based', exam: 'Merit', fees: '₹5K-30K/year' }
    );
  }

  // Add vocational options for 10th class
  if (currentClass === '10th') {
    list.push(
      { name: 'State Polytechnic Colleges', city: 'Various', link: '#', course: 'Diploma in Engineering', cutoff: 'State entrance or merit', exam: 'State Entrance', fees: '₹20K-50K/year' },
      { name: 'ITI (Industrial Training Institutes)', city: 'Various', link: '#', course: 'Vocational Courses', cutoff: 'Direct admission', exam: 'Direct', fees: '₹5K-20K/year' }
    );
  }

  return list;
}

// Generate comprehensive competitive exam roadmap with detailed timeline
function generateRoadmapStub({ course = '', stream = '', currentClass = '', interests = [] } = {}) {
  const roadmap = [];
  const exams = [];
  const examDetails = [];
  const timeline = [];
  const lowerCourse = (course || '').toLowerCase();
  const lowerStream = (stream || '').toLowerCase();
  const lowerInterests = (interests || []).join(' ').toLowerCase();

  // Engineering Roadmap (JEE)
  if (lowerCourse.includes('engineering') || lowerCourse.includes('computer') || lowerStream.includes('pcm') || lowerInterests.includes('engineering') || lowerInterests.includes('non-med')) {
    exams.push('JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs (MHT-CET, WBJEE, etc.)');
    
    examDetails.push({
      name: 'JEE Main',
      description: 'National level engineering entrance exam conducted twice a year',
      eligibility: '12th with PCM, 75% aggregate (65% for SC/ST)',
      examDate: 'January & April',
      syllabus: 'Physics, Chemistry, Mathematics (Class 11 & 12)',
      preparationTime: '1-2 years',
      tips: 'Focus on NCERT first, then move to advanced books. Practice previous year papers and mock tests regularly.'
    });
    
    examDetails.push({
      name: 'JEE Advanced',
      description: 'For admission to IITs. Only top 2.5 lakh JEE Main qualifiers can appear',
      eligibility: 'Top 2.5L rank in JEE Main',
      examDate: 'May-June',
      syllabus: 'Advanced Physics, Chemistry, Mathematics',
      preparationTime: '2 years intensive',
      tips: 'Requires deep conceptual understanding. Focus on problem-solving and time management.'
    });

    if (currentClass === '12th') {
      timeline.push(
        { phase: 'Class 11', months: 'April - March', tasks: ['Complete NCERT syllabus for all subjects', 'Build strong foundation in Physics, Chemistry, Math', 'Start solving basic problems', 'Join coaching or online classes'] },
        { phase: 'Class 12 (First 6 months)', months: 'April - September', tasks: ['Complete 12th board syllabus', 'Start JEE Main preparation simultaneously', 'Take weekly mock tests', 'Focus on weak topics'] },
        { phase: 'Class 12 (Last 6 months)', months: 'October - March', tasks: ['Intensive revision of both board and JEE syllabus', 'Take full-length mock tests every week', 'Solve previous 10 years JEE Main papers', 'Focus on time management'] },
        { phase: 'After 12th Boards', months: 'April - May', tasks: ['Appear in JEE Main (if not cleared in Jan)', 'Prepare for JEE Advanced if qualified', 'Practice advanced level problems', 'Take JEE Advanced mock tests'] }
      );
    }

    roadmap.push(
      '📚 Foundation Phase (Class 11): Master NCERT thoroughly. Build concepts, don\'t just memorize.',
      '🎯 Preparation Phase (Class 12): Balance board exams and JEE prep. 4-5 hours daily for competitive prep.',
      '📝 Practice Phase: Solve 20-30 problems daily. Focus on accuracy first, then speed.',
      '📊 Mock Test Phase: Take 2-3 full-length tests weekly. Analyze mistakes and improve.',
      '⏰ Time Management: Allocate time - 40% Physics, 30% Chemistry, 30% Mathematics',
      '📖 Study Materials: NCERT → HC Verma (Physics), OP Tandon (Chemistry), Cengage/Arihant (Math)',
      '🔄 Revision: Revise each topic 3-4 times. Make formula sheets and concept maps.',
      '💪 Consistency: Study 6-8 hours daily. Take breaks, maintain health.'
    );
  }
  
  // Medical Roadmap (NEET)
  else if (lowerCourse.includes('medical') || lowerStream.includes('pcb') || lowerInterests.includes('medical') || lowerInterests.includes('med')) {
    exams.push('NEET-UG');
    
    examDetails.push({
      name: 'NEET-UG',
      description: 'National Eligibility cum Entrance Test for MBBS/BDS courses',
      eligibility: '12th with PCB, 50% aggregate (40% for SC/ST/OBC)',
      examDate: 'May (usually)',
      syllabus: 'Physics, Chemistry, Biology (Class 11 & 12 NCERT)',
      preparationTime: '1-2 years',
      tips: 'NCERT is the bible for NEET. Read it 5-6 times. Focus on diagrams and examples. Practice MCQs daily.'
    });

    if (currentClass === '12th') {
      timeline.push(
        { phase: 'Class 11', months: 'April - March', tasks: ['Complete NCERT Biology, Physics, Chemistry', 'Understand concepts thoroughly', 'Start solving NEET-level MCQs', 'Make notes for important topics'] },
        { phase: 'Class 12 (First 6 months)', months: 'April - September', tasks: ['Complete 12th NCERT syllabus', 'Start NEET preparation parallel to boards', 'Take weekly NEET mock tests', 'Focus on Biology (highest weightage)'] },
        { phase: 'Class 12 (Last 6 months)', months: 'October - March', tasks: ['Complete board exam preparation', 'Intensive NEET revision', 'Solve previous 10 years NEET papers', 'Focus on weak subjects'] },
        { phase: 'After 12th Boards', months: 'April - May', tasks: ['Final NEET preparation', 'Take daily mock tests', 'Revise NCERT 2-3 times', 'Focus on time management (3 hours, 180 questions)'] }
      );
    }

    roadmap.push(
      '📚 NCERT Focus: Read NCERT Biology, Physics, Chemistry 5-6 times. Every line is important.',
      '🧬 Biology Priority: 50% of paper is Biology. Master it - Botany and Zoology both.',
      '⚗️ Chemistry Strategy: Organic Chemistry needs practice. Inorganic - memorize NCERT. Physical - solve numericals.',
      '⚛️ Physics Approach: Focus on NCERT examples and exercises. Practice numerical problems daily.',
      '📝 MCQ Practice: Solve 100-150 MCQs daily. Use previous year papers and mock tests.',
      '⏰ Time Management: 3 hours for 180 questions = 1 min per question. Practice speed.',
      '📊 Mock Tests: Take 2-3 NEET mock tests weekly. Analyze performance and improve.',
      '🔄 Revision: Revise NCERT monthly. Make flashcards for important facts and formulas.'
    );
  }
  
  // Law Roadmap (CLAT)
  else if (lowerCourse.includes('law') || lowerInterests.includes('law')) {
    exams.push('CLAT', 'AILET', 'SLAT', 'LSAT-India');
    
    examDetails.push({
      name: 'CLAT',
      description: 'Common Law Admission Test for NLUs and other law colleges',
      eligibility: '12th with 45% (40% for SC/ST)',
      examDate: 'May',
      syllabus: 'English, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques',
      preparationTime: '6-12 months',
      tips: 'Read newspapers daily. Practice logical reasoning. Improve reading speed and comprehension.'
    });

    if (currentClass === '12th') {
      timeline.push(
        { phase: 'Early Preparation', months: 'June - December', tasks: ['Start reading newspapers daily (The Hindu, Indian Express)', 'Build vocabulary and reading comprehension', 'Practice logical reasoning questions', 'Study current affairs (last 6 months)'] },
        { phase: 'Intensive Preparation', months: 'January - April', tasks: ['Focus on legal reasoning and aptitude', 'Take weekly CLAT mock tests', 'Revise current affairs', 'Practice previous year papers'] },
        { phase: 'Final Phase', months: 'May', tasks: ['Final revision of all sections', 'Take daily mock tests', 'Focus on time management', 'Stay updated with current events'] }
      );
    }

    roadmap.push(
      '📰 Current Affairs: Read newspapers daily. Follow monthly current affairs magazines.',
      '📖 English: Improve vocabulary, reading comprehension, and grammar. Read editorials.',
      '⚖️ Legal Reasoning: Understand legal principles. Practice case-based questions.',
      '🧠 Logical Reasoning: Practice puzzles, syllogisms, and analytical reasoning daily.',
      '🔢 Quantitative: Basic math from Class 10. Focus on accuracy and speed.',
      '📝 Mock Tests: Take CLAT mock tests weekly. Analyze performance in each section.',
      '⏰ Time Management: 2 hours for 150 questions. Practice sectional time limits.',
      '🔄 Revision: Revise current affairs monthly. Practice legal reasoning regularly.'
    );
  }
  
  // Commerce Roadmap
  else if (lowerCourse.includes('commerce') || lowerStream === 'commerce' || lowerInterests.includes('commerce')) {
    exams.push('CUET', 'CA Foundation', 'IPMAT', 'NPAT');
    
    examDetails.push({
      name: 'CUET',
      description: 'Common University Entrance Test for central universities',
      eligibility: '12th pass',
      examDate: 'May-July',
      syllabus: 'Domain subjects, General Test, Language',
      preparationTime: '3-6 months',
      tips: 'Focus on your domain subjects. Practice mock tests. Improve language skills.'
    });

    examDetails.push({
      name: 'CA Foundation',
      description: 'Entry level exam for Chartered Accountancy',
      eligibility: '12th pass',
      examDate: 'June & December',
      syllabus: 'Principles of Accounting, Business Laws, Business Mathematics, Economics',
      preparationTime: '4-6 months',
      tips: 'Focus on accounting fundamentals. Practice numerical problems. Understand business concepts.'
    });

    if (currentClass === '12th') {
      timeline.push(
        { phase: 'Class 12', months: 'April - March', tasks: ['Focus on board exams', 'Maintain good percentage (90%+)', 'Start preparing for CUET/entrance exams', 'Build strong foundation in Accountancy and Economics'] },
        { phase: 'After Boards', months: 'April - May', tasks: ['Intensive CUET preparation', 'Take mock tests', 'Focus on domain subjects', 'Prepare for university-specific exams'] }
      );
    }

    roadmap.push(
      '📊 Accountancy: Master fundamentals. Practice journal entries, balance sheets regularly.',
      '💼 Business Studies: Understand concepts, case studies. Relate to real-world examples.',
      '📈 Economics: Focus on micro and macro economics. Understand graphs and concepts.',
      '📝 CUET Preparation: Focus on domain subjects. Practice general test and language sections.',
      '🎯 CA Path: If interested, start CA Foundation preparation. Join coaching or self-study.',
      '📚 Study Materials: NCERT for boards, coaching material for competitive exams.',
      '⏰ Time Management: Balance board preparation with entrance exam prep.',
      '🔄 Revision: Regular revision of accounting concepts and business laws.'
    );
  }
  
  // General/Arts Roadmap
  else {
    exams.push('CUET', 'University-specific entrance exams');
    
    examDetails.push({
      name: 'CUET',
      description: 'Common University Entrance Test for various UG courses',
      eligibility: '12th pass',
      examDate: 'May-July',
      syllabus: 'Domain subjects, General Test, Language',
      preparationTime: '3-6 months',
      tips: 'Focus on your chosen domain subjects. Practice general knowledge and language.'
    });

    if (currentClass === '12th') {
      timeline.push(
        { phase: 'Class 12', months: 'April - March', tasks: ['Focus on board exams', 'Maintain good percentage', 'Research universities and courses', 'Start CUET preparation'] },
        { phase: 'After Boards', months: 'April - May', tasks: ['CUET preparation', 'University-specific exam prep', 'Take mock tests', 'Final revision'] }
      );
    }

    roadmap.push(
      '📚 Board Focus: Maintain 85%+ in board exams for better opportunities.',
      '🎯 Course Research: Research various UG courses and universities.',
      '📝 Entrance Prep: Prepare for CUET and university-specific exams.',
      '📖 Study Strategy: Focus on domain subjects. Build general knowledge.',
      '⏰ Time Management: Balance board and entrance exam preparation.',
      '🔄 Revision: Regular revision of important topics.',
      '💡 Skill Development: Develop communication and analytical skills.',
      '📊 Mock Tests: Take regular mock tests to assess preparation.'
    );
  }

  // Early class advice
  if (currentClass === '10th') {
    roadmap.unshift('🎓 Focus on strong fundamentals in 10th. Choose 11th/12th stream aligned with your interest and career goals.');
    roadmap.push('📋 After 10th: Research streams (Science/Commerce/Arts) based on your interests and career aspirations.');
  }

  return { roadmap, exams, examDetails, timeline };
}

// Generate aptitude questions based on interests
router.post('/generate-questions', auth, async (req, res) => {
  try {
    const { interests } = req.body;
    
    if (!interests || interests.length === 0) {
      return res.status(400).json({ message: 'Interests required' });
    }

    // Use local stub instead of remote LLM
    const questions = generateAptitudeQuestionsStub(interests, 20);
    res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ message: 'Failed to generate questions', error: error.message });
  }
});

// Get AI-powered career suggestions
router.post('/get-suggestions', auth, async (req, res) => {
  try {
    const { marks, interests, currentClass, stream } = req.body;

    console.log('/api/assessment/get-suggestions called with body:', JSON.stringify(req.body).slice(0,1000));

    if (!marks || typeof marks !== 'object' || Object.keys(marks).length === 0) {
      return res.status(400).json({ message: 'Missing or invalid `marks` object' });
    }
    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ message: 'Please provide at least one interest' });
    }
    if (!currentClass) {
      return res.status(400).json({ message: 'Please provide currentClass (10th or 12th)'});
    }

    // Use local stub instead of remote LLM
    const suggestions = generateCareerSuggestionsStub({ marks, interests, currentClass, stream });
    res.json({ suggestions });
  } catch (error) {
    console.error('Error getting suggestions:', error && (error.stack || error.message || error));
    // Return a helpful message but keep stack out of response
    res.status(500).json({ message: 'Failed to get suggestions from AI service', error: error.message || 'Internal error' });
  }
});

// Get college list for a chosen course/stream
router.post('/get-colleges', auth, async (req, res) => {
  try {
    const { course = '', stream = '', interests = [], currentClass = '' } = req.body || {};
    if (!course && (!interests || interests.length === 0)) {
      return res.status(400).json({ message: 'Please provide `course` or `interests` to get college recommendations' });
    }

    const colleges = generateCollegeListStub({ course, stream, interests, currentClass });
    res.json({ colleges });
  } catch (error) {
    console.error('Error getting college list:', error);
    res.status(500).json({ message: 'Failed to fetch college list' });
  }
});

// Get roadmap & entrance exam info for a chosen course
router.post('/get-roadmap', auth, async (req, res) => {
  try {
    const { course = '', stream = '', currentClass = '' } = req.body || {};
    if (!course) {
      return res.status(400).json({ message: 'Please provide a `course` to get a roadmap' });
    }

    const details = generateRoadmapStub({ course, stream, currentClass });
    res.json({ roadmap: details.roadmap, entranceExams: details.exams });
  } catch (error) {
    console.error('Error getting roadmap:', error);
    res.status(500).json({ message: 'Failed to fetch roadmap' });
  }
});

// Submit assessment results
router.post('/submit-assessment', auth, async (req, res) => {
  try {
    const { mathsMarks, scienceMarks, ssMarks, interests, careerGoal, aptitudeScore, currentClass, testScore } = req.body;

    // Save assessment data to database (optional - for analytics)
    // You can create an Assessment model to store this

    res.json({ 
      message: 'Assessment submitted successfully',
      data: {
        mathsMarks,
        scienceMarks,
        ssMarks,
        interests,
        careerGoal,
        aptitudeScore,
        currentClass,
        testScore,
        submittedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    res.status(500).json({ message: 'Failed to submit assessment' });
  }
});

// Save quiz attempt for a student
router.post('/save-quiz-attempt', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { selectedClass, totalQuestions, correct, wrong, percentage, answers = {}, timeSpent = 0, questions = [] } = req.body || {};

    // ensure user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // create a separate Attempt document
    const attemptDoc = new Attempt({
      user: userId,
      class: selectedClass || '',
      totalQuestions: totalQuestions || 0,
      correct: correct || 0,
      wrong: wrong || 0,
      percentage: percentage || 0,
      timeSpent: timeSpent || 0,
      answers: answers || {},
      questions: Array.isArray(questions) ? questions : []
    });

    await attemptDoc.save();

    res.json({ message: 'Attempt saved', attempt: attemptDoc });
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    res.status(500).json({ message: 'Failed to save attempt' });
  }
});

// Get authenticated user's quiz attempts (from Attempt collection)
router.get('/my-attempts', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const attempts = await Attempt.find({ user: userId }).sort({ date: -1 }).lean();
    res.json({ attempts });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ message: 'Failed to fetch attempts' });
  }
});

// Get a single attempt by its id (for the authenticated user)
router.get('/attempts/:id', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const attemptId = req.params.id;
    const user = await User.findById(userId).select('attempts');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const attempt = (user.attempts || []).id(attemptId);
    if (!attempt) return res.status(404).json({ message: 'Attempt not found' });

    res.json({ attempt });
  } catch (error) {
    console.error('Error fetching attempt by id:', error);
    res.status(500).json({ message: 'Failed to fetch attempt' });
  }
});

module.exports = router;
