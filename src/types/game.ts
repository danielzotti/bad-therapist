export type Language = 'it' | 'en';

export interface Card {
  id: number;
  text: string;
}

export interface DeckData {
  questions: Card[];
  answers: Card[];
  treatments: Card[];
}

export interface GameData {
  it: DeckData;
  en: DeckData;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  hand: Card[]; // 5 Treatment cards
}

export interface SubmittedTreatment {
  playerId: string;
  card: Card;
  isDummy?: boolean;
}

export interface ComicStripState {
  question: Card | null;
  answer: Card | null;
  selectedTreatment: Card | null;
}

export type GamePhase =
  | 'setup'                  // Configure players, language, target score
  | 'pass_therapist'         // Pass phone to current therapist
  | 'therapist_setup'        // Therapist sets Panel 1 (Question) & Panel 2 (Answer)
  | 'pass_patient'           // Screen prompting to pass phone to next patient
  | 'patient_turn'           // Patient picks 1 treatment card from their hand of 5
  | 'pass_back_to_therapist' // Hand phone back to therapist
  | 'judging'                // Therapist reviews anonymous treatments & awards winner
  | 'round_result'           // Shows winning comic, reveals player, updates score
  | 'game_over';             // Winner podium & leaderboard
