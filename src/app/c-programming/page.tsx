'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizStartPopup from '@/components/QuizStartPopup'
import QuizTimer from '@/components/QuizTimer'
import ReviewPanel from '@/components/ReviewPanel'
import { useQuizTracking } from '@/hooks/useQuizTracking'
import { useReviewStorage } from '@/hooks/useReviewStorage'
import { formatDuration } from '@/lib/date-utils'

// ─── Types ───────────────────────────────────────────
interface Section {
  id: number
  title: string
  marks: string
  icon: string
  questions: Question[]
}

interface Question {
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

// ─── Data ────────────────────────────────────────────
const sections: Section[] = [
  {
    id: 1,
    title: 'Input/Output & Variables',
    marks: '28 pts',
    icon: '⚡',
    questions: [
      // ── MCQ Questions (6) ──
      {
        id: 1,
        text: 'Which line is required to use printf() in C?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '#include <math.h>', isCorrect: false },
          { letter: 'B', text: '#include <stdio.h>', isCorrect: true },
          { letter: 'C', text: '#include <string.h>', isCorrect: false },
          { letter: 'D', text: '#include <conio.h>', isCorrect: false },
        ],
        answer: 'printf() is part of the Standard I/O library (stdio.h)',
      },
      {
        id: 2,
        text: 'The execution of a C program starts from:',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'printf()', isCorrect: false },
          { letter: 'B', text: 'return 0;', isCorrect: false },
          { letter: 'C', text: 'main()', isCorrect: true },
          { letter: 'D', text: '#include', isCorrect: false },
        ],
        answer: 'Every C program starts execution from the main() function',
      },
      {
        id: 3,
        text: 'Which of the following is a correct variable declaration?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'int 5num;', isCorrect: false },
          { letter: 'B', text: 'float num = 3.5;', isCorrect: true },
          { letter: 'C', text: "char = 'A';", isCorrect: false },
          { letter: 'D', text: 'int my num;', isCorrect: false },
        ],
        answer: 'A starts with a digit, C has no variable name, D has a space. B is the correct declaration',
      },
      {
        id: 4,
        text: 'What is the correct format specifier for a float?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '%d', isCorrect: false },
          { letter: 'B', text: '%c', isCorrect: false },
          { letter: 'C', text: '%f', isCorrect: true },
          { letter: 'D', text: '%s', isCorrect: false },
        ],
        answer: '%f is the format specifier for floating-point numbers',
      },
      {
        id: 5,
        text: 'Which escape sequence inserts a new line?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: '\\t', isCorrect: false },
          { letter: 'B', text: '\\n', isCorrect: true },
          { letter: 'C', text: '\\\\', isCorrect: false },
          { letter: 'D', text: '\\"', isCorrect: false },
        ],
        answer: '\\n inserts a newline character',
      },
      {
        id: 6,
        text: 'Which of the following is NOT allowed in C variable names?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'totalMarks', isCorrect: false },
          { letter: 'B', text: '_value', isCorrect: false },
          { letter: 'C', text: '2number', isCorrect: true },
          { letter: 'D', text: 'my_var', isCorrect: false },
        ],
        answer: 'Variable names cannot start with a digit. 2number is invalid',
      },
      // ── True/False Questions (7) ──
      {
        id: 7,
        text: 'main() is optional in a C program.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'main() is mandatory — every C program must have a main() function as the entry point',
      },
      {
        id: 8,
        text: 'Comments are executed by the compiler.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'The compiler completely ignores comments — they are for documentation only',
      },
      {
        id: 9,
        text: 'Variable names are case-sensitive in C.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'Yes — age, Age, and AGE are three different variables in C',
      },
      {
        id: 10,
        text: '%d is used to print integer values.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'Correct — %d is the format specifier for printing integers (int)',
      },
      {
        id: 11,
        text: 'return 0; usually means the program ended successfully.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'Correct — returning 0 from main() means the program terminated without errors',
      },
      {
        id: 12,
        text: 'You can use reserved words like \'int\' as variable names.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: false },
          { letter: 'F', text: 'False', isCorrect: true },
        ],
        answer: 'Reserved words (keywords) like int, float, if cannot be used as variable names',
      },
      {
        id: 13,
        text: 'Text printed using printf() must be inside double quotes.',
        marks: '1 pt',
        type: 'tf',
        mcqOptions: [
          { letter: 'T', text: 'True', isCorrect: true },
          { letter: 'F', text: 'False', isCorrect: false },
        ],
        answer: 'Correct — text in printf must be enclosed in " " like: printf("Hello");',
      },
      // ── Correct the Code (4) ──
      {
        id: 14,
        text: 'The following code has several errors. Explain the errors and write the correct version.',
        marks: '2 pts',
        type: 'code',
        codeBlock: 'printf(Hello World)\\nreturn 0',
        answer: 'Errors: 1) Missing #include and main() 2) Text without double quotes 3) Missing semicolons 4) Missing function braces',
        answerCode: '#include <stdio.h>\nint main() {\n    printf("Hello World");\n    return 0;\n}',
      },
      {
        id: 15,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '2 pts',
        type: 'code',
        codeBlock: 'int 2num = 10;\nprintf("%d", 2num);',
        answer: 'The variable name 2num starts with a digit, which is not allowed in C. Variable names must start with a letter or underscore _',
        answerCode: 'int num2 = 10;\nprintf("%d", num2);',
      },
      {
        id: 16,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '2 pts',
        type: 'code',
        codeBlock: 'float x = 5.5;\nprintf("%d", x);',
        answer: 'The format specifier %d is for integers (int), not float. Use %f instead',
        answerCode: 'float x = 5.5;\nprintf("%f", x);',
      },
      {
        id: 17,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '2 pts',
        type: 'code',
        codeBlock: 'char grade = "A";',
        answer: 'The char type uses single quotes \' \' not double quotes " ". Double quotes are for strings',
        answerCode: "char grade = 'A';",
      },
      // ── Fill in the Blank (1) ──
      {
        id: 18,
        text: 'Complete the correct format specifiers for each printf statement:',
        marks: '2 pts',
        type: 'fill',
        fillItems: [
          { label: 'printf("___", 42); // integer', answer: '%d' },
          { label: 'printf("___", 3.14); // float', answer: '%f' },
          { label: 'printf("___", 3.14159); // 2 decimals', answer: '%.2f' },
          { label: 'printf("___", \'Z\'); // character', answer: '%c' },
          { label: 'printf("___", "Mahmoud ABD ELKream"); // string', answer: '%s' },
        ],
        answer: 'Format specifiers: %d for integers, %f for floats, %.2f for 2 decimal places, %c for characters, %s for strings',
      },
      // ── Code Writing (3) ──
      {
        id: 19,
        text: 'Write a program that declares int age, float gpa, char grade, reads them with scanf, then prints them.',
        marks: '3 pts',
        type: 'code',
        answer: 'A program that reads three variables of different types and prints them',
        answerCode: '#include <stdio.h>\nint main() {\n    int age; float gpa; char grade;\n    scanf("%d", &age);\n    scanf("%f", &gpa);\n    scanf(" %c", &grade);\n    printf("Age=%d GPA=%f Grade=%c", age, gpa, grade);\n    return 0;\n}',
      },
      {
        id: 20,
        text: 'Write a program that prints two lines using \\n and a tab using \\t.',
        marks: '2 pts',
        type: 'code',
        answer: 'Use \\n for a new line and \\t for a tab (indentation)',
        answerCode: 'printf("Name: Mahmoud ABD ELKream\\n");\nprintf("\\tLevel: 1");',
      },
      {
        id: 21,
        text: 'Declare three variables (int, float, char) and print their values and sizes using sizeof.',
        marks: '3 pts',
        type: 'code',
        answer: 'Use sizeof to find the size in bytes of each data type',
        answerCode: "int a = 10; float b = 3.5; char c = 'Z';\nprintf(\"Integer: %d\\n\", a);\nprintf(\"Float: %f\\n\", b);\nprintf(\"Char: %c\\n\", c);\nprintf(\"Size of int: %lu\\n\", sizeof(a));\nprintf(\"Size of float: %lu\\n\", sizeof(b));\nprintf(\"Size of char: %lu\\n\", sizeof(c));",
      },
    ],
  },
  {
    id: 2,
    title: 'Operators & Expressions',
    marks: '20 pts',
    icon: '🔢',
    questions: [
      // ── Trace/Predict Output (11) ──
      {
        id: 22,
        text: 'Trace the following code and write the exact output:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int x=5, a, b;\na = ++x;\nb = x++;\nint y = a + b;\nprintf("%d", y);',
        answer: '++x makes x=6 and a=6. x++ uses x=6 then increments to 7, so b=6. y=6+6=12',
        answerCode: '12',
      },
      {
        id: 23,
        text: 'Trace — what is the comparison output?',
        marks: '1 pt',
        type: 'trace',
        codeBlock: 'int x=5, y=5;\nprintf("%d", x==y);',
        answer: 'The == operator returns 1 (true) when x equals y',
        answerCode: '1',
      },
      {
        id: 24,
        text: 'Trace with operator precedence in mind:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int x=2, y=3, z=4;\nprintf("%d", x+y-z/2);',
        answer: 'Division first: z/2=4/2=2. Then: 2+3-2=3',
        answerCode: '3',
      },
      {
        id: 25,
        text: 'Trace — Compound Assignment:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int x=10;\nx += 5*2;\nprintf("%d", x);',
        answer: '5*2=10 first, then x+=10 means x=10+10=20',
        answerCode: '20',
      },
      {
        id: 26,
        text: 'Trace — printing a character as a number (ASCII):',
        marks: '1 pt',
        type: 'trace',
        codeBlock: "char c='A';\nprintf(\"%d\", c);",
        answer: 'Printing a char with %d shows its ASCII value. The character A = 65',
        answerCode: '65',
      },
      {
        id: 27,
        text: 'Trace — Prefix Increment:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int a = 5;\nint result = ++a * 2;\nprintf("result=%d, a=%d", result, a);',
        answer: '++a makes a=6 first, then 6*2=12',
        answerCode: 'result=12, a=6',
      },
      {
        id: 28,
        text: 'Trace — Postfix Increment:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int a = 5;\nint result = a++ * 2;\nprintf("result=%d, a=%d", result, a);',
        answer: 'a++ uses the current value 5 in multiplication (5*2=10) then increments a to 6',
        answerCode: 'result=10, a=6',
      },
      {
        id: 29,
        text: 'Trace — Negation & Precedence:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int a = 5, b = 3;\nint result = -(a + b) * 2;\nprintf("%d", result);',
        answer: 'First: 5+3=8. Then: -(8)*2 = -8*2 = -16',
        answerCode: '-16',
      },
      {
        id: 30,
        text: 'Trace step by step — Compound Assignment Chain:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int a = 10;\na += 5;\na -= 3;\na *= 2;\na /= 4;\nprintf("Value: %d", a);',
        answer: 'a=10 → +=5 → a=15 → -=3 → a=12 → *=2 → a=24 → /=4 → a=6',
        answerCode: 'Value: 6',
      },
      {
        id: 31,
        text: 'Calculate the results without running the code:',
        marks: '2 pts',
        type: 'fill',
        fillItems: [
          { label: 'int result1 = (3+2)*4;', answer: '20' },
          { label: 'int result2 = 10 + 5 * 2;', answer: '20' },
        ],
        answer: 'Multiplication has higher precedence than addition: (3+2)*4=5*4=20 | 10+5*2=10+10=20',
      },
      {
        id: 32,
        text: 'Trace — Short-circuit Evaluation:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int x=0, y=5;\nprintf("%d\\n", x && y++);\nprintf("%d", y);',
        answer: 'x=0 is false, && short-circuits so y++ is never evaluated. Output: 0 then y stays 5',
        answerCode: '0\n5',
      },
      // ── Correct the Code (2) ──
      {
        id: 33,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'const int x = 10;\nx = 20;',
        answer: 'The const keyword makes the variable read-only and its value cannot be changed. Remove const or remove the reassignment',
        answerCode: '// Solution 1: Remove const\nint x = 10;\nx = 20;\n\n// Solution 2: Remove reassignment\nconst int x = 10;',
      },
      {
        id: 34,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'char grade = "A";',
        answer: 'The char type uses single quotes \' \' not double quotes " ". Double quotes are for strings',
        answerCode: "char grade = 'A';",
      },
      // ── Code Writing (1) ──
      {
        id: 35,
        text: 'Write a program that declares two integers and calculates sum, difference, product, and both types of division (integer and float).',
        marks: '3 pts',
        type: 'code',
        answer: 'A program that performs four arithmetic operations with two types of division',
        answerCode: 'int a=10, b=3;\nprintf("Sum=%d\\n", a+b);\nprintf("Difference=%d\\n", a-b);\nprintf("Product=%d\\n", a*b);\nprintf("Int Division=%d\\n", a/b);\nprintf("Float Division=%f\\n", (float)a/b);',
      },
    ],
  },
  {
    id: 3,
    title: 'Conditions (if/else, switch, ternary)',
    marks: '15 pts',
    icon: '🔀',
    questions: [
      // ── Trace/Predict Output (4) ──
      {
        id: 36,
        text: 'What is the output? Explain the ternary operator in one sentence.',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int a = 10, b = 20;\n(a > b) ? printf("A is greater") : printf("B is greater");',
        answer: 'a>b is false (10 is not greater than 20), so the part after : is executed. The ternary operator ?: is shorthand for if-else',
        answerCode: 'B is greater',
      },
      {
        id: 37,
        text: 'What does each printf print? Explain why.',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int x = 5, y = 10;\nprintf("%d\\n", (x > 0 && y > 0));\nprintf("%d\\n", (x > 0 || y < 0));\nprintf("%d\\n", !(x > y));',
        answer: 'Line 1: (5>0 && 10>0) = true && true = 1 | Line 2: (5>0 || 10<0) = true || false = 1 | Line 3: !(5>10) = !(false) = 1',
        answerCode: '1  // (5>0 && 10>0) = true && true = 1\n1  // (5>0 || 10<0) = true || false = 1\n1  // !(5>10) = !(false) = 1',
      },
      {
        id: 38,
        text: 'Trace — multiple if statements:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int x=0;\nif(x==0) printf("A");\nif(x) printf("B");\nelse printf("C");',
        answer: 'First if(x==0) is true → "A". Second if(x) is false (x=0) so it goes to else → "C"',
        answerCode: 'AC',
      },
      {
        id: 39,
        text: 'Trace — switch statement:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int x=5;\nswitch(x%2) {\n    case 0: printf("Even");\n    case 1: printf("Odd");\n}',
        answer: '5%2=1, matches case 1 and prints "Odd"',
        answerCode: 'Odd',
      },
      // ── Correct the Code (3) ──
      {
        id: 40,
        text: 'The following code has an error (Fall-through). Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'switch(x) {\n    case 1: printf("A");\n    case 2: printf("B");\n}',
        answer: 'Missing break causes fall-through to the next case. Add break after each case',
        answerCode: 'switch(x) {\n    case 1: printf("A"); break;\n    case 2: printf("B"); break;\n}',
      },
      {
        id: 41,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'float x=2.0;\nswitch(x) {\n    case 2: printf("Two");\n}',
        answer: 'switch does not work with float. Use int or if-else instead',
        answerCode: '// Solution: Use int\nint x=2;\nswitch(x) {\n    case 2: printf("Two"); break;\n}\n\n// Or use if-else\nfloat x=2.0;\nif(x == 2.0) printf("Two");',
      },
      {
        id: 42,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'if(i = 3) continue;',
        answer: '= is assignment, not comparison. Use == for comparison',
        answerCode: 'if(i == 3) continue;',
      },
      // ── Code Writing (3) ──
      {
        id: 43,
        text: 'Write a program that converts Celsius to Fahrenheit: fahrenheit = (celsius * 9.0 / 5.0) + 32',
        marks: '2 pts',
        type: 'code',
        answer: 'A temperature conversion program that prints with 2 decimal places',
        answerCode: '#include <stdio.h>\nint main() {\n    float celsius, fahrenheit;\n    scanf("%f", &celsius);\n    fahrenheit = (celsius * 9.0 / 5.0) + 32;\n    printf("%.2f", fahrenheit);\n    return 0;\n}',
      },
      {
        id: 44,
        text: 'Write a program that reads an integer and prints if it is even or odd.',
        marks: '2 pts',
        type: 'code',
        answer: 'Use the % operator to determine if a number is even or odd',
        answerCode: 'int input;\nscanf("%d", &input);\nif(input%2 == 0)\n    printf("Even");\nelse\n    printf("Odd");',
      },
      {
        id: 45,
        text: 'Write a program that checks if a number is positive AND even.',
        marks: '2 pts',
        type: 'code',
        answer: 'Use && to check two conditions together',
        answerCode: 'if(num>0 && num%2==0)\n    printf("Positive Even");\nelse\n    printf("Other");',
      },
    ],
  },
  {
    id: 4,
    title: 'Loops (for, while, do-while, break, continue)',
    marks: '20 pts',
    icon: '🔁',
    questions: [
      // ── Trace/Predict Output (8) ──
      {
        id: 46,
        text: 'Trace — for loop with continue:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int i;\nfor(i=1; i<=10; i++) {\n    if(i%5==0) continue;\n    printf("%d ", i);\n}',
        answer: 'continue skips printing when i=5 or i=10',
        answerCode: '1 2 3 4 6 7 8 9',
      },
      {
        id: 47,
        text: 'Trace — for loop with break:',
        marks: '1 pt',
        type: 'trace',
        codeBlock: 'int i;\nfor(i=1; i<=10; i++) {\n    if(i%2==0) break;\n    printf("%d ", i);\n}',
        answer: 'break at i=2 (first even number), so only 1 is printed',
        answerCode: '1',
      },
      {
        id: 48,
        text: 'Trace — while loop with continue:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int i = 0;\nwhile(i < 5) {\n    if(i == 2) { i++; continue; }\n    printf("%d\\n", i);\n    i++;\n}',
        answer: 'When i=2, i is incremented then continue skips printing',
        answerCode: '0\n1\n3\n4',
      },
      {
        id: 49,
        text: 'Trace — Infinite Loop! Why?',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int i=0;\nwhile(i<5) {\n    if(i==2) continue;\n    printf("%d ", i);\n    i++;\n}',
        answer: 'continue skips i++ when i=2, so i stays 2 forever → infinite loop',
        answerCode: 'Infinite Loop\nBecause continue skips i++ when i=2',
      },
      {
        id: 50,
        text: 'Trace — semicolon after for:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int i;\nfor(i=1; i<=3; i++);\n{\n    printf("%d ", i);\n}',
        answer: 'The semicolon after for() makes it an empty loop. After the loop, i=4',
        answerCode: '4',
      },
      {
        id: 51,
        text: 'Trace — break in an array loop:',
        marks: '1 pt',
        type: 'trace',
        codeBlock: 'int arr[]={1,2,3,4,5};\nint i;\nfor(i=0;i<5;i++) {\n    if(i==3) break;\n    printf("%d ",arr[i]);\n}',
        answer: 'break at i=3, so it prints elements from index 0 to 2 only',
        answerCode: '1 2 3',
      },
      {
        id: 52,
        text: 'Trace — continue in for loop:',
        marks: '1 pt',
        type: 'trace',
        codeBlock: 'int i;\nfor(i=0; i<5; i++) {\n    if(i==2) continue;\n    printf("%d ", i);\n}',
        answer: 'continue skips printing when i=2',
        answerCode: '0 1 3 4',
      },
      {
        id: 53,
        text: 'Trace — for loop that never executes:',
        marks: '1 pt',
        type: 'trace',
        codeBlock: 'int i;\nfor(i=1; i>5; i++) {\n    printf("%d ", i);\n}',
        answer: 'i=1 is not > 5, so the condition is false from the start and the loop never executes',
        answerCode: '(nothing — loop never executes)',
      },
      // ── Correct the Code (2) ──
      {
        id: 54,
        text: 'The following code has an error (infinite loop). Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'int i=0;\nwhile(i<5) {\n    if(i==2) continue;\n    printf("%d ", i);\n    i++;\n}',
        answer: 'continue skips i++ when i=2, causing an infinite loop. Increment i before continue',
        answerCode: 'int i=0;\nwhile(i<5) {\n    if(i==2) { i++; continue; }\n    printf("%d ", i);\n    i++;\n}',
      },
      {
        id: 55,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'int i;\nfor(i=1; i>5; i++) {\n    printf("%d ", i);\n}',
        answer: 'The condition i>5 is wrong — it should be i<5 so the loop actually runs',
        answerCode: 'int i;\nfor(i=1; i<5; i++) {\n    printf("%d ", i);\n}',
      },
      // ── Code Writing (5) ──
      {
        id: 56,
        text: 'Write three programs (for, while, do-while) that print numbers 1 to 5.',
        marks: '3 pts',
        type: 'code',
        answer: 'Three loop types printing the same sequence',
        answerCode: '// Using for loop\nfor(int i=1; i<=5; i++)\n    printf("%d\\n", i);\n\n// Using while loop\nint i=1;\nwhile(i<=5) {\n    printf("%d\\n", i);\n    i++;\n}\n\n// Using do-while loop\nint i=1;\ndo {\n    printf("%d\\n", i);\n    i++;\n} while(i<=5);',
      },
      {
        id: 57,
        text: 'Print numbers 1 to 10, skip multiples of 3.',
        marks: '2 pts',
        type: 'code',
        answer: 'Use continue to skip numbers divisible by 3',
        answerCode: 'for(int i=1; i<=10; i++) {\n    if(i%3==0) continue;\n    printf("%d\\n", i);\n}',
      },
      {
        id: 58,
        text: 'Read 5 numbers, skip negatives, sum positives only.',
        marks: '2 pts',
        type: 'code',
        answer: 'Use continue to skip negative numbers',
        answerCode: 'int num=0, sum=0;\nfor(int i=0; i<5; i++) {\n    scanf("%d", &num);\n    if(num < 0) continue;\n    sum += num;\n}\nprintf("Sum = %d", sum);',
      },
      {
        id: 59,
        text: 'Search for a target number in range 1-10 with break.',
        marks: '2 pts',
        type: 'code',
        answer: 'Use break to exit the loop when the target is found',
        answerCode: 'int target;\nscanf("%d", &target);\nfor(int i=1; i<=10; i++) {\n    if(i == target) {\n        printf("Found at %d", i);\n        break;\n    }\n}',
      },
      {
        id: 60,
        text: 'Write a program that reads an integer n and prints numbers 1 to n.',
        marks: '2 pts',
        type: 'code',
        answer: 'A program that prints numbers from 1 to n using a for loop',
        answerCode: 'int n;\nscanf("%d", &n);\nfor(int i=1; i<=n; i++)\n    printf("%d\\n", i);',
      },
    ],
  },
  {
    id: 5,
    title: 'Arrays (1D & 2D)',
    marks: '20 pts',
    icon: '📦',
    questions: [
      // ── Trace/Predict Output (5) ──
      {
        id: 61,
        text: 'Trace — printing a 1D array:',
        marks: '1 pt',
        type: 'trace',
        codeBlock: 'int arr[4]={10,20,30,40};\nint i;\nfor(i=0; i<4; i++)\n    printf("%d ", arr[i]);',
        answer: 'Prints all array elements in order',
        answerCode: '10 20 30 40',
      },
      {
        id: 62,
        text: 'Trace — printing an array in reverse:',
        marks: '1 pt',
        type: 'trace',
        codeBlock: 'int arr[3]={5,10,15};\nint i;\nfor(i=2; i>=0; i--)\n    printf("%d ", arr[i]);',
        answer: 'Prints elements from last to first',
        answerCode: '15 10 5',
      },
      {
        id: 63,
        text: 'Trace — element in a 2D array:',
        marks: '1 pt',
        type: 'trace',
        codeBlock: 'int arr[2][2]={{1,2},{3,4}};\nprintf("%d", arr[1][0]);',
        answer: 'arr[1][0] is the element at row 1, column 0 = 3',
        answerCode: '3',
      },
      {
        id: 64,
        text: 'Trace — 2D array sum:',
        marks: '2 pts',
        type: 'trace',
        codeBlock: 'int arr[2][2]={{1,2},{3,4}};\nint sum=0;\nfor(int i=0;i<2;i++)\n    for(int j=0;j<2;j++)\n        sum+=arr[i][j];\nprintf("%d", sum);',
        answer: '1+2+3+4 = 10',
        answerCode: '10',
      },
      {
        id: 65,
        text: 'Trace — computed index:',
        marks: '1 pt',
        type: 'trace',
        codeBlock: 'int arr[3]={10,20,30};\nprintf("%d", arr[1+1]);',
        answer: 'arr[1+1] = arr[2] = 30',
        answerCode: '30',
      },
      // ── Correct the Code (5) ──
      {
        id: 66,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'int arr[3]={1,2,3};\nprintf("%d", arr[3]);',
        answer: 'arr[3] is out of bounds — the last valid index is arr[2]',
        answerCode: 'int arr[3]={1,2,3};\nprintf("%d", arr[2]);',
      },
      {
        id: 67,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'int arr[3]={1,2,3};\nint i;\nfor(i=0; i<3; i++) {\n    scanf("%d", arr[i]);\n}',
        answer: 'scanf needs the address of the variable & not its value',
        answerCode: 'for(i=0; i<3; i++) {\n    scanf("%d", &arr[i]);\n}',
      },
      {
        id: 68,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'int arr[2][2];\nint j;\nfor(j=0; j<3; j++)\n    scanf("%d", &arr[0][j]);',
        answer: 'The array is 2x2 but the loop reaches j=2 which is out of bounds. Use j<2',
        answerCode: 'for(j=0; j<2; j++)\n    scanf("%d", &arr[0][j]);',
      },
      {
        id: 69,
        text: 'The following code has an initialization issue. Explain and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'int arr[2][2]={1,2,3,4};',
        answer: 'The initialization works but it is clearer to write it as separate rows',
        answerCode: 'int arr[2][2]={{1,2},{3,4}};',
      },
      {
        id: 70,
        text: 'The following code has an error. Explain the error and write the correct version.',
        marks: '1 pt',
        type: 'code',
        codeBlock: 'int arr[3]={1,2,3};\nint i;\nfor(i=0; i<=3; i++) {\n    printf("%d", arr[i]);\n}',
        answer: 'i<=3 goes out of bounds (last index is 2). Use i<3',
        answerCode: 'int arr[3]={1,2,3};\nint i;\nfor(i=0; i<3; i++) {\n    printf("%d", arr[i]);\n}',
      },
      // ── Code Writing (6) ──
      {
        id: 71,
        text: 'Read 5 integers into an array and print them.',
        marks: '2 pts',
        type: 'code',
        answer: 'A program that reads 5 numbers into an array then prints them',
        answerCode: '#include <stdio.h>\nint main() {\n    int arr[5];\n    for(int i=0; i<5; i++)\n        scanf("%d", &arr[i]);\n    for(int i=0; i<5; i++)\n        printf("%d ", arr[i]);\n    return 0;\n}',
      },
      {
        id: 72,
        text: 'Read n numbers and calculate sum and average (2 decimal places).',
        marks: '2 pts',
        type: 'code',
        answer: 'A program that computes sum and average with type casting',
        answerCode: '#include <stdio.h>\nint main() {\n    int n, sum = 0;\n    scanf("%d", &n);\n    int arr[n];\n    for(int i=0; i<n; i++) {\n        scanf("%d", &arr[i]);\n        sum += arr[i];\n    }\n    printf("Sum = %d, Avg = %.2f", sum, (float)sum/n);\n    return 0;\n}',
      },
      {
        id: 73,
        text: 'Read a 2D array (2x3), print elements, calculate sum and find max.',
        marks: '3 pts',
        type: 'code',
        answer: 'A program that works with a 2D array: print + sum + max element',
        answerCode: 'int arr[2][3]; int sum=0, max;\nfor(int i=0;i<2;i++)\n    for(int j=0;j<3;j++)\n        scanf("%d",&arr[i][j]);\nmax = arr[0][0];\nfor(int i=0;i<2;i++)\n    for(int j=0;j<3;j++) {\n        printf("%d ", arr[i][j]);\n        sum += arr[i][j];\n        if(arr[i][j] > max) max = arr[i][j];\n    }\nprintf("\\nSum=%d  Max=%d", sum, max);',
      },
      {
        id: 74,
        text: 'Count even and odd numbers in an array using the % operator.',
        marks: '2 pts',
        type: 'code',
        answer: 'Use the % operator to determine if a number is even or odd',
        answerCode: '#include <stdio.h>\nint main() {\n    int arr[] = {1,2,3,4,5,6,7,8};\n    int even=0, odd=0;\n    int n = sizeof(arr)/sizeof(arr[0]);\n    for(int i=0; i<n; i++) {\n        if(arr[i]%2==0) even++;\n        else odd++;\n    }\n    printf("Even: %d\\n", even);\n    printf("Odd: %d\\n", odd);\n    return 0;\n}',
      },
      {
        id: 75,
        text: 'Create an array of 5 elements and print their sum.',
        marks: '2 pts',
        type: 'code',
        answer: 'A program that sums elements of a fixed array',
        answerCode: 'int arr[5]={3,5,6,2,88}; int sum=0;\nfor(int i=0; i<5; i++)\n    sum+=arr[i];\nprintf("%d", sum);',
      },
      {
        id: 76,
        text: 'Search for a target in an array of 10 elements using break.',
        marks: '2 pts',
        type: 'code',
        answer: 'Search for target and print the index when found, then exit with break',
        answerCode: 'int arr[10]={3,5,6,2,88,32,11,33,55,10};\nint target;\nscanf("%d",&target);\nfor(int i=0; i<10; i++) {\n    if(arr[i]==target) {\n        printf("Found at index %d", i);\n        break;\n    }\n}',
      },
    ],
  },
  {
    id: 6,
    title: 'Strings & General Concepts',
    marks: '14 pts',
    icon: '🧠',
    questions: [
      // ── MCQ (10) ──
      {
        id: 77,
        text: 'What is the purpose of #include <stdio.h>?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Define variables', isCorrect: false },
          { letter: 'B', text: 'Include the standard I/O library', isCorrect: true },
          { letter: 'C', text: 'Define functions', isCorrect: false },
          { letter: 'D', text: 'End the program', isCorrect: false },
        ],
        answer: 'Including stdio.h provides essential functions like printf and scanf',
      },
      {
        id: 78,
        text: 'What does return 0; mean in main()?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Returns 0 to the operating system', isCorrect: false },
          { letter: 'B', text: 'Ends the program only', isCorrect: false },
          { letter: 'C', text: 'Prints the number 0', isCorrect: false },
          { letter: 'D', text: 'Both A and B are correct', isCorrect: true },
        ],
        answer: 'Returning 0 to the OS indicates the program ended successfully',
      },
      {
        id: 79,
        text: 'In C, which type is used for decimal numbers?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'int', isCorrect: false },
          { letter: 'B', text: 'char', isCorrect: false },
          { letter: 'C', text: 'float', isCorrect: true },
          { letter: 'D', text: 'bool', isCorrect: false },
        ],
        answer: 'float is the default type for decimal numbers, e.g.: float gpa = 3.5;',
      },
      {
        id: 80,
        text: 'What is a "Garbage Value"?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A value that is always 0', isCorrect: false },
          { letter: 'B', text: 'A random undefined value from an uninitialized variable', isCorrect: true },
          { letter: 'C', text: 'A compilation error', isCorrect: false },
          { letter: 'D', text: 'A NULL value', isCorrect: false },
        ],
        answer: 'Local variables are not initialized to default values — they hold random values from memory',
      },
      {
        id: 81,
        text: 'How are strings declared in C?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'string name = "Mahmoud ABD ELKream";', isCorrect: false },
          { letter: 'B', text: 'char name[] = "Mahmoud ABD ELKream"; — C has no string type', isCorrect: true },
          { letter: 'C', text: 'text name = "Mahmoud ABD ELKream";', isCorrect: false },
          { letter: 'D', text: 'String name = "Mahmoud ABD ELKream";', isCorrect: false },
        ],
        answer: 'In C there is no string data type. We use a char array like: char name[] = "Hello";',
      },
      {
        id: 82,
        text: 'What is the difference between = and ==?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'There is no difference', isCorrect: false },
          { letter: 'B', text: '= assigns a value, == compares and returns 0 or 1', isCorrect: true },
          { letter: 'C', text: '== assigns and = compares', isCorrect: false },
          { letter: 'D', text: '== is only used with numbers', isCorrect: false },
        ],
        answer: '= stores a value in a variable (a = 5), while == checks equality and returns 1 if true or 0 if false',
      },
      {
        id: 83,
        text: 'What is ASCII? What is the decimal value of \'A\'?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'ASCII maps characters to numbers, \'A\' = 97', isCorrect: false },
          { letter: 'B', text: 'ASCII maps characters to numbers, \'A\' = 65', isCorrect: true },
          { letter: 'C', text: 'ASCII is a data type, \'A\' = 1', isCorrect: false },
          { letter: 'D', text: 'ASCII is a library in C, \'A\' = 0', isCorrect: false },
        ],
        answer: 'In C, characters are stored as numbers according to the ASCII table. The character A corresponds to 65',
      },
      {
        id: 84,
        text: 'C uses a Compiler not an Interpreter. What is the difference?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'A compiler translates code line by line during execution', isCorrect: false },
          { letter: 'B', text: 'A compiler translates all code to machine code at once before running', isCorrect: true },
          { letter: 'C', text: 'There is no difference between them', isCorrect: false },
          { letter: 'D', text: 'An interpreter is faster than a compiler', isCorrect: false },
        ],
        answer: 'A compiler converts the entire source code to machine code beforehand, while an interpreter executes code line by line during runtime',
      },
      {
        id: 85,
        text: 'What does sizeof() return?',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'Returns the value stored in the variable', isCorrect: false },
          { letter: 'B', text: 'Returns the size in bytes, e.g. sizeof(int) = 4', isCorrect: true },
          { letter: 'C', text: 'Returns the memory address', isCorrect: false },
          { letter: 'D', text: 'Returns only the number of elements', isCorrect: false },
        ],
        answer: 'sizeof() returns the size of a variable or type in bytes. Example: sizeof(char) = 1, sizeof(float) = 4',
      },
      {
        id: 86,
        text: 'Explain the difference between break and continue in one sentence each.',
        marks: '1 pt',
        type: 'mcq',
        mcqOptions: [
          { letter: 'A', text: 'break exits the loop completely, continue skips the current iteration and moves to the next', isCorrect: true },
          { letter: 'B', text: 'break only exits an if, continue exits the loop', isCorrect: false },
          { letter: 'C', text: 'Both exit the loop', isCorrect: false },
          { letter: 'D', text: 'continue stops the entire program', isCorrect: false },
        ],
        answer: 'break immediately terminates the loop and exits it, while continue skips the remaining code in the current iteration and proceeds to the next iteration',
      },
      // ── Code Writing (4) ──
      {
        id: 87,
        text: 'Write a program that reads a char, a word, and a sentence (with spaces), then prints all.',
        marks: '4 pts',
        type: 'code',
        answer: 'Use scanf for char and word, and fgets for a sentence with spaces',
        answerCode: '#include <stdio.h>\nint main() {\n    char ch; char word[10]; char sentence[50];\n    scanf("%c", &ch);\n    scanf("%s", word);\n    getchar(); // clear newline\n    fgets(sentence, sizeof(sentence), stdin);\n    printf("%c\\n%s\\n%s", ch, word, sentence);\n    return 0;\n}',
      },
      {
        id: 88,
        text: 'Write a program that calculates the square of an integer.',
        marks: '2 pts',
        type: 'code',
        answer: 'Square = number × itself',
        answerCode: 'int input, square;\nscanf("%d", &input);\nsquare = input * input;\nprintf("%d", square);',
      },
      {
        id: 89,
        text: 'Write a program that reads a student name and two grades, then calculates and prints the average.',
        marks: '4 pts',
        type: 'code',
        answer: 'A program that calculates the average of two grades with the student name',
        answerCode: '#include <stdio.h>\nint main() {\n    char name[50];\n    float g1, g2, avg;\n    scanf("%s", name);\n    scanf("%f %f", &g1, &g2);\n    avg = (g1 + g2) / 2;\n    printf("Name: %s\\nAvg: %.2f", name, avg);\n    return 0;\n}',
      },
      {
        id: 90,
        text: 'Write a program that reads a decimal number and prints it with 2 decimal places.',
        marks: '4 pts',
        type: 'code',
        answer: 'Use %.2f to print a float with exactly 2 decimal places',
        answerCode: '#include <stdio.h>\nint main() {\n    float num;\n    scanf("%f", &num);\n    printf("%.2f\\n", num);\n    return 0;\n}',
      },
    ],
  },
]

// ─── State Types ─────────────────────────────────────
interface QuestionState {
  userCode: string
  fillAnswers: Record<number, string>
  selectedMcq: string | null
  isChecked: boolean
  isSolutionRevealed: boolean
  isCorrect: boolean | null
  fillCorrect: Record<number, boolean>
}

// ─── LocalStorage Key ────────────────────────────────
const STORAGE_KEY = 'prepify-cp-progress'

// ─── Main Component ──────────────────────────────────
export default function Home() {
  const {
    quizStarted, userName, timerMinutes, showStartPopup, elapsedSeconds,
    attemptSubmitting, attemptSubmitted,
    handleStartQuiz, handleSkipPopup, submitQuizAttempt, setShowStartPopup,
  } = useQuizTracking('c-programming', 'cp-full')

  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({})
  const [activeSection, setActiveSection] = useState<number | null>(null)
  const [scoreSubmitted, setScoreSubmitted] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // ─── Review storage (starred + wrong questions) ───
  const {
    starredIds, wrongIds, toggleStar, isStarred,
    saveWrongQuestions, removeWrong, removeStarred, clearAllReview,
  } = useReviewStorage('cp')
  const topRef = useRef<HTMLDivElement>(null)
  const sectionNavRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragScrollLeft, setDragScrollLeft] = useState(0)
  const [showLeftFade, setShowLeftFade] = useState(false)
  const [showRightFade, setShowRightFade] = useState(true)

  // ─── Drag-to-scroll for section nav ───────────────────
  const updateFadeIndicators = useCallback(() => {
    const el = sectionNavRef.current
    if (!el) return
    setShowLeftFade(el.scrollLeft > 5)
    setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 5)
  }, [])

  useEffect(() => {
    updateFadeIndicators()
    const el = sectionNavRef.current
    if (!el) return
    el.addEventListener('scroll', updateFadeIndicators)
    window.addEventListener('resize', updateFadeIndicators)
    return () => {
      el.removeEventListener('scroll', updateFadeIndicators)
      window.removeEventListener('resize', updateFadeIndicators)
    }
  }, [updateFadeIndicators])

  const handleDragStart = useCallback((clientX: number) => {
    const el = sectionNavRef.current
    if (!el) return
    setIsDragging(true)
    setDragStartX(clientX)
    setDragScrollLeft(el.scrollLeft)
  }, [])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return
    const el = sectionNavRef.current
    if (!el) return
    const walk = (clientX - dragStartX) * 1.5
    el.scrollLeft = dragScrollLeft - walk
  }, [isDragging, dragStartX, dragScrollLeft])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ─── Load saved progress from localStorage on mount ───
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.questionStates) setQuestionStates(data.questionStates)
        if (data.scoreSubmitted) setScoreSubmitted(data.scoreSubmitted)
      }
    } catch { /* ignore parse errors */ }
    setHydrated(true)
  }, [])

  // ─── Save progress to localStorage on state change ───
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ questionStates, scoreSubmitted }))
    } catch { /* ignore quota errors */ }
  }, [questionStates, scoreSubmitted, hydrated])

  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0)

  const getQState = useCallback((qId: number): QuestionState => {
    return questionStates[qId] || {
      userCode: '',
      fillAnswers: {},
      selectedMcq: null,
      isChecked: false,
      isSolutionRevealed: false,
      isCorrect: null,
      fillCorrect: {},
    }
  }, [questionStates])

  const updateQState = useCallback((qId: number, update: Partial<QuestionState>) => {
    setQuestionStates(prev => ({
      ...prev,
      [qId]: { ...getQState(qId), ...update },
    }))
  }, [getQState])

  const answeredCount = Object.values(questionStates).filter(
    s => s.isChecked || s.isSolutionRevealed || s.selectedMcq !== null || s.userCode.trim().length > 0 || Object.keys(s.fillAnswers).length > 0
  ).length

  const correctCount = Object.values(questionStates).filter(
    s => s.isChecked && s.isCorrect === true
  ).length

  // MCQ/TF check
  const checkMcq = useCallback((qId: number, question: Question) => {
    const state = getQState(qId)
    if (!state.selectedMcq) return
    const correct = question.mcqOptions?.find(o => o.letter === state.selectedMcq)?.isCorrect ?? false
    updateQState(qId, { isChecked: true, isCorrect: correct })
  }, [getQState, updateQState])

  // Fill check
  const checkFill = useCallback((qId: number, question: Question) => {
    const state = getQState(qId)
    const fillCorrect: Record<number, boolean> = {}
    let allCorrect = true
    question.fillItems?.forEach((item, idx) => {
      const userAns = (state.fillAnswers[idx] || '').trim().toLowerCase()
      const correctAns = item.answer.trim().toLowerCase()
      const isCorrect = userAns === correctAns
      fillCorrect[idx] = isCorrect
      if (!isCorrect) allCorrect = false
    })
    updateQState(qId, { isChecked: true, isCorrect: allCorrect, fillCorrect })
  }, [getQState, updateQState])

  // Code/trace check
  const checkCode = useCallback((qId: number) => {
    const state = getQState(qId)
    const hasContent = state.userCode.trim().length > 0
    updateQState(qId, { isChecked: true, isCorrect: hasContent ? null : false })
  }, [getQState, updateQState])

  // Reveal solution
  const revealSolution = useCallback((qId: number) => {
    updateQState(qId, { isSolutionRevealed: true })
  }, [updateQState])

  // Hide solution
  const hideSolution = useCallback((qId: number) => {
    updateQState(qId, { isSolutionRevealed: false })
  }, [updateQState])

  // Reset question
  const resetQuestion = useCallback((qId: number) => {
    setQuestionStates(prev => {
      const next = { ...prev }
      delete next[qId]
      return next
    })
  }, [])

  // Reveal all solutions
  const revealAllSolutions = useCallback(() => {
    sections.forEach(s => s.questions.forEach(q => {
      updateQState(q.id, { isSolutionRevealed: true })
    }))
  }, [updateQState])

  // Hide all solutions
  const hideAllSolutions = useCallback(() => {
    sections.forEach(s => s.questions.forEach(q => {
      updateQState(q.id, { isSolutionRevealed: false })
    }))
  }, [updateQState])

  // Reset all
  const resetAll = useCallback(() => {
    setQuestionStates({})
    setScoreSubmitted(false)
    setShowConfetti(false)
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
  }, [])

  // Submit all & show score
  const submitAll = useCallback(() => {
    setScoreSubmitted(true)
    if (correctCount / totalQuestions >= 0.8) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 4000)
    }
    // Save wrong questions to review storage
    saveWrongQuestions(questionStates)
    // Save attempt to database
    const wrongCount = answeredCount - correctCount
    submitQuizAttempt(correctCount, wrongCount, totalQuestions)
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [correctCount, totalQuestions, answeredCount, submitQuizAttempt, questionStates, saveWrongQuestions])

  useEffect(() => {
    const handleScroll = () => {
      const sectionHeaders = document.querySelectorAll('[data-section-id]')
      let current: number | null = null
      sectionHeaders.forEach(header => {
        const rect = header.getBoundingClientRect()
        if (rect.top <= 150) {
          current = Number(header.getAttribute('data-section-id'))
        }
      })
      if (current !== null) setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate total marks
  const totalMarks = sections.reduce((acc, s) => {
    return acc + s.questions.reduce((qAcc, q) => {
      const m = parseInt(q.marks)
      return qAcc + (isNaN(m) ? 0 : m)
    }, 0)
  }, 0)

  return (
    <div className="min-h-screen bg-[#080c18] text-[#e2e8f0] font-sans">
      {/* Quiz Start Popup */}
      <QuizStartPopup
        open={showStartPopup}
        onClose={handleSkipPopup}
        onStart={handleStartQuiz}
        subjectName="C Programming"
      />

      {/* Timer */}
      {quizStarted && timerMinutes > 0 && (
        <QuizTimer
          minutes={timerMinutes}
          onTimeUp={() => {
            if (!scoreSubmitted) {
              submitAll()
            }
          }}
        />
      )}

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }} />
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  background: ['#7c3aed', '#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#ec4899'][i % 6],
                }}
                animate={{
                  y: [0, window.innerHeight + 100],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1, ease: 'easeIn' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-1 max-w-[920px] mx-auto px-4 pb-10" ref={topRef}>
        {/* Back to Home */}
        <div className="pt-4">
          <a href="/" className="inline-flex items-center gap-2 text-[#64748b] hover:text-[#00d4ff] text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </a>
        </div>

        {/* Header */}
        <motion.header
          className="text-center pt-10 pb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Prepify Logo" className="w-24 h-24 md:w-28 md:h-28 rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.3)]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-2">
            <span className="bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent">C Programming</span>
            <br />
            <span className="text-[#10b981]">Interactive Review</span>
          </h1>
          <p className="text-[#64748b] text-[15px] mb-6">
            Mahmoud ABD ELKream &nbsp;|&nbsp; Spring 2025/2026
          </p>
          <div className="flex justify-center gap-6 flex-wrap mt-4">
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#00d4ff]">{totalQuestions}</div>
              <div className="text-[11px] text-[#64748b]">Questions</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#10b981]">{totalMarks}</div>
              <div className="text-[11px] text-[#64748b]">Marks</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#7c3aed]">6</div>
              <div className="text-[11px] text-[#64748b]">Sections</div>
            </div>
            <div className="text-center bg-[#111827] border border-[#1e2d45] rounded-2xl px-6 py-3 min-w-[90px]">
              <div className="text-2xl font-black text-[#f59e0b]">{correctCount}</div>
              <div className="text-[11px] text-[#64748b]">Correct</div>
            </div>
          </div>
        </motion.header>

        {/* Sticky Controls Bar */}
        <div className="bg-[#111827]/90 border border-[#1e2d45] rounded-2xl p-3 mb-6 sticky top-2.5 z-50 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-[#64748b]">Progress</span>
                <span className="text-[11px] text-[#00d4ff] font-bold">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
              </div>
              <div className="h-2 bg-[#1e2d45] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] rounded-full"
                  animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>
            <div className="text-xs text-[#64748b] whitespace-nowrap">
              {answeredCount} / {totalQuestions}
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={revealAllSolutions}
                className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-lg px-4 py-1.5 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                Show All Solutions
              </button>
              <button
                onClick={hideAllSolutions}
                className="bg-transparent text-[#64748b] border border-[#1e2d45] rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:border-[#64748b] transition-colors"
              >
                Hide All
              </button>
              <button
                onClick={resetAll}
                className="bg-transparent text-[#ef4444] border border-[#ef4444]/30 rounded-lg px-3 py-1.5 text-xs cursor-pointer hover:bg-[#ef4444]/10 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Section nav pills - draggable with fade indicators */}
          <div className="relative mt-3">
            {/* Left fade indicator */}
            <div className={`absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to right, #0f172a, transparent)' }} />
            {/* Right fade indicator */}
            <div className={`absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'linear-gradient(to left, #0f172a, transparent)' }} />
            <div
              ref={sectionNavRef}
              className={`flex gap-2 overflow-x-auto pb-1 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onMouseDown={(e) => { e.preventDefault(); handleDragStart(e.clientX) }}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
              onTouchEnd={handleDragEnd}
            >
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    if (!isDragging) {
                      document.querySelector(`[data-section-id="${s.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    activeSection === s.id
                      ? 'bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white border-transparent shadow-[0_0_10px_rgba(0,212,255,0.3)]'
                      : 'bg-[#1a2235] text-[#64748b] border-[#1e2d45] hover:border-[#00d4ff]/50 hover:text-[#00d4ff]'
                  }`}
                >
                  <span>{s.icon}</span>
                  Section {s.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sections */}
        {sections.map((section, sIdx) => (
          <motion.div
            key={section.id}
            data-section-id={section.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: sIdx * 0.1 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mt-10 mb-6 pb-4 border-b-2 border-[#1e2d45] relative">
              <div className="w-[48px] h-[48px] bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] rounded-[14px] flex items-center justify-center text-2xl shrink-0 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                {section.icon}
              </div>
              <div className="flex-1">
                <div className="text-lg font-black">{section.title}</div>
                <div className="text-xs text-[#64748b]">Section {section.id} of 6</div>
              </div>
              <div className="bg-[#1a2235] border border-[#1e2d45] px-4 py-2 rounded-full text-sm font-bold text-[#00d4ff] shadow-[0_0_10px_rgba(0,212,255,0.1)]">
                {section.marks}
              </div>
            </div>

            {/* Questions */}
            {section.questions.map((q, qIdx) => (
              <QuestionCard
                key={q.id}
                question={q}
                sectionTitle={section.title}
                sectionIcon={section.icon}
                state={getQState(q.id)}
                onUpdate={updateQState}
                onCheckMcq={() => checkMcq(q.id, q)}
                onCheckFill={() => checkFill(q.id, q)}
                onCheckCode={() => checkCode(q.id)}
                onRevealSolution={() => revealSolution(q.id)}
                onHideSolution={() => hideSolution(q.id)}
                onReset={() => resetQuestion(q.id)}
                isStarred={isStarred(q.id)}
                onToggleStar={() => toggleStar(q.id)}
                index={qIdx}
              />
            ))}
          </motion.div>
        ))}

        {/* Submit Section */}
        {!scoreSubmitted ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={submitAll}
              className="bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white border-none rounded-2xl px-12 py-4 font-black text-xl cursor-pointer transition-all shadow-[0_0_40px_rgba(0,212,255,0.3)] hover:shadow-[0_0_60px_rgba(0,212,255,0.5)] hover:-translate-y-1 active:translate-y-0"
            >
              Show Final Score
            </button>
            <p className="text-[#64748b] text-sm mt-3">Make sure to review your answers before showing the score</p>
          </motion.div>
        ) : (
          <>
          <ScorePanel
            correctCount={correctCount}
            totalQuestions={totalQuestions}
            answeredCount={answeredCount}
            onReset={resetAll}
            onRevealAll={revealAllSolutions}
            timeTaken={elapsedSeconds}
          />
          {/* Review Panel: wrong + starred questions */}
          <ReviewPanel
            subjectName="C Programming"
            subjectColor="#7c3aed"
            starredQuestions={sections.flatMap(s => s.questions.filter(q => starredIds.has(q.id)).map(q => ({
              id: q.id, text: q.text, type: q.type, marks: q.marks,
              answer: q.answer, sectionTitle: s.title, sectionIcon: s.icon,
              codeBlock: q.codeBlock, answerCode: q.answerCode, mcqOptions: q.mcqOptions,
            })))}
            wrongQuestions={sections.flatMap(s => s.questions.filter(q => wrongIds.has(q.id)).map(q => ({
              id: q.id, text: q.text, type: q.type, marks: q.marks,
              answer: q.answer, sectionTitle: s.title, sectionIcon: s.icon,
              codeBlock: q.codeBlock, answerCode: q.answerCode, mcqOptions: q.mcqOptions,
            })))}
            onRemoveStarred={removeStarred}
            onRemoveWrong={removeWrong}
            onClearAll={clearAllReview}
          />
          </>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-[#1e2d45] mt-8">
          <div className="mb-3">
            <span className="text-[#e2e8f0] font-bold text-lg">Mahmoud ABD ELKream</span>
          </div>
          <div className="flex justify-center gap-4 mb-4">
            <a href="https://github.com/Mahmoud-ABDALKream" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#7c3aed] hover:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://mahmoud-ahmed-abdelkream.vercel.app/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#00d4ff] hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L1.5 20h6l4.5-8.5L16.5 20h6L12 0zm0 7.5L8.25 14.5h7.5L12 7.5z"/></svg>
              Portfolio
            </a>
            <a href="https://www.linkedin.com/in/mahmoud-ahmed-abdelkream/" target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#111827] border border-[#1e2d45] text-[#e2e8f0] text-sm hover:border-[#0077b5] hover:shadow-[0_0_15px_rgba(0,119,181,0.2)] transition-all duration-300">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
          <div className="text-[#64748b] text-sm">
            C Programming Quiz — <span className="text-[#00d4ff]">Mahmoud ABD ELKream</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

// ─── Score Panel ──────────────────────────────────────
function ScorePanel({
  correctCount,
  totalQuestions,
  answeredCount,
  onReset,
  onRevealAll,
  timeTaken,
}: {
  correctCount: number
  totalQuestions: number
  answeredCount: number
  onReset: () => void
  onRevealAll: () => void
  timeTaken?: number
}) {
  const pct = Math.round((correctCount / totalQuestions) * 100)
  const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F'
  const gradeColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'

  return (
    <motion.div
      className="bg-[#111827] border border-[#1e2d45] rounded-3xl p-8 mt-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.3)]"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <h2 className="text-2xl font-black mb-2">Your Score</h2>
      <p className="text-[#64748b] text-sm mb-6">Total verified answers</p>

      {/* Score Circle */}
      <div className="relative w-[160px] h-[160px] mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#1e2d45" strokeWidth="10" />
          <motion.circle
            cx="80" cy="80" r="70" fill="none"
            stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={440}
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: 440 - (440 * pct / 100) }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            className="text-4xl font-black bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] bg-clip-text text-transparent"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
          >
            {pct}%
          </motion.div>
          <div className="text-xs text-[#64748b]">Score</div>
        </div>
      </div>

      {/* Grade */}
      <motion.div
        className="inline-block text-5xl font-black px-8 py-2 rounded-2xl mb-6"
        style={{ color: gradeColor, background: `${gradeColor}15`, border: `2px solid ${gradeColor}40` }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring' }}
      >
        {grade}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#10b981]">{correctCount}</div>
          <div className="text-[11px] text-[#64748b]">Correct</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#ef4444]">{answeredCount - correctCount}</div>
          <div className="text-[11px] text-[#64748b]">Wrong</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#00d4ff]">{totalQuestions - answeredCount}</div>
          <div className="text-[11px] text-[#64748b]">Unanswered</div>
        </div>
        <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
          <div className="text-xl font-black text-[#7c3aed]">{totalQuestions}</div>
          <div className="text-[11px] text-[#64748b]">Total</div>
        </div>
        {timeTaken != null && timeTaken > 0 && (
          <div className="bg-[#1a2235] border border-[#1e2d45] rounded-xl p-4">
            <div className="text-xl font-black text-[#8b5cf6]">{formatDuration(timeTaken)}</div>
            <div className="text-[11px] text-[#64748b]">Time Taken</div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onRevealAll}
          className="bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-none rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          Show All Solutions
        </button>
        <button
          onClick={onReset}
          className="bg-transparent text-[#64748b] border-2 border-[#1e2d45] rounded-xl px-6 py-3 font-bold text-sm cursor-pointer hover:border-[#00d4ff] hover:text-[#00d4ff] transition-all"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  )
}

// ─── Question Card ────────────────────────────────────
function QuestionCard({
  question,
  sectionTitle,
  sectionIcon,
  state,
  onUpdate,
  onCheckMcq,
  onCheckFill,
  onCheckCode,
  onRevealSolution,
  onHideSolution,
  onReset,
  isStarred,
  onToggleStar,
  index,
}: {
  question: Question
  sectionTitle: string
  sectionIcon: string
  state: QuestionState
  onUpdate: (qId: number, update: Partial<QuestionState>) => void
  onCheckMcq: () => void
  onCheckFill: () => void
  onCheckCode: () => void
  onRevealSolution: () => void
  onHideSolution: () => void
  onReset: () => void
  isStarred: boolean
  onToggleStar: () => void
  index: number
}) {
  const isMcqOrTf = question.type === 'mcq' || question.type === 'tf'

  const statusColor = state.isChecked
    ? state.isCorrect === true
      ? '#10b981'
      : state.isCorrect === false
      ? '#ef4444'
      : '#f59e0b'
    : state.isSolutionRevealed
    ? '#00d4ff'
    : '#1e2d45'

  const statusBg = state.isChecked
    ? state.isCorrect === true
      ? 'rgba(16,185,129,0.05)'
      : state.isCorrect === false
      ? 'rgba(239,68,68,0.05)'
      : 'rgba(245,158,11,0.05)'
    : 'transparent'

  return (
    <motion.div
      className="bg-[#111827] rounded-2xl mb-5 overflow-hidden transition-all duration-300"
      style={{ border: `1.5px solid ${statusColor}`, boxShadow: state.isChecked ? `0 0 20px ${statusColor}15` : 'none' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {/* Header */}
      <div className="flex items-start gap-3.5 p-5 pb-3" style={{ background: statusBg }}>
        <div className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center font-mono text-sm font-bold shrink-0 transition-colors ${
          state.isChecked && state.isCorrect === true
            ? 'bg-[#10b981] text-white'
            : state.isChecked && state.isCorrect === false
            ? 'bg-[#ef4444] text-white'
            : state.isChecked
            ? 'bg-[#f59e0b] text-white'
            : state.isSolutionRevealed
            ? 'bg-[#00d4ff] text-white'
            : 'bg-[#1a2235] border border-[#1e2d45] text-[#00d4ff]'
        }`}>
          {state.isChecked && state.isCorrect === true ? '✓' :
           state.isChecked && state.isCorrect === false ? '✗' :
           state.isChecked ? '∼' :
           String(question.id).padStart(2, '0')}
        </div>
        <div className="text-[15px] leading-relaxed flex-1 font-medium">
          {question.text}
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Star button */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleStar() }}
            className="w-[28px] h-[28px] rounded-lg flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95"
            style={{
              color: isStarred ? '#f59e0b' : '#334155',
              background: isStarred ? 'rgba(245,158,11,0.15)' : 'transparent',
              border: isStarred ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
            }}
            title={isStarred ? 'Remove from review' : 'Star for review'}
          >
            {isStarred ? '★' : '☆'}
          </button>
          <div className="text-[11px] text-[#64748b] bg-[#1a2235] px-2.5 py-1 rounded-lg whitespace-nowrap border border-[#1e2d45]">
            {question.marks}
          </div>
          <div className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
            question.type === 'mcq' ? 'bg-[#7c3aed]/20 text-[#a78bfa]' :
            question.type === 'tf' ? 'bg-[#ec4899]/20 text-[#f472b6]' :
            question.type === 'trace' ? 'bg-[#f59e0b]/20 text-[#fbbf24]' :
            question.type === 'fill' ? 'bg-[#00d4ff]/20 text-[#22d3ee]' :
            'bg-[#10b981]/20 text-[#34d399]'
          }`}>
            {question.type === 'mcq' ? 'MCQ' :
             question.type === 'tf' ? 'T/F' :
             question.type === 'trace' ? 'Trace' :
             question.type === 'fill' ? 'Fill' : 'Code'}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5">
        {/* Hint */}
        {question.hint && !state.isChecked && !state.isSolutionRevealed && (
          <div className="inline-flex items-center gap-1.5 bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#f59e0b] text-xs px-3 py-1.5 rounded-lg mb-3">
            <span>💡</span>
            {question.hint}
          </div>
        )}

        {/* Code block (question) */}
        {question.codeBlock && (
          <pre className="bg-[#0a0f1e] border border-[#1e2d45] rounded-xl p-4 my-3 font-mono text-[13px] leading-relaxed text-left whitespace-pre-wrap overflow-x-auto text-[#a5b4fc] shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]" dir="ltr">
            {question.codeBlock}
          </pre>
        )}

        {/* ── MCQ/TF Options ── */}
        {isMcqOrTf && question.mcqOptions && (
          <div className={`grid gap-2.5 mt-3 ${question.type === 'tf' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {question.mcqOptions.map(opt => {
              const isSelected = state.selectedMcq === opt.letter
              const showResult = state.isChecked || state.isSolutionRevealed

              return (
                <button
                  key={opt.letter}
                  onClick={() => {
                    if (!state.isChecked) {
                      onUpdate(question.id, { selectedMcq: opt.letter })
                    }
                  }}
                  disabled={state.isChecked}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 border text-sm text-left transition-all duration-200 cursor-pointer ${
                    showResult && opt.isCorrect
                      ? 'border-[#10b981] bg-[rgba(16,185,129,0.15)] text-[#10b981] shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : showResult && isSelected && !opt.isCorrect
                      ? 'border-[#ef4444] bg-[rgba(239,68,68,0.1)] text-[#ef4444]'
                      : showResult && !opt.isCorrect
                      ? 'border-[#1e2d45] bg-[#0d1117] text-[#475569] opacity-50'
                      : isSelected
                      ? 'border-[#7c3aed] bg-[rgba(124,58,237,0.15)] text-[#c4b5fd] shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                      : 'border-[#1e2d45] bg-[#0d1117] text-[#e2e8f0] hover:border-[#7c3aed]/50 hover:bg-[rgba(124,58,237,0.05)]'
                  }`}
                >
                  <span className={`w-[28px] h-[28px] rounded-lg flex items-center justify-center font-bold text-xs shrink-0 font-mono transition-colors ${
                    showResult && opt.isCorrect
                      ? 'bg-[#10b981] text-white'
                      : showResult && isSelected && !opt.isCorrect
                      ? 'bg-[#ef4444] text-white'
                      : isSelected
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-[#1e2d45] text-[#e2e8f0]'
                  }`}>
                    {showResult && opt.isCorrect ? '✓' :
                     showResult && isSelected && !opt.isCorrect ? '✗' :
                     opt.letter}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              )
            })}
          </div>
        )}

        {/* ── Fill in the blank ── */}
        {question.type === 'fill' && question.fillItems && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {question.fillItems.map((item, idx) => {
              const showAnswer = (state.isChecked && state.fillCorrect[idx] === false) || state.isSolutionRevealed
              const isCorrect = state.fillCorrect[idx]
              const isWrong = state.isChecked && state.fillCorrect[idx] === false

              return (
                <div key={idx} className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#64748b] font-mono" dir="ltr">{item.label}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={state.fillAnswers[idx] || ''}
                      onChange={e => {
                        const newAnswers = { ...state.fillAnswers, [idx]: e.target.value }
                        onUpdate(question.id, { fillAnswers: newAnswers })
                      }}
                      disabled={state.isChecked}
                      placeholder="???"
                      dir="ltr"
                      className={`w-full px-3 py-2.5 rounded-lg font-mono text-sm border transition-all duration-200 outline-none ${
                        state.isChecked && isCorrect
                          ? 'bg-[rgba(16,185,129,0.1)] border-[#10b981] text-[#10b981]'
                          : isWrong
                          ? 'bg-[rgba(239,68,68,0.1)] border-[#ef4444] text-[#ef4444] line-through'
                          : 'bg-[#0d1117] border-[#1e2d45] text-[#e2e8f0] focus:border-[#00d4ff] focus:shadow-[0_0_10px_rgba(0,212,255,0.1)]'
                      }`}
                    />
                    {isWrong && (
                      <motion.span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10b981] font-mono text-sm font-bold"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        dir="ltr"
                      >
                        {item.answer}
                      </motion.span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Code / Trace textarea ── */}
        {(question.type === 'code' || question.type === 'trace') && (
          <div className="mt-3 relative">
            <textarea
              value={state.userCode}
              onChange={e => onUpdate(question.id, { userCode: e.target.value })}
              placeholder={question.type === 'trace' ? 'Write the expected output here...' : '#include <stdio.h>\nint main() {\n    ...\n}'}
              dir="ltr"
              className="w-full bg-[#0a0f1e] border border-[#1e2d45] rounded-xl p-4 font-mono text-[13px] text-[#e2e8f0] min-h-[120px] resize-y outline-none transition-all duration-200 focus:border-[#00d4ff] focus:shadow-[0_0_15px_rgba(0,212,255,0.1)] placeholder:text-[#334155]"
            />
            <div className="absolute top-2 right-2 text-[10px] text-[#334155] font-mono">
              {state.userCode.length > 0 ? `${state.userCode.split('\n').length} lines` : ''}
            </div>
          </div>
        )}

        {/* ── Action Buttons ── */}
        <div className="flex gap-2.5 mt-4 flex-wrap justify-end">
          {/* Check Answer */}
          {!state.isChecked && (
            <button
              onClick={() => {
                if (isMcqOrTf) onCheckMcq()
                else if (question.type === 'fill') onCheckFill()
                else onCheckCode()
              }}
              disabled={isMcqOrTf && !state.selectedMcq}
              className="bg-gradient-to-r from-[#7c3aed] to-[#00d4ff] text-white border-none rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:opacity-90 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_20px_rgba(0,212,255,0.2)] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              Check ✓
            </button>
          )}

          {/* Show/Hide Solution */}
          {!state.isSolutionRevealed ? (
            <button
              onClick={onRevealSolution}
              className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[#10b981]/30 rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:bg-[rgba(16,185,129,0.25)] transition-all"
            >
              Show Solution
            </button>
          ) : (
            <button
              onClick={onHideSolution}
              className="bg-[rgba(0,212,255,0.1)] text-[#00d4ff] border border-[#00d4ff]/30 rounded-lg px-5 py-2.5 font-bold text-sm cursor-pointer hover:bg-[rgba(0,212,255,0.2)] transition-all"
            >
              Hide Solution
            </button>
          )}

          {/* Reset */}
          {state.isChecked && (
            <button
              onClick={onReset}
              className="bg-transparent text-[#64748b] border border-[#1e2d45] rounded-lg px-4 py-2.5 text-sm cursor-pointer hover:border-[#64748b] transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* ── Feedback Message ── */}
        <AnimatePresence>
          {state.isChecked && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className={`mt-3 p-3.5 rounded-xl text-sm flex items-center gap-2.5 ${
                state.isCorrect === true
                  ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#6ee7b7]'
                  : state.isCorrect === false
                  ? 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] text-[#fca5a5]'
                  : 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#fcd34d]'
              }`}>
                <span className="text-lg">
                  {state.isCorrect === true ? '✅' : state.isCorrect === false ? '❌' : '⚠️'}
                </span>
                <span className="font-bold">
                  {state.isCorrect === true ? 'Correct answer! Well done' :
                   state.isCorrect === false ? 'Wrong answer — check the solution below' :
                   'Submitted — review the model solution below'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Solution Section ── */}
        <AnimatePresence>
          {state.isSolutionRevealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-5 rounded-xl bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.2)] text-[#6ee7b7]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#00d4ff] text-lg">💡</span>
                  <span className="font-black text-[#00d4ff]">Model Solution:</span>
                </div>
                <div className="text-sm leading-relaxed mb-3">{question.answer}</div>
                {question.answerCode && (
                  <pre className="bg-[#0a0f1e] border border-[#1e2d45] rounded-lg p-4 font-mono text-xs whitespace-pre-wrap text-left shadow-[inset_0_0_30px_rgba(0,0,0,0.3)]" dir="ltr">
                    {question.answerCode}
                  </pre>
                )}
                {isMcqOrTf && question.mcqOptions && (
                  <div className="mt-2 text-xs text-[#6ee7b7]/70">
                    Correct answer: {question.mcqOptions.find(o => o.isCorrect)?.letter} — {question.mcqOptions.find(o => o.isCorrect)?.text}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
