// One Letter for Your Day (Node 22, standard library only).
//
// The program writes exactly one letter, A to Z, to /output/entry.txt: the
// first letter of the word that describes the day. The judge reads two
// letters at a time and picks the one whose hidden word feels more vivid,
// funnier or more true, weighing in order: the letter stands for a real
// day-word; the word is vivid and specific, a sharp picture rather than a
// vague mood; the word is funny or surprising and lands at once; the word
// feels true to a real day; and the letter suits its word, the sharp pick
// rather than the obvious one. Obscurity for its own sake does not count.
//
// So the program keeps a small bank of candidate letters, each with the
// word a reader would hear behind it, scores each one deterministically on
// those five axes, and writes only the winner. No clock, no randomness, no
// network: both grader runs write the same single byte.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

type Candidate = {
  letter: string;
  word: string; // the word a reader hears behind the letter
  vivid: number; // the word calls up a sharp picture of the day
  funny: number; // funny or surprising, lands at once
  true: number; // feels true to a real day, not a performance
  fit: number; // the initial fits the word's sound and shape
  ambiguity: number; // 1 = one word owns the letter, 3 = several rivals
};

// Every candidate below is original, reasoned for this competition.
const BANK: Candidate[] = [
  {
    letter: 'Q',
    word: 'queueing',
    vivid: 5, // a whole day spent standing in lines: a scene, not a mood
    funny: 4, // the absurdity of a day measured in queues lands at once
    true: 5, // everyone has lost a day to a line
    fit: 5, // no other letter spells queueing; Q owns the word outright
    ambiguity: 1, // queueing (quiet is the only rival, and it is vague)
  },
  {
    letter: 'P',
    word: 'procrastinating',
    vivid: 5, // tabs open, deadline looming, nothing done: a sharp picture
    funny: 4, // the most relatable failure of the working day
    true: 5, // honest report of a day put off until tomorrow
    fit: 4, // P fits, but productive, perfect and peaceful rival it
    ambiguity: 3,
  },
  {
    letter: 'J',
    word: 'juggling',
    vivid: 4, // too many things in the air at once
    funny: 3, // a wry shrug of a day rather than a laugh
    true: 4, // a real shape of a busy day
    fit: 5, // juggling belongs to J and nothing else
    ambiguity: 2, // joyful and jittery are live rivals
  },
  {
    letter: 'K',
    word: 'knackered',
    vivid: 4, // flat-out spent, in one blunt word
    funny: 4, // the bluntness itself is the joke
    true: 4, // an honest end-of-day report
    fit: 4, // K fits knackered, but kaput splits the vote
    ambiguity: 2,
  },
  {
    letter: 'G',
    word: 'groggy',
    vivid: 4, // waking up foggy and staying that way
    funny: 3, // mildly funny, mostly a condition
    true: 4, // a real morning that never cleared
    fit: 4, // G fits, but great and grinding rival it
    ambiguity: 2,
  },
  {
    letter: 'Y',
    word: 'yawning',
    vivid: 3, // a bodily state more than a scene
    funny: 3, // a yawn is funny once, then just tired
    true: 4, // an honest tired day
    fit: 5, // yawning belongs to Y
    ambiguity: 1, // yawning (yikes is the only rival)
  },
  {
    letter: 'H',
    word: 'hangry',
    vivid: 4, // hungry and angry at once: a sharp state
    funny: 4, // the word itself is the joke
    true: 3, // true of an afternoon, less of a whole day
    fit: 4, // H fits, but happy and hectic rival it
    ambiguity: 3,
  },
  {
    letter: 'V',
    word: 'vibing',
    vivid: 3, // going with the flow, pleasant but unspecific
    funny: 3, // a vibe more than a punchline
    true: 3, // true of a lazy day, thin as a report
    fit: 4, // V fits, but victory rivals it
    ambiguity: 2,
  },
];

function score(c: Candidate): number {
  // The judge's order: vivid first, then funny and true, then fit; a
  // letter several words fight over reads vaguer, so ambiguity costs.
  return c.vivid * 3 + c.funny * 2 + c.true * 2 + c.fit * 2 - c.ambiguity * 3;
}

function pick(): Candidate {
  // Score each candidate once, then take the best: higher score wins, and
  // on a tie the less ambiguous letter wins (one word owns it), then the
  // earlier letter in the alphabet.
  const scored = BANK.map((c) => ({ c, s: score(c) }));
  let best = scored[0];
  for (const entry of scored.slice(1)) {
    if (
      entry.s > best.s ||
      (entry.s === best.s && entry.c.ambiguity < best.c.ambiguity) ||
      (entry.s === best.s &&
        entry.c.ambiguity === best.c.ambiguity &&
        entry.c.letter < best.c.letter)
    ) {
      best = entry;
    }
  }
  return best.c;
}

const winner = pick();
for (const c of BANK) {
  // Bank-wide validation: every candidate must be a single letter A-Z
  // with scores inside their 1–5 (ambiguity 1–3) ranges, so a typo in the
  // bank can never smuggle an invalid entry past the gate.
  if (!/^[A-Z]$/.test(c.letter)) throw new Error('bank entry is not one letter A-Z');
  for (const v of [c.vivid, c.funny, c.true, c.fit]) {
    if (!Number.isInteger(v) || v < 1 || v > 5) throw new Error('bank score out of range');
  }
  if (!Number.isInteger(c.ambiguity) || c.ambiguity < 1 || c.ambiguity > 3) {
    throw new Error('bank ambiguity out of range');
  }
}
if (!/^[A-Z]$/.test(winner.letter)) throw new Error('entry is not one letter A-Z');
mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), winner.letter, 'utf8');
