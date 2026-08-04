# 07 — AI Matchmaking: Psychology-Based Compatibility Scoring

## Overview
Elite Tamil Matrimony uses a psychology-backed, mathematically-driven compatibility scoring system. No ML model is used in Phase 1 — scores are computed using weighted formulas based on established relationship psychology research (specifically the Gottman Institute compatibility factors and Indian matrimonial science principles).

When real user interaction data accumulates (favorites, messages, who contacts whom), a collaborative filtering ML layer will be added. Until then, the scoring is transparent, explainable, and deterministic.

---

## Psychological Framework

Based on research from:
- **Gottman Institute**: 7 principles for making marriage work
- **Big Five Personality Theory**: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
- **Indian Matrimonial Science**: Kootam (horoscope matching), Gotram compatibility, family values alignment
- **Sociological research**: Education/income parity, regional proximity, and value alignment predict long-term compatibility

---

## Scoring Factors (v1.0)

### Factor Weights (Total = 100%)

| Factor | Weight | Description |
|---|---|---|
| Community & Religion Match | 25% | Same religion, caste preference respected |
| Education Compatibility | 20% | Level parity, not identical — complementary |
| Age Compatibility | 15% | Within preferred range, biological clock consideration |
| Location Proximity | 15% | Same city > same state > same country |
| Lifestyle Alignment | 10% | Diet, smoking, drinking, sleep habits |
| Family Type Match | 8% | Joint/nuclear family preference alignment |
| Interest/Hobby Overlap | 4% | Shared leisure activities |
| Income Parity | 3% | Within ±30% range gets full score |

### Bonus Factors
- Both profiles verified → +5 bonus points
- Both premium members → profile surfaces in each other's top matches
- Bio sentiment analysis (positive bio scores higher) → up to +3 points

---

## Scoring Formula

```typescript
// Pseudocode — implemented in ai-service/scoring.py

function computeMatchScore(profileA, profileB, preferencesA, preferencesB):
  score = 0

  // Community (25%)
  if preferencesA.castePreference === "Any" or profileB.caste matches preferencesA.caste:
    score += 25
  elif profileB.religion === profileA.religion:
    score += 15  // partial credit: same religion, different caste

  // Education (20%)
  educationGap = abs(educationLevel(profileA) - educationLevel(profileB))
  score += max(0, 20 - educationGap * 5)  // lose 5pts per level gap, min 0

  // Age (15%)
  ageInRange = isWithinRange(profileB.age, preferencesA.ageMin, preferencesA.ageMax)
  score += ageInRange ? 15 : max(0, 15 - abs(profileB.age - nearestEdge) * 2)

  // Location (15%)
  if profileA.city === profileB.city: score += 15
  elif profileA.state === profileB.state: score += 10
  elif profileA.country === profileB.country: score += 6
  else: score += 2  // NRI bonus for NRI seekers

  // Lifestyle (10%)
  score += lifestyleScore(profileA, profileB) * 10  // 0.0 to 1.0

  // Family type (8%)
  if profileA.familyType === profileB.familyType: score += 8
  elif "Any" in [profileA.familyType, profileB.familyType]: score += 4

  // Interests (4%)
  overlap = intersection(profileA.interests, profileB.interests)
  score += min(4, overlap.length)

  // Income (3%)
  incomeDelta = abs(profileA.income - profileB.income) / max(profileA.income, 1)
  score += incomeDelta <= 0.3 ? 3 : incomeDelta <= 0.6 ? 1 : 0

  // Bonuses
  if profileA.isVerified and profileB.isVerified: score += 5
  
  return min(100, score)  // cap at 100
```

---

## Explainable Match Reasons

Every match card shows 2–3 human-readable reasons:

```typescript
function generateMatchReasons(profileA, profileB, score):
  reasons = []
  
  if communityScore > 20:
    reasons.push("Shared community values")
  if locationScore >= 10:
    reasons.push("Lives nearby in " + profileB.city)
  if educationScore >= 15:
    reasons.push("Similar educational background")
  if lifestyleScore >= 0.8:
    reasons.push("Compatible lifestyle choices")
  if interestOverlap >= 2:
    reasons.push("Common interests: " + overlap.join(", "))
  if ageScore === 15:
    reasons.push("Within your preferred age range")
  
  return reasons.slice(0, 3)
```

---

## Future ML Integration (Phase 5+)

When 10,000+ real interactions are logged:
1. **Collaborative filtering**: "Users like you connected with users like them"
2. **Interaction signal training**: Message sent, interest accepted, call connected = positive signal
3. **Embedding model**: Profile text embeddings (bio, occupation) for semantic similarity
4. **Feedback loop**: User feedback ("Not interested" reason) improves future recommendations

---

## Scoring API Endpoint

```
POST /api/ai/match-score
Body: { profileId: string, candidateId: string }
Response: {
  score: number,        // 0–100
  grade: string,        // "Excellent" / "Good" / "Fair"
  reasons: string[],    // 2–3 human-readable reasons
  breakdown: {          // detailed factor scores
    community: number,
    education: number,
    age: number,
    location: number,
    lifestyle: number,
    family: number,
    interests: number,
    income: number
  }
}
```
