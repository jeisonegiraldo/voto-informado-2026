/**
 * Test exhaustivo de imparcialidad de la Brújula Electoral "A Ciegas" v2
 * Pool de 40 propuestas con selección aleatoria de 20 (5 por candidato)
 */

import { brujulaCardPool, selectAndShuffleBrujulaCards, type BrujulaCard } from '../src/data/brujula-cards';
import { calculateBrujulaResults, type BrujulaSwipe } from '../src/lib/brujula-scoring';
import type { CandidateId } from '../src/types/candidate';

const CANDIDATE_IDS: CandidateId[] = ['cepeda', 'espriella', 'valencia', 'fajardo'];
const NAMES: Record<CandidateId, string> = {
  cepeda: 'Cepeda   ', espriella: 'Espriella', valencia: 'Valencia ', fajardo: 'Fajardo  ',
};

// ═══════════════════════════════════════════
// TEST 1: Pool distribution
// ═══════════════════════════════════════════
console.log('═══════════════════════════════════════════');
console.log('TEST 1: Pool de cartas');
console.log('═══════════════════════════════════════════');

const countByCandidate: Record<string, number> = {};
for (const card of brujulaCardPool) {
  countByCandidate[card.candidateId] = (countByCandidate[card.candidateId] || 0) + 1;
}

console.log(`\n  Total pool: ${brujulaCardPool.length} propuestas`);
for (const cid of CANDIDATE_IDS) {
  console.log(`  ${NAMES[cid]}: ${countByCandidate[cid]} propuestas`);
}

const balanced = Object.values(countByCandidate).every(c => c === 10);
console.log(`\n  ${balanced ? '✅' : '❌'} Distribución: ${balanced ? '10 por candidato' : 'DESBALANCEADO'}`);

// ═══════════════════════════════════════════
// TEST 2: Secondary scores balance
// ═══════════════════════════════════════════
console.log('\n═══════════════════════════════════════════');
console.log('TEST 2: Balance de secondary scores (bonus recibido)');
console.log('═══════════════════════════════════════════');

const secBonus: Record<CandidateId, number> = { cepeda: 0, espriella: 0, valencia: 0, fajardo: 0 };
for (const card of brujulaCardPool) {
  if (card.secondaryScores) {
    for (const [cid, score] of Object.entries(card.secondaryScores)) {
      secBonus[cid as CandidateId] += score;
    }
  }
}

for (const cid of CANDIDATE_IDS) {
  console.log(`  ${NAMES[cid]}: +${secBonus[cid].toFixed(1)} bonus total del pool`);
}
const maxB = Math.max(...Object.values(secBonus));
const minB = Math.min(...Object.values(secBonus));
console.log(`\n  Rango: ${minB.toFixed(1)} — ${maxB.toFixed(1)} (diff: ${(maxB - minB).toFixed(1)})`);
console.log(`  ${(maxB - minB) <= 0.6 ? '✅' : '⚠️'} ${(maxB - minB) <= 0.6 ? 'Balanceado' : 'Revisar'}`);

// ═══════════════════════════════════════════
// TEST 3: Selection yields 5 per candidate
// ═══════════════════════════════════════════
console.log('\n═══════════════════════════════════════════');
console.log('TEST 3: Selección aleatoria (5 intentos)');
console.log('═══════════════════════════════════════════');

for (let t = 0; t < 5; t++) {
  const selected = selectAndShuffleBrujulaCards();
  const cnt: Record<string, number> = {};
  for (const c of selected) {
    cnt[c.candidateId] = (cnt[c.candidateId] || 0) + 1;
  }
  const ids = selected.map(c => c.id);
  const isExact5 = CANDIDATE_IDS.every(cid => cnt[cid] === 5);
  console.log(`  Run ${t + 1}: ${selected.length} cartas, ${CANDIDATE_IDS.map(c => `${c[0].toUpperCase()}=${cnt[c]}`).join(' ')} ${isExact5 ? '✅' : '❌'}`);

  // Check no consecutive duplicates
  let consec = 0;
  for (let i = 1; i < selected.length; i++) {
    if (selected[i].candidateId === selected[i-1].candidateId) consec++;
  }
  if (consec > 0) console.log(`    ⚠️ ${consec} candidatos consecutivos repetidos`);
}

// ═══════════════════════════════════════════
// TEST 4: "Solo apruebo las de X" con selección aleatoria
// ═══════════════════════════════════════════
console.log('\n═══════════════════════════════════════════');
console.log('TEST 4: Aprobar SOLO propuestas de un candidato (100 sesiones cada uno)');
console.log('═══════════════════════════════════════════');

for (const targetCid of CANDIDATE_IDS) {
  let correct = 0;
  const RUNS = 100;

  for (let i = 0; i < RUNS; i++) {
    const selected = selectAndShuffleBrujulaCards();
    const swipes: BrujulaSwipe[] = selected.map(card => ({
      cardId: card.id,
      direction: card.candidateId === targetCid ? 'right' : 'left',
    }));
    const result = calculateBrujulaResults(swipes, brujulaCardPool);
    if (result.topCandidate === targetCid) correct++;
  }

  console.log(`  ${NAMES[targetCid]}: gana ${correct}/${RUNS} veces ${correct === RUNS ? '✅' : correct >= 95 ? '⚠️' : '❌'}`);
}

// ═══════════════════════════════════════════
// TEST 5: 10,000 sesiones totalmente aleatorias
// ═══════════════════════════════════════════
console.log('\n═══════════════════════════════════════════');
console.log('TEST 5: 10,000 sesiones aleatorias — distribución de ganadores');
console.log('═══════════════════════════════════════════');

const wins: Record<CandidateId, number> = { cepeda: 0, espriella: 0, valencia: 0, fajardo: 0 };
const SIMS = 10000;

for (let i = 0; i < SIMS; i++) {
  const selected = selectAndShuffleBrujulaCards();
  const swipes: BrujulaSwipe[] = selected.map(card => {
    const r = Math.random();
    return { cardId: card.id, direction: r < 0.4 ? 'right' : r < 0.8 ? 'left' : 'skip' };
  });
  const result = calculateBrujulaResults(swipes, brujulaCardPool);
  wins[result.topCandidate]++;
}

const expected = SIMS / 4;
console.log(`\n  Resultados (esperado ~25% cada uno):`);
for (const cid of CANDIDATE_IDS) {
  const pct = ((wins[cid] / SIMS) * 100).toFixed(1);
  const dev = (((wins[cid] - expected) / expected) * 100).toFixed(1);
  const fair = Math.abs(parseFloat(dev)) < 8;
  console.log(`  ${NAMES[cid]}: ${wins[cid].toString().padStart(5)} (${pct.padStart(5)}%) dev: ${dev.padStart(6)}% ${fair ? '✅' : '⚠️'}`);
}

// ═══════════════════════════════════════════
// TEST 6: Variedad entre sesiones
// ═══════════════════════════════════════════
console.log('\n═══════════════════════════════════════════');
console.log('TEST 6: Variedad — ¿diferentes cartas entre sesiones?');
console.log('═══════════════════════════════════════════');

const session1 = selectAndShuffleBrujulaCards().map(c => c.id).sort();
const session2 = selectAndShuffleBrujulaCards().map(c => c.id).sort();
const session3 = selectAndShuffleBrujulaCards().map(c => c.id).sort();

const overlap12 = session1.filter(id => session2.includes(id)).length;
const overlap13 = session1.filter(id => session3.includes(id)).length;
const overlap23 = session2.filter(id => session3.includes(id)).length;

console.log(`  Sesión 1 vs 2: ${overlap12}/20 cartas iguales (${((overlap12/20)*100).toFixed(0)}%)`);
console.log(`  Sesión 1 vs 3: ${overlap13}/20 cartas iguales (${((overlap13/20)*100).toFixed(0)}%)`);
console.log(`  Sesión 2 vs 3: ${overlap23}/20 cartas iguales (${((overlap23/20)*100).toFixed(0)}%)`);
console.log(`  ${overlap12 < 20 && overlap13 < 20 ? '✅' : '⚠️'} Las sesiones muestran propuestas diferentes`);

// ═══════════════════════════════════════════
console.log('\n═══════════════════════════════════════════');
console.log('RESUMEN');
console.log('═══════════════════════════════════════════');
