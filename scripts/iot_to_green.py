#!/usr/bin/env python3
"""Convert IoT page colors from purple/cyan to fully green.

Mirrors the TE2 blue theme approach: primary green (#10b981) + dark green (#059669),
keeping the orange/red/pink accents for status indicators (correct/wrong/star/etc).

Mapping:
  #7c3aed (purple primary)  → #10b981 (primary green)
  #00d4ff (cyan secondary)  → #059669 (dark green secondary)
  #8b5cf6 (light purple)    → #10b981 (primary green)
  #a78bfa (purple text)     → #34d399 (light green text)
  #c4b5fd (lighter purple)  → #6ee7b7 (lighter green text)
  #22d3ee (cyan text)       → #34d399 (light green text)
  rgba(0,212,255,X)  (cyan shadow)    → rgba(16,185,129,X)  (green shadow)
  rgba(124,58,237,X) (purple shadow)  → rgba(16,185,129,X)  (green shadow)
"""
import re

files = [
    '/home/z/my-project/src/app/iot/page.tsx',
]

replacements = [
    # Hex colors (case-insensitive)
    (re.compile(r'#7c3aed', re.IGNORECASE), '#10b981'),
    (re.compile(r'#00d4ff', re.IGNORECASE), '#059669'),
    (re.compile(r'#8b5cf6', re.IGNORECASE), '#10b981'),
    (re.compile(r'#a78bfa', re.IGNORECASE), '#34d399'),
    (re.compile(r'#c4b5fd', re.IGNORECASE), '#6ee7b7'),
    (re.compile(r'#22d3ee', re.IGNORECASE), '#34d399'),
    # RGBA cyan shadows → green
    (re.compile(r'rgba\(\s*0\s*,\s*212\s*,\s*255\s*,', re.IGNORECASE), 'rgba(16,185,129,'),
    # RGBA purple shadows → green
    (re.compile(r'rgba\(\s*124\s*,\s*58\s*,\s*237\s*,', re.IGNORECASE), 'rgba(16,185,129,'),
    # Plain rgb variants (just in case)
    (re.compile(r'rgb\(\s*0\s*,\s*212\s*,\s*255\s*\)', re.IGNORECASE), 'rgb(16,185,129)'),
    (re.compile(r'rgb\(\s*124\s*,\s*58\s*,\s*237\s*\)', re.IGNORECASE), 'rgb(16,185,129)'),
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
