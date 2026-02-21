export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer (0-3)
  difficulty: 'easy' | 'medium' | 'hard';
}

export const questions: Question[] = [
  // سهل
  {
    id: 1,
    question: 'كم عدد ألوان علم السعودية؟',
    options: ['لون واحد', 'لونان', 'ثلاثة ألوان', 'أربعة ألوان'],
    correctAnswer: 1,
    difficulty: 'easy',
  },
  {
    id: 2,
    question: 'ما هو أكبر كوكب في المجموعة الشمسية؟',
    options: ['زحل', 'المريخ', 'المشتري', 'نبتون'],
    correctAnswer: 2,
    difficulty: 'easy',
  },
  {
    id: 3,
    question: 'كم عدد قارات العالم؟',
    options: ['خمس قارات', 'ست قارات', 'سبع قارات', 'ثمان قارات'],
    correctAnswer: 2,
    difficulty: 'easy',
  },
  {
    id: 4,
    question: 'ما هو الحيوان الأسرع في العالم؟',
    options: ['الحصان', 'الفهد', 'النعامة', 'الحمار الوحشي'],
    correctAnswer: 1,
    difficulty: 'easy',
  },
  {
    id: 5,
    question: 'كم عدد أيام السنة الميلادية؟',
    options: ['360 يوم', '365 يوم', '370 يوم', '375 يوم'],
    correctAnswer: 1,
    difficulty: 'easy',
  },
  // متوسط
  {
    id: 6,
    question: 'من هو مؤسس شركة أبل؟',
    options: ['بيل جيتس', 'ستيف جوبز', 'لاري بيج', 'مارك زوكربرج'],
    correctAnswer: 1,
    difficulty: 'medium',
  },
  {
    id: 7,
    question: 'ما هو أعمق محيط في العالم؟',
    options: ['المحيط الأطلسي', 'المحيط الهادئ', 'المحيط الهندي', 'المحيط المتجمد'],
    correctAnswer: 1,
    difficulty: 'medium',
  },
  {
    id: 8,
    question: 'كم عدد عظام جسم الإنسان البالغ؟',
    options: ['186 عظمة', '206 عظمة', '226 عظمة', '246 عظمة'],
    correctAnswer: 1,
    difficulty: 'medium',
  },
  {
    id: 9,
    question: 'ما هي أصغر دولة في العالم من حيث المساحة؟',
    options: ['موناكو', 'الفاتيكان', 'سان مارينو', 'لختنشتاين'],
    correctAnswer: 1,
    difficulty: 'medium',
  },
  {
    id: 10,
    question: 'في أي سنة اكتشف الإنسان الأمريكتين؟',
    options: ['1480', '1490', '1492', '1495'],
    correctAnswer: 2,
    difficulty: 'medium',
  },
  // صعب
  {
    id: 11,
    question: 'كم عدد ذرات الهيدروجين في جزيء الجلوكوز؟',
    options: ['8 ذرات', '10 ذرات', '12 ذرة', '14 ذرة'],
    correctAnswer: 2,
    difficulty: 'hard',
  },
  {
    id: 12,
    question: 'ما هو الرقم الذي يأتي بعد مليار مليار في النظام الأمريكي؟',
    options: ['تريليون', 'كوادريليون', 'كينتيليون', 'سكستيليون'],
    correctAnswer: 1,
    difficulty: 'hard',
  },
  {
    id: 13,
    question: 'كم عدد دول الاتحاد الأوروبي؟',
    options: ['25 دولة', '27 دولة', '28 دولة', '30 دولة'],
    correctAnswer: 1,
    difficulty: 'hard',
  },
  {
    id: 14,
    question: 'ما هي أعلى قمة جبلية في أفريقيا؟',
    options: ['جبل كينيا', 'جبل كيليمانجارو', 'جبل أطلس', 'جبل الروندي'],
    correctAnswer: 1,
    difficulty: 'hard',
  },
  {
    id: 15,
    question: 'في أي سنة تأسست منظمة الأمم المتحدة؟',
    options: ['1943', '1944', '1945', '1946'],
    correctAnswer: 2,
    difficulty: 'hard',
  },
];

export function getRandomQuestions(count: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
