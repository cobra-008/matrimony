// src/lib/compatibility.ts
// Central compatibility scoring engine — Elite Tamil Matrimony
// Implements 21-point scoring between two user profiles.

import {
  COMPATIBILITY_QUESTIONS,
  COMPATIBLE_PAIRS,
  type CompatibilityQuestion,
} from '@/data/compatibility-questions';

export interface CompatibilityAnswers {
  [questionId: string]: string; // questionId → answer value
}

export interface CompatibilityResult {
  score: number;           // e.g. 18
  maxScore: number;        // always 21
  percentage: number;      // 0–100
  matchedCategories: string[];
  compatibleAreas: string[];
  weakAreas: string[];
  explanation: string;
}

/**
 * Determines if two answers for the same question are compatible.
 * Full point:    exact match OR both are in COMPATIBLE_PAIRS for each other
 * Partial point: one-way compatibility (one prefers flexible/open)
 * No point:      direct conflict
 */
function getQuestionScore(
  q: CompatibilityQuestion,
  answerA: string | undefined,
  answerB: string | undefined
): number {
  // If either answer is missing, give 0
  if (!answerA || !answerB) return 0;

  // Exact match → full point
  if (answerA === answerB) return 1;

  // Bidirectional compatibility
  const aCompatible = COMPATIBLE_PAIRS[answerA] ?? [];
  const bCompatible = COMPATIBLE_PAIRS[answerB] ?? [];

  if (aCompatible.includes(answerB) && bCompatible.includes(answerA)) {
    return 1; // fully compatible
  }

  if (aCompatible.includes(answerB) || bCompatible.includes(answerA)) {
    return 0.5; // partially compatible
  }

  return 0; // conflict
}

/**
 * Calculate compatibility between two users.
 * Both users need their compatibility answers.
 */
export function calculateCompatibility(
  answersA: CompatibilityAnswers,
  answersB: CompatibilityAnswers
): CompatibilityResult {
  const maxScore = COMPATIBILITY_QUESTIONS.length; // 21
  let totalScore = 0;

  // Category-level tracking
  const categoryScores: Record<string, { scored: number; possible: number }> = {};

  for (const q of COMPATIBILITY_QUESTIONS) {
    const qScore = getQuestionScore(q, answersA[q.id], answersB[q.id]);
    totalScore += qScore * q.weight;

    if (!categoryScores[q.category]) {
      categoryScores[q.category] = { scored: 0, possible: 0 };
    }
    categoryScores[q.category].scored += qScore;
    categoryScores[q.category].possible += 1;
  }

  const percentage = Math.round((totalScore / maxScore) * 100);

  // Identify strong/weak categories
  const matchedCategories: string[] = [];
  const compatibleAreas: string[] = [];
  const weakAreas: string[] = [];

  for (const [category, { scored, possible }] of Object.entries(categoryScores)) {
    const pct = scored / possible;
    if (pct >= 0.7) {
      matchedCategories.push(category);
      compatibleAreas.push(category);
    } else if (pct < 0.4) {
      weakAreas.push(category);
    }
  }

  // Build explanation
  let explanation = '';
  if (compatibleAreas.length > 0) {
    const areas = compatibleAreas.slice(0, 3).join(', ');
    explanation = `Strong compatibility in ${areas}.`;
  }
  if (weakAreas.length > 0) {
    const weak = weakAreas.slice(0, 2).join(' and ');
    explanation += (explanation ? ' ' : '') + `May need to discuss ${weak}.`;
  }
  if (!explanation) {
    explanation = percentage >= 60
      ? 'Good overall compatibility with room to grow together.'
      : 'Different perspectives — open conversation will help.';
  }

  return {
    score: Math.round(totalScore),
    maxScore,
    percentage,
    matchedCategories,
    compatibleAreas,
    weakAreas,
    explanation,
  };
}

/**
 * Quick helper: given one user's answers and potential match's answers,
 * return the 0–100 percentage compatibility.
 */
export function getCompatibilityPercentage(
  answersA: CompatibilityAnswers,
  answersB: CompatibilityAnswers
): number {
  return calculateCompatibility(answersA, answersB).percentage;
}
