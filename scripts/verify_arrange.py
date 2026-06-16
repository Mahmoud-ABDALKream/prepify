#!/usr/bin/env python3
"""Verify all arrange questions by trying all permutations of arrangeWords."""
import re
from itertools import permutations

with open('/home/z/my-project/src/data/te2-sections.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Match each arrange question block individually
# Pattern: { id: N, text: '...', marks: '...', type: 'arrange', arrangeWords: [...], answer: '...' }
pattern = re.compile(
    r"\{\s*id:\s*(\d+),\s*text:\s*'[^']*',\s*marks:\s*'[^']*',\s*type:\s*'arrange',\s*arrangeWords:\s*\[([^\]]+)\],\s*answer:\s*'([^']+)'",
    re.DOTALL
)

def parse_words(arr_str):
    return re.findall(r"'([^']*)'", arr_str)

def normalize(s):
    s = s.lower()
    s = re.sub(r"[.,!?;:'\"()\[\]{}\-]", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s

matches = list(pattern.finditer(content))
print(f"Found {len(matches)} arrange questions\n")
print(f"{'QID':<6} {'#Words':<8} {'Status':<10} {'Correct Order'}")
print("-" * 100)

problems = []
for match in matches:
    qid = match.group(1)
    words_str = match.group(2)
    answer = match.group(3)
    words = parse_words(words_str)
    
    answer_norm = normalize(answer)
    
    # Try all permutations to find a valid order
    found = False
    correct_order = None
    n = len(words)
    # For n > 8, permutations get expensive (40320+). Cap at 8.
    if n <= 8:
        for perm in permutations(range(n)):
            sentence = ' '.join(words[i] for i in perm)
            if normalize(sentence) == answer_norm:
                found = True
                correct_order = [words[i] for i in perm]
                break
    else:
        # For longer sequences, use a smarter approach: try greedy matching
        # Split answer into words; for each phrase in arrangeWords, find its position
        ans_tokens = answer_norm.split()
        positions = []
        used = [False] * len(ans_tokens)
        for w in words:
            w_tokens = normalize(w).split()
            # Find this phrase in ans_tokens (consecutive match)
            for i in range(len(ans_tokens) - len(w_tokens) + 1):
                if not any(used[i:i+len(w_tokens)]) and ans_tokens[i:i+len(w_tokens)] == w_tokens:
                    positions.append((i, w))
                    for j in range(i, i+len(w_tokens)):
                        used[j] = True
                    break
        # If all words found and all answer tokens used, the question is solvable
        if len(positions) == len(words) and all(used):
            found = True
            positions.sort()
            correct_order = [p[1] for p in positions]
    
    status = "OK" if found else "FAIL"
    order_str = ' '.join(correct_order) if correct_order else 'N/A'
    
    if not found:
        problems.append((qid, words, answer))
    
    print(f"{qid:<6} {n:<8} {status:<10} {order_str[:90]}")

print("\n" + "=" * 100)
if not problems:
    print("All arrange questions have a valid ordering that matches the answer!")
else:
    print(f"Found {len(problems)} problems:")
    for qid, words, answer in problems:
        print(f"\nQuestion ID {qid}:")
        print(f"  Words:  {words}")
        print(f"  Answer: {answer}")
        print(f"  Answer (normalized): {normalize(answer)}")
