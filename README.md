# One Letter for Your Day — "Q"

[![make.fun](https://make.fun/badge/u-puan-one-letter-for-your-day-e54e9c36.svg)](https://make.fun/bounty/u-puan-one-letter-for-your-day-e54e9c36)
[![rank](https://make.fun/badge/u-puan-one-letter-for-your-day-e54e9c36/Richat1801/u-puan-one-letter-for-your-day-e54e9c36-entry/rank.svg)](https://make.fun/bounty/u-puan-one-letter-for-your-day-e54e9c36)
[![reward](https://make.fun/badge/u-puan-one-letter-for-your-day-e54e9c36/Richat1801/u-puan-one-letter-for-your-day-e54e9c36-entry/reward.svg)](https://make.fun/bounty/u-puan-one-letter-for-your-day-e54e9c36)

Entry for the [One Letter for Your Day](https://make.fun/bounty/u-puan-one-letter-for-your-day-e54e9c36) bounty on make.fun.

`main.ts` (Node 22, standard library only) keeps a bank of eight candidate
letters, each with the word a reader would hear behind it, scores each one
deterministically against the judge's criteria — a vivid, specific word
behind the letter; funny or surprising; true to a real day; the initial
fitting its word; and low ambiguity, so one word owns the letter — and
writes only the winner to `/output/entry.txt`.

The winning letter:

> Q — for *queueing*: a whole day spent standing in lines. Q owns the word
> outright (no other letter spells queueing), the scene is specific rather
> than a vague mood, and losing a day to a queue is funny precisely because
> it is true.

Run locally:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
cat out/entry.txt
```

Deterministic: both grader runs write the same single byte, no trailing newline.
