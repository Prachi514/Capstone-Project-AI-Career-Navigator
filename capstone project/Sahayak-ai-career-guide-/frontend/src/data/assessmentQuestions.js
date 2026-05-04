// Question bank for different classes
export const questionBanks = {
  '10th': {
    questions: [
      // Aptitude Questions - 10th class
      {
        id: 1,
        type: 'aptitude',
        question: 'If the cost price of 12 articles is equal to the selling price of 10 articles, find the profit percentage.',
        options: ['16.67%', '20%', '25%', '33.33%'],
        correctAnswer: 0,
        explanation: 'CP of 12 = SP of 10. Let CP = x, then CP of 12 articles = 12x and SP of 10 articles = 12x. So SP of 1 = 1.2x. Profit = 1.2x - x = 0.2x. Profit% = (0.2x/x) × 100 = 20%'
      },
      {
        id: 2,
        type: 'aptitude',
        question: 'A train travels 360 km in 6 hours. What is the speed of the train?',
        options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
        correctAnswer: 1,
        explanation: 'Speed = Distance / Time = 360 / 6 = 60 km/h'
      },
      {
        id: 3,
        type: 'aptitude',
        question: 'What is 35% of 200?',
        options: ['60', '70', '80', '90'],
        correctAnswer: 1,
        explanation: '35% of 200 = (35/100) × 200 = 70'
      },
      {
        id: 4,
        type: 'aptitude',
        question: 'If 2x + 3 = 11, what is the value of x?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 2,
        explanation: '2x + 3 = 11. 2x = 8. x = 4'
      },
      {
        id: 5,
        type: 'aptitude',
        question: 'The circumference of a circle is 44 cm. What is its radius? (Take π = 22/7)',
        options: ['5 cm', '7 cm', '9 cm', '11 cm'],
        correctAnswer: 1,
        explanation: 'Circumference = 2πr. 44 = 2 × (22/7) × r. r = (44 × 7) / (2 × 22) = 7 cm'
      },
      {
        id: 6,
        type: 'aptitude',
        question: 'If a = 5 and b = 3, what is a² + b²?',
        options: ['32', '34', '36', '38'],
        correctAnswer: 1,
        explanation: 'a² + b² = 5² + 3² = 25 + 9 = 34'
      },
      {
        id: 7,
        type: 'aptitude',
        question: 'A bag contains 4 red, 3 blue, and 2 green balls. What is the probability of drawing a red ball?',
        options: ['1/3', '2/5', '4/9', '1/2'],
        correctAnswer: 2,
        explanation: 'Total balls = 4 + 3 + 2 = 9. Red balls = 4. Probability = 4/9'
      },
      {
        id: 8,
        type: 'aptitude',
        question: 'If 3 men can do a job in 8 days, how many days will 6 men take?',
        options: ['2 days', '4 days', '6 days', '16 days'],
        correctAnswer: 1,
        explanation: 'Work = 3 × 8 = 24 man-days. With 6 men: Days = 24 / 6 = 4 days'
      },
      {
        id: 9,
        type: 'aptitude',
        question: 'What is 40% of 250?',
        options: ['80', '90', '100', '110'],
        correctAnswer: 2,
        explanation: '40% of 250 = (40/100) × 250 = 100'
      },
      {
        id: 10,
        type: 'aptitude',
        question: 'The average of 5 numbers is 20. What is their sum?',
        options: ['80', '90', '100', '110'],
        correctAnswer: 2,
        explanation: 'Average = Sum / Count. 20 = Sum / 5. Sum = 100'
      },
      // English Questions - 10th class
      {
        id: 11,
        type: 'english',
        question: 'Choose the correct past tense form: "She ___ to the market yesterday."',
        options: ['goes', 'went', 'going', 'go'],
        correctAnswer: 1,
        explanation: 'The correct past tense of "go" is "went". The sentence refers to an action in the past.'
      },
      {
        id: 12,
        type: 'english',
        question: 'Select the synonym of "diligent":',
        options: ['lazy', 'hardworking', 'careless', 'weak'],
        correctAnswer: 1,
        explanation: '"Diligent" means hardworking and careful in one\'s work.'
      },
      {
        id: 13,
        type: 'english',
        question: 'Which sentence is grammatically correct?',
        options: ['She have a big house', 'She has a big house', 'She are having a big house', 'She had been have a house'],
        correctAnswer: 1,
        explanation: 'The correct form is "has" with the singular subject "she".'
      },
      {
        id: 14,
        type: 'english',
        question: 'What is the antonym of "bright"?',
        options: ['intelligent', 'dark', 'light', 'clear'],
        correctAnswer: 1,
        explanation: 'The antonym of "bright" is "dark".'
      },
      {
        id: 15,
        type: 'english',
        question: 'Choose the correct spelling:',
        options: ['occassion', 'occassion', 'occasion', 'ocassion'],
        correctAnswer: 2,
        explanation: 'The correct spelling is "occasion".'
      },
      {
        id: 16,
        type: 'english',
        question: 'Which word is a noun?',
        options: ['run', 'beautiful', 'book', 'quickly'],
        correctAnswer: 2,
        explanation: '"Book" is a noun. The others are verb, adjective, and adverb respectively.'
      },
      {
        id: 17,
        type: 'english',
        question: 'Select the correct form: "If I were you, I ___ accept the offer."',
        options: ['would', 'will', 'am', 'was'],
        correctAnswer: 0,
        explanation: 'In conditional sentences with "if I were", we use "would".'
      },
      {
        id: 18,
        type: 'english',
        question: 'What does "ambitious" mean?',
        options: ['friendly', 'having strong desire to succeed', 'intelligent', 'brave'],
        correctAnswer: 1,
        explanation: '"Ambitious" means having a strong desire to succeed and achieve your goals.'
      },
      {
        id: 19,
        type: 'english',
        question: 'Choose the correct article: "He is ___ doctor."',
        options: ['a', 'an', 'the', 'no article'],
        correctAnswer: 0,
        explanation: '"A" is used before consonant sounds. "Doctor" starts with a consonant sound.'
      },
      {
        id: 20,
        type: 'english',
        question: 'Which sentence has correct punctuation?',
        options: ['she asked where are you going', 'She asked, "Where are you going?"', 'She asked where are you going?', 'she asked. where are you going'],
        correctAnswer: 1,
        explanation: 'The correct punctuation includes the comma before the quote and proper quotation marks.'
      }
    ]
  },
  '12th': {
    questions: [
      // Aptitude Questions - 12th class (more advanced)
      {
        id: 1,
        type: 'aptitude',
        question: 'If the ratio of two numbers is 3:5 and their difference is 20, find the larger number.',
        options: ['40', '50', '60', '70'],
        correctAnswer: 2,
        explanation: 'Let numbers be 3x and 5x. Difference = 5x - 3x = 2x = 20. So x = 10. Larger number = 5 × 10 = 50'
      },
      {
        id: 2,
        type: 'aptitude',
        question: 'A person invests ₹1000 at 10% per annum for 2 years. What is the compound interest?',
        options: ['₹200', '₹210', '₹220', '₹230'],
        correctAnswer: 2,
        explanation: 'CI = P(1 + r/100)^n - P = 1000(1.1)² - 1000 = 1210 - 1000 = ₹210'
      },
      {
        id: 3,
        type: 'aptitude',
        question: 'What is the LCM of 12, 18, and 24?',
        options: ['48', '60', '72', '96'],
        correctAnswer: 2,
        explanation: '12 = 2² × 3, 18 = 2 × 3², 24 = 2³ × 3. LCM = 2³ × 3² = 72'
      },
      {
        id: 4,
        type: 'aptitude',
        question: 'If 2 (x + 3) = 14, what is the value of x?',
        options: ['2', '4', '5', '7'],
        correctAnswer: 2,
        explanation: '2(x + 3) = 14. x + 3 = 7. x = 4'
      },
      {
        id: 5,
        type: 'aptitude',
        question: 'In a class of 50 students, 30% passed in Math and 40% passed in English. How many passed in at least one subject?',
        options: ['25', '35', '40', '42'],
        correctAnswer: 3,
        explanation: 'Without overlap information, if independent: 30% + 40% = 70% theoretical. But with assumptions, typically 35 students.'
      },
      {
        id: 6,
        type: 'aptitude',
        question: 'If a:b = 2:3 and b:c = 3:4, what is a:c?',
        options: ['1:2', '2:3', '2:4', '3:4'],
        correctAnswer: 0,
        explanation: 'a/b = 2/3 and b/c = 3/4. So a/c = (a/b) × (b/c) = (2/3) × (3/4) = 2/4 = 1/2. So a:c = 1:2'
      },
      {
        id: 7,
        type: 'aptitude',
        question: 'A shopkeeper gives 10% discount on marked price. If the selling price is ₹450, what is the marked price?',
        options: ['₹500', '₹550', '₹600', '₹650'],
        correctAnswer: 0,
        explanation: 'If MP is x, SP = 0.9x = 450. x = 450/0.9 = ₹500'
      },
      {
        id: 8,
        type: 'aptitude',
        question: 'What is the value of (2³)²?',
        options: ['16', '32', '64', '128'],
        correctAnswer: 2,
        explanation: '(2³)² = 2⁶ = 64'
      },
      {
        id: 9,
        type: 'aptitude',
        question: 'If the sum of n natural numbers is 55 and n = 10, what is the average?',
        options: ['5', '5.5', '6', '6.5'],
        correctAnswer: 1,
        explanation: 'Average = Sum / n = 55 / 10 = 5.5'
      },
      {
        id: 10,
        type: 'aptitude',
        question: 'What percentage is 45 of 150?',
        options: ['25%', '30%', '35%', '40%'],
        correctAnswer: 1,
        explanation: '(45/150) × 100 = 30%'
      },
      // English Questions - 12th class (more advanced)
      {
        id: 11,
        type: 'english',
        question: 'Choose the correct passive voice: "The manager approves the proposal."',
        options: ['The proposal is approved by the manager', 'The proposal was approved by the manager', 'The proposal is being approved by the manager', 'The proposal has been approved by the manager'],
        correctAnswer: 0,
        explanation: 'Simple present passive: "is approved"'
      },
      {
        id: 12,
        type: 'english',
        question: 'What does "pragmatic" mean?',
        options: ['theoretical', 'practical and realistic', 'pessimistic', 'optimistic'],
        correctAnswer: 1,
        explanation: '"Pragmatic" means focused on practical consequences rather than theory.'
      },
      {
        id: 13,
        type: 'english',
        question: 'Select the correct form of verb: "By next month, I ___ this project for two years."',
        options: ['will work', 'will have been working', 'am working', 'have worked'],
        correctAnswer: 1,
        explanation: 'This requires future perfect continuous tense.'
      },
      {
        id: 14,
        type: 'english',
        question: 'Which is the most appropriate word? "The professor\'s ___ presentation impressed everyone."',
        options: ['comprehensive', 'comprehendible', 'comprehensible', 'understanding'],
        correctAnswer: 0,
        explanation: '"Comprehensive" means complete and thorough, fitting the context.'
      },
      {
        id: 15,
        type: 'english',
        question: 'Identify the figure of speech: "He is a lion in the battlefield."',
        options: ['Simile', 'Metaphor', 'Personification', 'Hyperbole'],
        correctAnswer: 1,
        explanation: 'This is a metaphor as it directly compares without using "like" or "as".'
      },
      {
        id: 16,
        type: 'english',
        question: 'Choose the correct preposition: "She is responsible ___ the project."',
        options: ['to', 'for', 'in', 'with'],
        correctAnswer: 1,
        explanation: '"Responsible for" is the correct collocation.'
      },
      {
        id: 17,
        type: 'english',
        question: 'What is the meaning of "fortuitous"?',
        options: ['painful', 'happening by chance/fortunate', 'intentional', 'planned'],
        correctAnswer: 1,
        explanation: '"Fortuitous" means happening by happy chance; fortunate.'
      },
      {
        id: 18,
        type: 'english',
        question: 'Choose the correctly punctuated sentence:',
        options: ['The following are needed: pen, pencil, and paper', 'The following are needed: pen pencil and paper', 'The following are needed pen, pencil, and paper', 'The following are needed: pen, pencil paper'],
        correctAnswer: 0,
        explanation: 'Proper use of colon and comma in a list.'
      },
      {
        id: 19,
        type: 'english',
        question: 'Identify the error: "Neither the teacher nor the students was absent."',
        options: ['was should be were', 'Neither is incorrect', 'No error', 'teacher is incorrect'],
        correctAnswer: 0,
        explanation: 'With "neither...nor", the verb agrees with the nearest subject (students - plural), so "were".'
      },
      {
        id: 20,
        type: 'english',
        question: 'What is the correct form of the word? "The team ___ confident about their chances."',
        options: ['is', 'are', 'was', 'have been'],
        correctAnswer: 0,
        explanation: '"Team" is a collective noun and can be treated as singular (is) or plural (are) depending on context. Here, singular form is preferred.'
      }
    ]
  }
};
