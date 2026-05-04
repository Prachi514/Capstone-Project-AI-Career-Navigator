import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [form, setForm] = useState({
    currentClass: '',
    stream: '',
    marks: {},
    interests: [],
  })

  const classOptions = ['10th', '12th']
  const streamOptions = ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts']
  
  // Interest options based on class
  const getInterestOptions = () => {
    if (form.currentClass === '10th') {
      return [
        { id: 'med', label: 'Medical (Biology)' },
        { id: 'non-med', label: 'Non-Medical (Engineering)' },
        { id: 'commerce', label: 'Commerce / Business' },
        { id: 'arts', label: 'Arts / Humanities' },
      ]
    } else if (form.currentClass === '12th') {
      return [
        { id: 'medical', label: 'Medical (NEET)' },
        { id: 'engineering', label: 'Engineering (JEE)' },
        { id: 'law', label: 'Law (CLAT)' },
        { id: 'commerce', label: 'Commerce / CA / CS' },
        { id: 'arts', label: 'Arts / Humanities' },
        { id: 'psychology', label: 'Psychology / Counseling' },
        { id: 'hotel', label: 'Hotel Management' },
        { id: 'design', label: 'Design / Architecture' },
      ]
    }
    return []
  }
  
  const interestOptions = getInterestOptions()

  // Detailed information about each interest for 10th class students
  const getInterestDetails = (interestId) => {
    const details = {
      'med': {
        title: 'Medical Stream (Biology)',
        description: 'The Medical stream focuses on Biology, preparing you for careers in healthcare, medicine, and life sciences.',
        subjects: {
          core: ['Physics', 'Chemistry', 'Biology'],
          optional: ['Mathematics', 'Computer Science', 'Physical Education'],
          languages: ['English', 'Hindi/Regional Language']
        },
        whatToExpect: [
          'Deep study of human body, plants, animals, and microorganisms',
          'Understanding of chemical processes in living organisms',
          'Physics concepts applied to biological systems',
          'Practical laboratory work with specimens and experiments',
          'Focus on diagrams, labeling, and detailed theory'
        ],
        careerPaths: [
          { name: 'Doctor (MBBS)', description: 'Become a medical practitioner after clearing NEET' },
          { name: 'Dentist (BDS)', description: 'Specialize in dental care and oral health' },
          { name: 'Veterinary Doctor', description: 'Treat and care for animals' },
          { name: 'Pharmacist', description: 'Dispense medicines and provide pharmaceutical care' },
          { name: 'Nurse', description: 'Provide patient care and support' },
          { name: 'Biotechnologist', description: 'Work with biological systems for research and development' },
          { name: 'Microbiologist', description: 'Study microorganisms and their effects' },
          { name: 'Biochemist', description: 'Research chemical processes in living organisms' }
        ],
        competitiveExams: ['NEET-UG (for MBBS/BDS)', 'AIIMS Entrance', 'JIPMER', 'State Medical Entrance Exams'],
        preparationTips: [
          'Focus on Biology - it has highest weightage in medical exams',
          'Master NCERT textbooks thoroughly - they are the foundation',
          'Practice diagrams and labeling regularly',
          'Build strong foundation in Chemistry, especially Organic Chemistry',
          'Start preparing for NEET from Class 11 itself',
          'Take regular mock tests to assess preparation'
        ],
        bestFor: 'Students who are interested in healthcare, helping people, have good memory, and enjoy studying life sciences.'
      },
      'non-med': {
        title: 'Non-Medical Stream (Engineering)',
        description: 'The Non-Medical stream focuses on Mathematics and Physics, preparing you for engineering and technology careers.',
        subjects: {
          core: ['Physics', 'Chemistry', 'Mathematics'],
          optional: ['Computer Science', 'Physical Education', 'Engineering Drawing'],
          languages: ['English', 'Hindi/Regional Language']
        },
        whatToExpect: [
          'Advanced Mathematics including Calculus, Algebra, and Trigonometry',
          'Physics concepts like Mechanics, Electricity, Magnetism, and Optics',
          'Chemistry with focus on Physical and Inorganic Chemistry',
          'Problem-solving and analytical thinking',
          'Application of mathematical concepts to real-world problems'
        ],
        careerPaths: [
          { name: 'Software Engineer', description: 'Develop software applications and systems' },
          { name: 'Mechanical Engineer', description: 'Design and develop mechanical systems' },
          { name: 'Civil Engineer', description: 'Plan and construct infrastructure projects' },
          { name: 'Electrical Engineer', description: 'Work with electrical systems and power' },
          { name: 'Electronics Engineer', description: 'Design electronic circuits and devices' },
          { name: 'Aerospace Engineer', description: 'Design aircraft and spacecraft' },
          { name: 'Data Scientist', description: 'Analyze data using mathematics and programming' },
          { name: 'Architect', description: 'Design buildings and structures' }
        ],
        competitiveExams: ['JEE Main', 'JEE Advanced (for IITs)', 'BITSAT', 'State Engineering Entrance Exams (MHT-CET, WBJEE, etc.)'],
        preparationTips: [
          'Mathematics is crucial - practice daily',
          'Focus on problem-solving skills, not just theory',
          'Build strong foundation in Physics concepts',
          'Start JEE preparation early (from Class 11)',
          'Solve previous year papers regularly',
          'Take coaching or online courses for competitive exams',
          'Practice time management for exams'
        ],
        bestFor: 'Students who love mathematics, enjoy problem-solving, are good at logical reasoning, and want to build/create things.'
      },
      'commerce': {
        title: 'Commerce Stream',
        description: 'The Commerce stream focuses on business, finance, and economics, preparing you for careers in business and finance.',
        subjects: {
          core: ['Accountancy', 'Business Studies', 'Economics'],
          optional: ['Mathematics', 'Computer Science', 'Physical Education'],
          languages: ['English', 'Hindi/Regional Language']
        },
        whatToExpect: [
          'Learning about financial accounting and bookkeeping',
          'Understanding business operations and management',
          'Study of micro and macro economics',
          'Practical knowledge of business transactions',
          'Analysis of market trends and economic policies'
        ],
        careerPaths: [
          { name: 'Chartered Accountant (CA)', description: 'Financial expert with high earning potential' },
          { name: 'Company Secretary (CS)', description: 'Handle corporate legal and compliance matters' },
          { name: 'Business Analyst', description: 'Analyze business processes and improve efficiency' },
          { name: 'Investment Banker', description: 'Work in finance and investment sectors' },
          { name: 'Entrepreneur', description: 'Start and run your own business' },
          { name: 'Financial Advisor', description: 'Provide financial planning and advice' },
          { name: 'Bank Manager', description: 'Manage banking operations' },
          { name: 'Marketing Manager', description: 'Promote products and services' }
        ],
        competitiveExams: ['CUET (for universities)', 'CA Foundation', 'IPMAT (for IIMs)', 'NPAT (for NMIMS)'],
        preparationTips: [
          'Master Accountancy fundamentals - practice journal entries regularly',
          'Understand Business Studies concepts with real-world examples',
          'Focus on Economics - both micro and macro',
          'Maintain good percentage (90%+) for better opportunities',
          'Start CA/CS preparation if interested in professional courses',
          'Develop numerical and analytical skills'
        ],
        bestFor: 'Students who are interested in business, finance, have good numerical skills, and want to work in corporate world.'
      },
      'arts': {
        title: 'Arts / Humanities Stream',
        description: 'The Arts stream offers diverse subjects in humanities, social sciences, and languages, preparing you for varied career paths.',
        subjects: {
          core: ['History', 'Political Science', 'Geography', 'Economics'],
          optional: ['Psychology', 'Sociology', 'Philosophy', 'Literature', 'Fine Arts'],
          languages: ['English', 'Hindi/Regional Language', 'Additional Language']
        },
        whatToExpect: [
          'Study of human history, cultures, and civilizations',
          'Understanding of political systems and governance',
          'Geographical knowledge of world and India',
          'Analysis of social structures and human behavior',
          'Development of critical thinking and communication skills'
        ],
        careerPaths: [
          { name: 'Lawyer', description: 'Practice law and represent clients' },
          { name: 'IAS/IPS Officer', description: 'Serve in civil services' },
          { name: 'Journalist', description: 'Report news and write articles' },
          { name: 'Teacher/Professor', description: 'Educate students' },
          { name: 'Psychologist', description: 'Study human mind and behavior' },
          { name: 'Social Worker', description: 'Help communities and individuals' },
          { name: 'Writer/Author', description: 'Write books, articles, and content' },
          { name: 'Public Relations Officer', description: 'Manage public image and communications' }
        ],
        competitiveExams: ['CLAT (for Law)', 'UPSC Civil Services', 'CUET (for universities)', 'University-specific entrance exams'],
        preparationTips: [
          'Read newspapers daily for current affairs',
          'Develop strong reading and writing skills',
          'Focus on History and Political Science for competitive exams',
          'Practice essay writing regularly',
          'Build vocabulary and communication skills',
          'Stay updated with national and international news',
          'Develop analytical and critical thinking'
        ],
        bestFor: 'Students who enjoy reading, writing, have good communication skills, are interested in social issues, and want diverse career options.'
      }
    }
    return details[interestId] || null
  }

  function updateMarks(field, value) {
    setForm(prev => ({ ...prev, marks: { ...prev.marks, [field]: value } }))
  }

  function toggleInterest(id) {
    setForm(prev => {
      const exists = prev.interests.includes(id)
      const next = exists ? prev.interests.filter(i => i !== id) : [...prev.interests, id]
      return { ...prev, interests: next }
    })
  }

  async function submitForSuggestions() {
    // Validate all required marks are filled
    if (form.currentClass === '10th') {
      // For 10th class, all marks are required
      if (!form.marks.maths || !form.marks.science || !form.marks.ss) {
        return alert('Please enter all marks (Mathematics, Science, and Social Science)')
      }
    } else {
      // For 12th class, at least one mark is required
      const marksValues = Object.values(form.marks).filter(v => v !== '' && v !== null)
      if (marksValues.length === 0) {
        return alert('Please enter at least one mark')
      }
    }
    if (form.interests.length === 0) {
      return alert('Please select at least one interest')
    }
    
    setLoading(true)
    setResults(null)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/assessment/get-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          currentClass: form.currentClass,
          stream: form.stream,
          marks: form.marks,
          interests: form.interests,
        })
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || `Server error: ${res.status}`)
      }
      const data = await res.json()
      setResults(data.suggestions || data)
      setStep(4)
    } catch (err) {
      console.error('Error:', err)
      alert(`Unable to fetch suggestions: ${err.message}. Make sure you are logged in.`)
    } finally {
      setLoading(false)
    }
  }

  function renderClassStep() {
    return (
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-2">Quick Career Finder</h2>
        <p className="text-gray-600 mb-6">Tell us which class you're in so we can tailor suggestions.</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {classOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setForm(prev => ({ ...prev, currentClass: opt }))}
              className={`p-4 rounded-lg border ${form.currentClass === opt ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}
            >
              <div className="font-medium">{opt}</div>
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 rounded-lg border"
          >
            Profile
          </button>
          <button
            onClick={() => {
              if (!form.currentClass) return alert('Please select a class first')
              setStep(2)
            }}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  function renderIntroHero() {
    return (
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-xl p-10 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-2">AI Career Guidance — Personalized for You</h1>
            <p className="opacity-90 mb-4">Get tailored career paths, exam roadmaps and study strategies generated by our AI assistant. No clutter — start with a quick, friendly assessment.</p>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold shadow">Get Personalized Guidance</button>
              
            </div>
          </div>
          <div className="w-48 h-48 bg-white/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">🤖</div>
              <div className="text-sm mt-2">Manzil AI</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderMarksStep() {
    const cls = form.currentClass
    return (
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-2">Enter Marks</h2>
        <p className="text-gray-600 mb-4">Provide your recent marks to personalize advice.</p>

        {cls === '10th' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <label className="block">
              <div className="text-sm text-gray-700">Mathematics (out of 100) <span className="text-red-500">*</span></div>
              <input 
                type="number" 
                min="0" 
                max="100" 
                required
                value={form.marks.maths || ''} 
                onChange={e => updateMarks('maths', e.target.value)} 
                className="mt-1 w-full p-2 border rounded" 
              />
            </label>
            <label className="block">
              <div className="text-sm text-gray-700">Science (out of 100) <span className="text-red-500">*</span></div>
              <input 
                type="number" 
                min="0" 
                max="100" 
                required
                value={form.marks.science || ''} 
                onChange={e => updateMarks('science', e.target.value)} 
                className="mt-1 w-full p-2 border rounded" 
              />
            </label>
            <label className="block">
              <div className="text-sm text-gray-700">Social Science (out of 100) <span className="text-red-500">*</span></div>
              <input 
                type="number" 
                min="0" 
                max="100" 
                required
                value={form.marks.ss || ''} 
                onChange={e => updateMarks('ss', e.target.value)} 
                className="mt-1 w-full p-2 border rounded" 
              />
            </label>
          </div>
        )}

        {cls === '12th' && (
          <div>
            <div className="mb-4">
              <div className="text-sm text-gray-700 mb-2">Select your stream</div>
              <div className="grid grid-cols-2 gap-3">
                {streamOptions.map(s => (
                  <button key={s} onClick={() => setForm(prev => ({ ...prev, stream: s }))} className={`p-3 rounded-lg border ${form.stream === s ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {form.stream && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {form.stream.includes('PCM') && (
                  <>
                    <label>
                      <div className="text-sm text-gray-700">Physics (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.physics || ''} onChange={e => updateMarks('physics', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                    <label>
                      <div className="text-sm text-gray-700">Chemistry (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.chemistry || ''} onChange={e => updateMarks('chemistry', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                    <label>
                      <div className="text-sm text-gray-700">Mathematics (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.maths || ''} onChange={e => updateMarks('maths', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                  </>
                )}

                {form.stream.includes('PCB') && (
                  <>
                    <label>
                      <div className="text-sm text-gray-700">Physics (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.physics || ''} onChange={e => updateMarks('physics', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                    <label>
                      <div className="text-sm text-gray-700">Chemistry (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.chemistry || ''} onChange={e => updateMarks('chemistry', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                    <label>
                      <div className="text-sm text-gray-700">Biology (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.biology || ''} onChange={e => updateMarks('biology', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                  </>
                )}

                {form.stream === 'Commerce' && (
                  <>
                    <label>
                      <div className="text-sm text-gray-700">Accountancy (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.accountancy || ''} onChange={e => updateMarks('accountancy', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                    <label>
                      <div className="text-sm text-gray-700">Business Studies (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.business || ''} onChange={e => updateMarks('business', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                    <label>
                      <div className="text-sm text-gray-700">Economics (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.economics || ''} onChange={e => updateMarks('economics', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                  </>
                )}

                {form.stream === 'Arts' && (
                  <>
                    <label>
                      <div className="text-sm text-gray-700">History (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.history || ''} onChange={e => updateMarks('history', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                    <label>
                      <div className="text-sm text-gray-700">Political Science (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.politics || ''} onChange={e => updateMarks('politics', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                    <label>
                      <div className="text-sm text-gray-700">Geography (out of 100)</div>
                      <input type="number" min="0" max="100" value={form.marks.geography || ''} onChange={e => updateMarks('geography', e.target.value)} className="mt-1 w-full p-2 border rounded" />
                    </label>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg border">Back</button>
          <button 
            onClick={() => setStep(3)} 
            disabled={cls === '10th' && (!form.marks.maths || !form.marks.science || !form.marks.ss)}
            className={`px-4 py-2 rounded-lg ${cls === '10th' && (!form.marks.maths || !form.marks.science || !form.marks.ss) ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white`}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  function renderInterestStep() {
    return (
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-2">Your Interests</h2>
        <p className="text-gray-600 mb-4">Select the area(s) you are interested in ({form.currentClass} class).</p>

        <div className={`grid gap-3 mb-6 ${interestOptions.length > 4 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
          {interestOptions.map(opt => (
            <button 
              key={opt.id} 
              onClick={() => toggleInterest(opt.id)} 
              className={`p-3 rounded-lg border text-left transition ${form.interests.includes(opt.id) ? 'border-indigo-600 bg-indigo-50 shadow-md' : 'border-gray-200 bg-white hover:border-indigo-300'}`}
            >
              <div className="font-medium text-sm">{opt.label}</div>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={() => setStep(2)} className="px-4 py-2 rounded-lg border">Back</button>
          <button onClick={() => submitForSuggestions()} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">{loading ? 'Analyzing...' : 'Get Suggestions'}</button>
        </div>
      </div>
    )
  }

  function renderResults() {
    if (!results) return null
    return (
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Personalized Suggestions</h2>
            <p className="text-gray-600">AI-generated roadmap based on your class, stream, marks and interests.</p>
          </div>
          <div>
            <button onClick={() => { setStep(1); setForm({ currentClass: '', stream: '', marks: {}, interests: [] }); setResults(null); }} className="px-4 py-2 rounded-lg border">Restart</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg bg-indigo-50">
            <div className="text-sm text-gray-700">Class</div>
            <div className="font-medium">{form.currentClass} {form.stream ? `• ${form.stream}` : ''}</div>
          </div>
          <div className="p-4 border rounded-lg bg-indigo-50">
            <div className="text-sm text-gray-700">Interests</div>
            <div className="font-medium">{form.interests.join(', ') || '—'}</div>
          </div>
        </div>

        {/* Detailed Stream Information for 10th Class */}
        {form.currentClass === '10th' && form.interests.length > 0 && (() => {
          const selectedInterestsDetails = form.interests.map(id => getInterestDetails(id)).filter(d => d !== null)
          return selectedInterestsDetails.length > 0 ? (
            <div className="mb-6 space-y-4">
              <h3 className="text-2xl font-bold text-indigo-700 mb-4">📖 About Your Selected Stream(s)</h3>
              {selectedInterestsDetails.map((details, idx) => (
                <div key={idx} className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl">
                  <h4 className="text-xl font-bold text-indigo-700 mb-3">{details.title}</h4>
                  <p className="text-gray-700 mb-4">{details.description}</p>

                  {/* Subjects */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">📚 Subjects You'll Study:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <div className="font-medium text-indigo-700 mb-1">Core Subjects:</div>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {details.subjects.core.map((subj, i) => (
                            <li key={i}>{subj}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium text-indigo-700 mb-1">Optional Subjects:</div>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {details.subjects.optional.map((subj, i) => (
                            <li key={i}>{subj}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium text-indigo-700 mb-1">Languages:</div>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                          {details.subjects.languages.map((lang, i) => (
                            <li key={i}>{lang}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* What to Expect */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">🎯 What to Expect in 11th & 12th:</h5>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      {details.whatToExpect.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Career Paths */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">💼 Career Opportunities:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {details.careerPaths.map((career, i) => (
                        <div key={i} className="p-2 bg-white rounded border border-indigo-100">
                          <div className="font-medium text-indigo-700">{career.name}</div>
                          <div className="text-gray-600 text-xs">{career.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competitive Exams */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">📝 Competitive Exams:</h5>
                    <div className="flex flex-wrap gap-2">
                      {details.competitiveExams.map((exam, i) => (
                        <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preparation Tips */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-800 mb-2">💡 Preparation Tips:</h5>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                      {details.preparationTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Best For */}
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="font-semibold text-yellow-800 mb-1">✨ Best For:</div>
                    <div className="text-yellow-700 text-sm">{details.bestFor}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : null
        })()}

        {/* Suggested Careers */}
        {results.suggestedCareers && results.suggestedCareers.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Suggested Careers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.suggestedCareers.map((c, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="font-semibold text-lg">{c.name || c.title || c}</div>
                  <p className="text-gray-700 mt-2">{c.description || c.excerpt || c}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Colleges - Hide for 10th class */}
        {form.currentClass !== '10th' && results.colleges && results.colleges.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">🎓 Recommended Colleges Based on Your Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.colleges.map((col, i) => (
                <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-white to-indigo-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900">{col.name || col.university || col}</div>
                      <div className="text-sm text-indigo-600 mt-1">{col.city || ''}</div>
                    </div>
                    {col.link && col.link !== '#' && (
                      <a href={col.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        Visit →
                      </a>
                    )}
                  </div>
                  <div className="text-sm text-gray-700 font-medium mb-2">{col.course || col.program || ''}</div>
                  {col.cutoff && (
                    <div className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Cutoff:</span> {col.cutoff}
                    </div>
                  )}
                  {col.exam && (
                    <div className="text-xs text-gray-600 mb-1">
                      <span className="font-medium">Exam:</span> {col.exam}
                    </div>
                  )}
                  {col.fees && (
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Fees:</span> {col.fees}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preparation Steps */}
        {results.preparationSteps && results.preparationSteps.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Preparation Roadmap</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              {results.preparationSteps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        )}

        {/* Key Skills */}
        {results.keySkills && results.keySkills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Key Skills to Build</h3>
            <div className="flex flex-wrap gap-2">
              {results.keySkills.map((k, i) => <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">{k}</span>)}
            </div>
          </div>
        )}

        {/* Competitive Exam Roadmap */}
        {results.competitiveExamRoadmap && (
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4 text-indigo-700">📋 Competitive Exam Roadmap</h3>
            
            {/* Entrance Exams */}
            {results.competitiveExamRoadmap.exams && results.competitiveExamRoadmap.exams.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">🎯 Key Entrance Exams</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {results.competitiveExamRoadmap.exams.map((e, i) => (
                    <div key={i} className="p-3 border rounded-lg bg-indigo-50 border-indigo-200">
                      <div className="font-medium text-gray-900">{e}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exam Details */}
            {results.competitiveExamRoadmap.examDetails && results.competitiveExamRoadmap.examDetails.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">📝 Detailed Exam Information</h4>
                <div className="space-y-4">
                  {results.competitiveExamRoadmap.examDetails.map((exam, i) => (
                    <div key={i} className="p-4 border rounded-lg bg-white border-gray-200">
                      <div className="font-bold text-lg text-indigo-700 mb-2">{exam.name}</div>
                      <div className="text-sm text-gray-700 mb-2">{exam.description}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Eligibility:</span> {exam.eligibility}</div>
                        <div><span className="font-medium">Exam Date:</span> {exam.examDate}</div>
                        <div><span className="font-medium">Syllabus:</span> {exam.syllabus}</div>
                        <div><span className="font-medium">Preparation Time:</span> {exam.preparationTime}</div>
                      </div>
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                        <span className="font-medium text-yellow-800">💡 Tip:</span> <span className="text-yellow-700">{exam.tips}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {results.competitiveExamRoadmap.timeline && results.competitiveExamRoadmap.timeline.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">📅 Preparation Timeline</h4>
                <div className="space-y-4">
                  {results.competitiveExamRoadmap.timeline.map((phase, i) => (
                    <div key={i} className="border-l-4 border-indigo-500 pl-4 py-2">
                      <div className="font-bold text-indigo-700">{phase.phase}</div>
                      <div className="text-sm text-gray-600 mb-2">{phase.months}</div>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        {phase.tasks.map((task, j) => (
                          <li key={j}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Roadmap Steps */}
            {results.competitiveExamRoadmap.roadmap && results.competitiveExamRoadmap.roadmap.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">🗺️ Detailed Preparation Strategy</h4>
                <div className="space-y-2">
                  {results.competitiveExamRoadmap.roadmap.map((step, i) => (
                    <div key={i} className="p-3 border rounded-lg bg-gray-50 text-sm text-gray-700">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Entrance Exams (Fallback if roadmap not available) */}
        {results.entranceExams && results.entranceExams.length > 0 && !results.competitiveExamRoadmap && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Entrance Exams to Consider</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.entranceExams.map((e, i) => <div key={i} className="p-3 border rounded">{e}</div>)}
            </div>
          </div>
        )}

        {/* Study Strategy */}
        {results.studyStrategy && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Study Strategy</h3>
            <div className="p-4 border rounded bg-gray-50 text-gray-700 whitespace-pre-wrap">{results.studyStrategy}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {!results && (
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold">Manzil — Career Compass</h1>
            <p className="text-gray-600 mt-2">AI-powered guidance to discover career paths and exam roadmaps.</p>
          </div>
        )}

        {step === 0 && !results && renderIntroHero()}
        {step === 1 && !results && renderClassStep()}
        {step === 2 && !results && renderMarksStep()}
        {step === 3 && !results && renderInterestStep()}
        {step === 4 && results && renderResults()}

        {/* Progress footer when filling form */}
        {!results && step > 0 && (
          <div className="max-w-3xl mx-auto mt-6 text-sm text-gray-500">
            Step {step} of 3 — {step === 1 ? 'Class selection' : step === 2 ? 'Marks' : 'Interests & analyze'}
          </div>
        )}
      </div>
    </div>
  )
}
