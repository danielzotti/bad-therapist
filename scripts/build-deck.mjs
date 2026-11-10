import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { PATIENT_CARDS } from './cards/patients.mjs';
import { TREATMENT_CARDS } from './cards/treatments.mjs';
import { ANSWER_CARDS } from './cards/answers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const targetPath = path.join(rootDir, 'public', 'data.json');

console.log(`Loaded Questions (Patients): ${PATIENT_CARDS.length}`);
console.log(`Loaded Treatments: ${TREATMENT_CARDS.length}`);
console.log(`Loaded Answers (Escalations): ${ANSWER_CARDS.length}`);

// Validations
if (PATIENT_CARDS.length !== 200) {
  throw new Error(`Expected 200 questions, got ${PATIENT_CARDS.length}`);
}
if (TREATMENT_CARDS.length !== 600) {
  throw new Error(`Expected 600 treatments, got ${TREATMENT_CARDS.length}`);
}
if (ANSWER_CARDS.length !== 60) {
  throw new Error(`Expected 60 answers, got ${ANSWER_CARDS.length}`);
}

// Duplicate checks
function checkDuplicates(deck, label) {
  const itSet = new Set();
  const enSet = new Set();

  for (let i = 0; i < deck.length; i++) {
    const [it, en] = deck[i];
    if (itSet.has(it)) {
      console.warn(`[Warning] Duplicate IT ${label} #${i + 1}: ${it.slice(0, 40)}...`);
    }
    if (enSet.has(en)) {
      console.warn(`[Warning] Duplicate EN ${label} #${i + 1}: ${en.slice(0, 40)}...`);
    }
    itSet.add(it);
    enSet.add(en);
  }
}

checkDuplicates(PATIENT_CARDS, 'question');
checkDuplicates(TREATMENT_CARDS, 'treatment');
checkDuplicates(ANSWER_CARDS, 'answer');

const data = {
  it: {
    questions: PATIENT_CARDS.map(([it], i) => ({ id: i + 1, text: it })),
    answers: ANSWER_CARDS.map(([it], i) => ({ id: i + 1, text: it })),
    treatments: TREATMENT_CARDS.map(([it], i) => ({ id: i + 1, text: it })),
  },
  en: {
    questions: PATIENT_CARDS.map(([, en], i) => ({ id: i + 1, text: en })),
    answers: ANSWER_CARDS.map(([, en], i) => ({ id: i + 1, text: en })),
    treatments: TREATMENT_CARDS.map(([, en], i) => ({ id: i + 1, text: en })),
  },
};

fs.writeFileSync(targetPath, JSON.stringify(data, null, 2), 'utf-8');

const stats = fs.statSync(targetPath);
console.log(`Successfully generated ${targetPath}`);
console.log(`File size: ${(stats.size / 1024).toFixed(1)} KB`);
