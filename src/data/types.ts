export interface Section {
  id: number
  title: string
  marks: string
  icon: string
  questions: Question[]
}

export interface Question {
  id: number
  text: string
  marks: string
  type: 'code' | 'trace' | 'fill' | 'mcq' | 'tf' | 'arrange' | 'definition' | 'translation'
  codeBlock?: string
  fillItems?: { label: string; answer: string }[]
  mcqOptions?: { letter: string; text: string; isCorrect: boolean }[]
  // For arrange type: words to rearrange and the correct sentence
  arrangeWords?: string[]
  // For translation type: direction indicator
  translationDir?: 'en-to-ar' | 'ar-to-en'
  answer: string
  answerCode?: string
  hint?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  bloomTaxonomy?: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create'
}
