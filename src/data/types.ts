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
  type: 'code' | 'trace' | 'fill' | 'mcq' | 'tf'
  codeBlock?: string
  fillItems?: { label: string; answer: string }[]
  mcqOptions?: { letter: string; text: string; isCorrect: boolean }[]
  answer: string
  answerCode?: string
  hint?: string
}
