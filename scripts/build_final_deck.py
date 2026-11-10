#!/usr/bin/env python3
import json
import os
import sys

# Ensure scripts dir is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from cards_patient_full import PATIENT_CARDS
from cards_treatment_1 import TREATMENTS_1
from cards_treatment_2 import TREATMENTS_2
from cards_treatment_3 import TREATMENTS_3
from cards_treatment_4 import TREATMENTS_4
from cards_answers_full import ANSWERS

all_treatments = TREATMENTS_1 + TREATMENTS_2 + TREATMENTS_3 + TREATMENTS_4

print(f"Loaded Questions: {len(PATIENT_CARDS)}")
print(f"Loaded Treatments: {len(all_treatments)}")
print(f"Loaded Answers: {len(ANSWERS)}")

assert len(PATIENT_CARDS) == 200, f"Expected 200 questions, got {len(PATIENT_CARDS)}"
assert len(all_treatments) == 600, f"Expected 600 treatments, got {len(all_treatments)}"
assert len(ANSWERS) == 60, f"Expected 60 answers, got {len(ANSWERS)}"

# Check for duplicate Italian texts
def check_dupes(items, label):
    it_texts = set()
    en_texts = set()
    for i, (it, en) in enumerate(items):
        if it in it_texts:
            print(f"Warning: duplicate IT {label} #{i+1}: {it[:40]}...")
        if en in en_texts:
            print(f"Warning: duplicate EN {label} #{i+1}: {en[:40]}...")
        it_texts.add(it)
        en_texts.add(en)

check_dupes(PATIENT_CARDS, "question")
check_dupes(all_treatments, "treatment")
check_dupes(ANSWERS, "answer")

data = {
    "it": {
        "questions": [{"id": i + 1, "text": it} for i, (it, en) in enumerate(PATIENT_CARDS)],
        "answers": [{"id": i + 1, "text": it} for i, (it, en) in enumerate(ANSWERS)],
        "treatments": [{"id": i + 1, "text": it} for i, (it, en) in enumerate(all_treatments)]
    },
    "en": {
        "questions": [{"id": i + 1, "text": en} for i, (it, en) in enumerate(PATIENT_CARDS)],
        "answers": [{"id": i + 1, "text": en} for i, (it, en) in enumerate(ANSWERS)],
        "treatments": [{"id": i + 1, "text": en} for i, (it, en) in enumerate(all_treatments)]
    }
}

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
target_path = os.path.join(root_dir, "public", "data.json")
with open(target_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {target_path}!")
print(f"File size: {os.path.getsize(target_path) / 1024:.1f} KB")
