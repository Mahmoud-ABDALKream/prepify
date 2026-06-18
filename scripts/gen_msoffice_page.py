#!/usr/bin/env python3
"""
Generate /home/z/my-project/src/app/microsoft-office/page.tsx from iot/page.tsx.

Theme rules:
  - Main brand color: ORANGE (#f59e0b primary, #d97706 dark)
  - Hover/accent color: also ORANGE shades
  - "Correct answer" highlight: LIGHT GREEN (#6ee7b7 text, rgba(16,185,129,0.15) bg)
    — this stays the same as IoT so users see green when they get it right
  - All OTHER colors (red for wrong, pink for TF, etc.) stay the same

Approach:
  1) Copy iot/page.tsx verbatim
  2) Swap iot-specific identifiers (subject name, storage key, section import)
  3) Replace green-theme (#10b981, #059669, #34d399, #6ee7b7, rgba(16,185,129,X))
     with orange-theme (#f59e0b, #d97706, #fbbf24, #fcd34d, rgba(245,158,11,X))
     EXCEPT in the "correct answer" highlight contexts, where we KEEP light green
"""

import re
from pathlib import Path

SRC = Path('/home/z/my-project/src/app/iot/page.tsx')
DST = Path('/home/z/my-project/src/app/microsoft-office/page.tsx')

content = SRC.read_text(encoding='utf-8')

# ── Step 1: Identifier swaps ───────────────────────────────────────────────
content = content.replace(
    "import { iotSections as sections } from \"@/data/iot-sections\"",
    "import { msOfficeSections as sections } from \"@/data/ms-office-sections\"",
)

content = content.replace(
    "// sections is now imported from @/data/iot-sections",
    "// sections is now imported from @/data/ms-office-sections",
)

content = content.replace(
    "const STORAGE_KEY = 'prepify-iot-progress'",
    "const STORAGE_KEY = 'prepify-msoffice-progress'",
)

content = content.replace(
    "useQuizTracking('iot', 'iot-full')",
    "useQuizTracking('microsoft-office', 'msoffice-full')",
)

content = content.replace(
    "useReviewStorage('iot', validQuestionIds)",
    "useReviewStorage('microsoft-office', validQuestionIds)",
)

content = content.replace(
    'subjectName="Internet of Things (IoT)"',
    'subjectName="Microsoft Office"',
)

content = content.replace(
    '<span className="bg-gradient-to-r from-[#059669] to-[#10b981] bg-clip-text text-transparent">Internet of Things (IoT)</span>',
    '<span className="bg-gradient-to-r from-[#d97706] to-[#f59e0b] bg-clip-text text-transparent">Microsoft Office</span>',
)

content = content.replace(
    '<span className="text-[#10b981]">Interactive Review</span>',
    '<span className="text-[#f59e0b]">Interactive Review</span>',
)

# Header stat blocks: keep the orange/green pattern (Marks = orange, Sections = orange)
# In IoT page:
#   Questions → text-[#059669] (dark green)  → text-[#d97706] (dark orange)
#   Marks     → text-[#10b981] (green)       → text-[#f59e0b] (orange)
#   Sections  → text-[#10b981] (green)       → text-[#f59e0b] (orange)
#   Correct   → text-[#f59e0b] (orange)      → KEEP as orange (correct = light green for context but here it's a stat)
# Actually the user wants the OVERALL theme to be orange, with light green ONLY for "answer is correct" feedback.
# The "Correct" count in the header should remain orange (it's a stat counter, not an answer highlight).

# ── Step 2: Color theme swaps ──────────────────────────────────────────────
# General rule: replace green theme → orange theme EVERYWHERE first,
# then RE-INTRODUCE light green in specific "correct answer" highlight contexts.

# Hex swaps (general):
#   #10b981 (primary green)  → #f59e0b (primary orange)
#   #059669 (dark green)     → #d97706 (dark orange)
#   #34d399 (light green)    → #fbbf24 (light orange)
#   #6ee7b7 (lighter green)  → #fcd34d (lighter orange)
# rgba swaps:
#   rgba(16,185,129,X)       → rgba(245,158,11,X)

replacements = [
    (re.compile(r'#10b981', re.IGNORECASE), '#f59e0b'),
    (re.compile(r'#059669', re.IGNORECASE), '#d97706'),
    (re.compile(r'#34d399', re.IGNORECASE), '#fbbf24'),
    (re.compile(r'#6ee7b7', re.IGNORECASE), '#fcd34d'),
    (re.compile(r'rgba\(\s*16\s*,\s*185\s*,\s*129\s*,', re.IGNORECASE), 'rgba(245,158,11,'),
    (re.compile(r'rgb\(\s*16\s*,\s*185\s*,\s*129\s*\)', re.IGNORECASE), 'rgb(245,158,11)'),
]

counts = {}
for pat, repl in replacements:
    content, n = pat.subn(repl, content)
    counts[pat.pattern] = n

# ── Step 3: RE-INTRODUCE light green ONLY in "correct answer" highlight contexts ──
# In the QuestionCard component:
#   - The MCQ option button when (showResult && opt.isCorrect):
#       border-[#10b981] bg-[rgba(16,185,129,0.15)] text-[#10b981]
#     This now reads:
#       border-[#f59e0b] bg-[rgba(245,158,11,0.15)] text-[#f59e0b]
#     We want the "correct answer" highlight to be LIGHT GREEN:
#       border-[#6ee7b7] bg-[rgba(16,185,129,0.15)] text-[#6ee7b7]
#   - The small letter box for correct option: bg-[#10b981] → keep orange? or green?
#     The user said: "only when answer is correct, show light green"
#     So the entire "correct answer" highlight should be light green.

# Find the MCQ option button "showResult && opt.isCorrect" branches and swap to light green
# Pattern 1: 'border-[#f59e0b] bg-[rgba(245,158,11,0.15)] text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.1)]'
content = content.replace(
    "border-[#f59e0b] bg-[rgba(245,158,11,0.15)] text-[#f59e0b] shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    "border-[#6ee7b7] bg-[rgba(16,185,129,0.15)] text-[#6ee7b7] shadow-[0_0_15px_rgba(16,185,129,0.1)]",
)

# Pattern 2: For the selected-but-correct case in option letter box
#   'bg-[#f59e0b] text-white' appears in 3 contexts:
#     - showResult && opt.isCorrect: 'bg-[#10b981] text-white' → should be 'bg-[#6ee7b7] text-[#062a17]'
#     - isSelected: 'bg-[#10b981] text-white' → keep orange (user is selecting, not yet verified)
#   But these look identical in source. Let me check carefully:
#
# Looking at the source code:
#   showResult && opt.isCorrect
#     ? 'bg-[#10b981] text-white'           ← correct answer letter box
#     : showResult && isSelected && !opt.isCorrect
#     ? 'bg-[#ef4444] text-white'
#     : isSelected
#     ? 'bg-[#10b981] text-white'           ← user-selected letter box (not yet checked)
#     : 'bg-[#1e2d45] text-[#e2e8f0]'
#
# After our mass swap they're both 'bg-[#f59e0b] text-white'.
# We want to swap ONLY the first one (showResult && opt.isCorrect) to light green.

# Use a more specific context match — find the first occurrence and replace it
# The line is:  showResult && opt.isCorrect ? 'bg-[#f59e0b] text-white'
# but we need to be careful because both occurrences are on the same className.

# Better approach: just match the literal sequence (which appears exactly twice)
# and only swap the first one.

import re as _re
pattern_letter_box_correct = _re.compile(
    r"(showResult && opt\.isCorrect\s*\n\s*\?\s*'bg-\[#f59e0b\] text-white')",
    _re.MULTILINE,
)
m = pattern_letter_box_correct.search(content)
if m:
    content = content[:m.start()] + m.group(1).replace('bg-[#f59e0b] text-white', 'bg-[#6ee7b7] text-[#062a17]') + content[m.end():]
    print("✓ Swapped MCQ correct-answer letter box → light green")
else:
    print("⚠ MCQ correct-answer letter box pattern not found")

# Pattern 3: The big "✓" check mark next to the question id (when correct):
#   state.isChecked && state.isCorrect === true ? 'bg-[#10b981] text-white'
# After swap: 'bg-[#f59e0b] text-white'
# We want this to also be light green for "correct" feedback.
# This pattern occurs in: status box of the question header.
content = content.replace(
    "state.isChecked && state.isCorrect === true\n            ? 'bg-[#f59e0b] text-white'\n            : state.isChecked && state.isCorrect === false\n            ? 'bg-[#ef4444] text-white'\n            : state.isChecked\n            ? 'bg-[#f59e0b] text-white'\n            : state.isSolutionRevealed\n            ? 'bg-[#d97706] text-white'\n            : 'bg-[#1a2235] border border-[#1e2d45] text-[#d97706]'",
    "state.isChecked && state.isCorrect === true\n            ? 'bg-[#6ee7b7] text-[#062a17]'\n            : state.isChecked && state.isCorrect === false\n            ? 'bg-[#ef4444] text-white'\n            : state.isChecked\n            ? 'bg-[#f59e0b] text-white'\n            : state.isSolutionRevealed\n            ? 'bg-[#d97706] text-white'\n            : 'bg-[#1a2235] border border-[#1e2d45] text-[#d97706]'",
)

# Pattern 4: statusColor / statusBg in QuestionCard
# statusColor: when correct → '#10b981' → '#f59e0b' (after mass swap)
# We want correct answer highlight to be light green: '#6ee7b7'
# Original IoT code:
#   const statusColor = state.isChecked
#     ? state.isCorrect === true
#       ? '#10b981'
#       : state.isCorrect === false
#       ? '#ef4444'
#       : '#f59e0b'
#     : state.isSolutionRevealed
#     ? '#059669'
#     : '#1e2d45'
# After mass swap (10b981→f59e0b, 059669→d97706):
#   const statusColor = state.isChecked
#     ? state.isCorrect === true
#       ? '#f59e0b'       ← correct answer border color
#       : state.isCorrect === false
#       ? '#ef4444'
#       : '#f59e0b'
#     : state.isSolutionRevealed
#     ? '#d97706'
#     : '#1e2d45'
# We want the "isCorrect === true" branch to be light green: '#6ee7b7'
content = content.replace(
    "const statusColor = state.isChecked\n    ? state.isCorrect === true\n      ? '#f59e0b'\n      : state.isCorrect === false\n      ? '#ef4444'\n      : '#f59e0b'\n    : state.isSolutionRevealed\n    ? '#d97706'\n    : '#1e2d45'",
    "const statusColor = state.isChecked\n    ? state.isCorrect === true\n      ? '#6ee7b7'\n      : state.isCorrect === false\n      ? '#ef4444'\n      : '#f59e0b'\n    : state.isSolutionRevealed\n    ? '#d97706'\n    : '#1e2d45'",
)

# statusBg: when correct → 'rgba(16,185,129,0.05)' → 'rgba(245,158,11,0.05)' (after mass swap)
# We want correct → light green: 'rgba(16,185,129,0.10)' (slightly stronger for visibility)
content = content.replace(
    "const statusBg = state.isChecked\n    ? state.isCorrect === true\n      ? 'rgba(245,158,11,0.05)'\n      : state.isCorrect === false\n      ? 'rgba(239,68,68,0.05)'\n      : 'rgba(245,158,11,0.05)'\n    : 'transparent'",
    "const statusBg = state.isChecked\n    ? state.isCorrect === true\n      ? 'rgba(16,185,129,0.10)'\n      : state.isCorrect === false\n      ? 'rgba(239,68,68,0.05)'\n      : 'rgba(245,158,11,0.05)'\n    : 'transparent'",
)

# Pattern 5: The Feedback Message "isCorrect === true" branch
# In IoT:
#   bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#6ee7b7]
# After mass swap:
#   bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#fcd34d]
# We want correct feedback to be light green:
#   bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#6ee7b7]
content = content.replace(
    "state.isCorrect === true\n                  ? 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#fcd34d]'\n                  : state.isCorrect === false\n                  ? 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] text-[#fca5a5]'\n                  : 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#fcd34d]'",
    "state.isCorrect === true\n                  ? 'bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-[#6ee7b7]'\n                  : state.isCorrect === false\n                  ? 'bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] text-[#fca5a5]'\n                  : 'bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] text-[#fcd34d]'",
)

# Pattern 6: The "Model Solution" panel — keep this ORANGE (it's a solution, not necessarily a correct answer)
# In IoT the solution panel uses light green. After swap it uses light orange. KEEP it orange.

# Pattern 7: The Fill-in-the-blank "isCorrect" branch
# In IoT: 'bg-[rgba(16,185,129,0.1)] border-[#10b981] text-[#10b981]' → after swap: 'bg-[rgba(245,158,11,0.1)] border-[#f59e0b] text-[#f59e0b]'
# We want correct fill answer to be light green:
content = content.replace(
    "state.isChecked && isCorrect\n                          ? 'bg-[rgba(245,158,11,0.1)] border-[#f59e0b] text-[#f59e0b]'\n                          : isWrong\n                          ? 'bg-[rgba(239,68,68,0.1)] border-[#ef4444] text-[#ef4444] line-through'\n                          : 'bg-[#0d1117] border-[#1e2d45] text-[#e2e8f0] focus:border-[#d97706] focus:shadow-[0_0_10px_rgba(245,158,11,0.1)]'",
    "state.isChecked && isCorrect\n                          ? 'bg-[rgba(16,185,129,0.1)] border-[#6ee7b7] text-[#6ee7b7]'\n                          : isWrong\n                          ? 'bg-[rgba(239,68,68,0.1)] border-[#ef4444] text-[#ef4444] line-through'\n                          : 'bg-[#0d1117] border-[#1e2d45] text-[#e2e8f0] focus:border-[#d97706] focus:shadow-[0_0_10px_rgba(245,158,11,0.1)]'",
)

# Fill-in-the-blank "answer shown after wrong" hint color (originally #10b981):
content = content.replace(
    'className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f59e0b] font-mono text-sm font-bold"',
    'className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6ee7b7] font-mono text-sm font-bold"',
)

# Pattern 8: Confetti colors — keep multicolored (already has orange, red, pink, green)
# No change needed.

# Pattern 9: Header stats "Correct" counter — keep orange (it's a stat, not answer feedback)
# After mass swap it's #f59e0b (orange). Good.

# Pattern 10: Score panel — the grade color when pct >= 80 stays green (correct = good grade)
# In IoT: const gradeColor = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'
# After mass swap: const gradeColor = pct >= 80 ? '#f59e0b' : pct >= 60 ? '#f59e0b' : '#ef4444'
# We want grade>=80 to be light green (success indicator)
content = content.replace(
    "const gradeColor = pct >= 80 ? '#f59e0b' : pct >= 60 ? '#f59e0b' : '#ef4444'",
    "const gradeColor = pct >= 80 ? '#6ee7b7' : pct >= 60 ? '#f59e0b' : '#ef4444'",
)

# Score circle: the SVG gradient stops — originally #10b981, #059669 (green) → #f59e0b, #d97706 (orange)
# The percentage text gradient: from-[#059669] to-[#10b981] → from-[#d97706] to-[#f59e0b]
# We want to KEEP the orange theme for the score circle (it's the brand color, not answer feedback)
# Actually, since the score represents "correctness", we COULD make it green. But the user said
# "exam color is orange, only correct ANSWER shows light green". A high score is technically a
# correct overall result, so let's keep the score circle orange to match the exam theme.
# Leave as-is after mass swap.

# Score stats grid: "Correct" number colored #10b981 → #f59e0b (orange). Keep orange.
# Score stats grid: "Unanswered" #059669 → #d97706 (orange). Keep orange.
# Score stats grid: "Total" #10b981 → #f59e0b (orange). Keep orange.
# Score stats grid: "Time Taken" #10b981 → #f59e0b (orange). Keep orange.

# ── Step 4: Footer / branding updates ─────────────────────────────────────
content = content.replace(
    'IoT Quiz — <span className="text-[#d97706]">Mahmoud ABD ELKream</span>',
    'Microsoft Office Quiz — <span className="text-[#d97706]">Mahmoud ABD ELKream</span>',
)

# ── Step 5: Update subjects config used in ReviewPanel ────────────────────
content = content.replace(
    'subjectName="Internet of Things (IoT)"\n            subjectColor="#10b981"',
    'subjectName="Microsoft Office"\n            subjectColor="#f59e0b"',
)

# The header "Sections: 5" hardcoded — count dynamically. Actually it's already using sections.length? No.
# Looking at IoT line 377: <div className="text-2xl font-black text-[#10b981]">5</div>
# That's a hardcoded "5". After mass swap it's "text-[#f59e0b]">5</div>".
# We need to use sections.length for MS Office (9 sections).
content = content.replace(
    '<div className="text-2xl font-black text-[#f59e0b]">5</div>',
    '<div className="text-2xl font-black text-[#f59e0b]">{sections.length}</div>',
)

# ── Step 6: Write output ──────────────────────────────────────────────────
DST.parent.mkdir(parents=True, exist_ok=True)
DST.write_text(content, encoding='utf-8')

print(f"\n✓ Generated {DST}")
print(f"  Original: {SRC.stat().st_size:,} bytes")
print(f"  New:      {DST.stat().st_size:,} bytes")
print(f"\nColor replacements applied (mass swap):")
for pat, n in counts.items():
    if n > 0:
        print(f"  {pat} → {n} replacements")
