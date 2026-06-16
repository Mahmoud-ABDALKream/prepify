#!/usr/bin/env python3
"""Revert TE2 page colors from blue back to green."""
import re

files = [
    '/home/z/my-project/src/app/technical-english-2/page.tsx',
    '/home/z/my-project/src/app/page.tsx',
    '/home/z/my-project/src/app/review/page.tsx',
    '/home/z/my-project/src/components/admin/SubjectsTab.tsx',
]

# Color mappings: blue → green
# Blue: #3b82f6, #2563eb, #93c5fd, rgba(59,130,246,X)
# Green: #10b981, #059669, #34d399, rgba(16,185,129,X)
replacements = [
    # Hex colors (case-insensitive)
    (re.compile(r'#3b82f6', re.IGNORECASE), '#10b981'),
    (re.compile(r'#2563eb', re.IGNORECASE), '#059669'),
    (re.compile(r'#93c5fd', re.IGNORECASE), '#34d399'),
    # RGBA - both with and without spaces
    (re.compile(r'rgba\(\s*59\s*,\s*130\s*,\s*246\s*,', re.IGNORECASE), 'rgba(16,185,129,'),
    # Plain rgb (no alpha) - rare but possible
    (re.compile(r'rgb\(\s*59\s*,\s*130\s*,\s*246\s*\)', re.IGNORECASE), 'rgb(16,185,129)'),
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
        print(f"  ✓ Replaced {total} occurrences:")
        for pat, n in counts.items():
            if n > 0:
                print(f"    {pat} → {n} replacements")
    else:
        print(f"  (no changes)")
