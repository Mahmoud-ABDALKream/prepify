#!/usr/bin/env python3
"""Revert TE2 colors back to blue (the user clarified they want blue)."""
import re

files = [
    '/home/z/my-project/src/app/technical-english-2/page.tsx',
    '/home/z/my-project/src/app/page.tsx',
    '/home/z/my-project/src/app/review/page.tsx',
    '/home/z/my-project/src/components/admin/SubjectsTab.tsx',
]

# Color mappings: green → blue
# Green: #10b981, #059669, #34d399, rgba(16,185,129,X)
# Blue: #3b82f6, #2563eb, #93c5fd, rgba(59,130,246,X)
replacements = [
    (re.compile(r'#10b981', re.IGNORECASE), '#3b82f6'),
    (re.compile(r'#059669', re.IGNORECASE), '#2563eb'),
    (re.compile(r'#34d399', re.IGNORECASE), '#93c5fd'),
    (re.compile(r'rgba\(\s*16\s*,\s*185\s*,\s*129\s*,', re.IGNORECASE), 'rgba(59,130,246,'),
    (re.compile(r'rgb\(\s*16\s*,\s*185\s*,\s*129\s*\)', re.IGNORECASE), 'rgb(59,130,246)'),
]

for filepath in files:
    print(f"\nProcessing: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    counts = {}
    for pattern, replacement in replacements:
        new_content, n = pattern.subn(replacement, content)
        counts[pattern.pattern] = n
        content = new_content
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        total = sum(counts.values())
        print(f"  Replaced {total} occurrences:")
        for pat, n in counts.items():
            if n > 0:
                print(f"    {pat} -> {n}")
    else:
        print(f"  (no changes)")
