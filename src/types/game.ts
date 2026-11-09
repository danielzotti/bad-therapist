export interface Patient {
  id: number;
  text: string;
}

export interface Therapy {
  id: number;
  text: string;
}

export interface GameData {
  patients: Patient[];
  therapies: Therapy[];
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  patientsCured: number;
  malpracticeCases: number;
}

export type GamePhase =
  | 'setup'         // Add/edit players, pick target score
  | 'pass_device'   // "Pass phone to [Player Name]"
  | 'read_patient'  // Therapist reads the dilemma out loud
  | 'prescribe'     // Swipe card with wacky therapy
  | 'result'        // Group verdict & score award
  | 'game_over';    // Podium / celebration

export interface RoundHistory {
  roundNumber: number;
  playerId: string;
  playerName: string;
  patient: Patient;
  therapy: Therapy;
  action: 'accepted' | 'rejected';
  scoreDelta: number;
}
