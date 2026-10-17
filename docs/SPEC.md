# Gradis v2 – Quiz-first study app: specification

Status: version 1.0 is built. This document describes the quiz format and how the app behaves. See `README.md` for running, hosting and adding quizzes.

## 1. Scope

**Kept:** Practice (subjects → quizzes → landing → quiz → result → review), Results history, timers, Study Mode, grades and feedback messages, simple inline maths (`$2.5\ \text{m/s}^2$`, powers and `\times`).
**Dropped:** Notes tab and all notes, Firebase / Live rooms, sound effects and music, all old quizzes and subjects (replaced by the sample subject `Quiz Types`).
**New:** a quiz engine with 12 question types plus a reserved 13th (structured), per-question marks, partial credit, a confidence layer, and installable offline use.

## 2. Quiz file

```
title, description, difficulty, level, topic
timerType: "wholeQuiz" | "perQuestion"     totalTime: seconds
confidence: true | false                    (turns on the confidence layer for every question)
instructions: [text]
questions: [ ... ]
```

Total marks are computed from the questions, so `totalMarks` is no longer typed by hand.

## 3. Question types

Every question has `id`, `type`, `marks`, `question` (text, Markdown and `$maths$`), `explanation`, and optionally `image`, `imageAlt`, `hint`.

| Type | Student does | Extra fields | Marking |
|---|---|---|---|
| `single` | Picks one option (text or image) | `options`, `correct` (index) | Full marks or 0 |
| `multiple` | Ticks several options | `options`, `correct` (indexes), `scoring` | `all`: all-or-nothing. `partial`: +1 per right pick, −1 per wrong pick, floor 0, scaled to marks |
| `truefalse` | Taps True or False | `correct` (boolean) | Full or 0 |
| `fill` | Types into gaps marked `{{1}}`, `{{2}}` | `blanks: [{answers: [...]}]` | Marks split evenly across blanks |
| `short` | Types a word or phrase | `accepted` (list) | Full or 0 |
| `numeric` | Types a number and optionally a unit | `correct`, `tolerance {mode: percent/absolute, value}`, `unit`, `acceptedUnits` | Number within tolerance. Right number, wrong or missing unit: half marks when a `unit` is set |
| `matching` | Pairs left items with right items | `left`, `right`, `pairs [[l,r]]` (the right-hand items are always shown in a mixed order) | Marks split per correct pair |
| `ordering` | Drags items into order | `items`, `correctOrder`, `scoring` | `exact`: full only if perfect. `adjacent`: marks for each correct neighbouring pair |
| `labelling` | Drags labels onto a diagram | `image`, `labels`, `targets [{x, y, answer}]` (x, y are percentages of the image) | Marks split per target. Extra decoy labels are allowed |
| `grid` | Fills blank cells in a table | `columns`, `rows` of cells: `{given}` or `{answer: [...], choices?}` | Marks split per blank cell. `choices` turns a cell into a dropdown |
| `assertion` | Picks A–E | `assertion`, `reason`, `correct` | Full or 0 |
| `structured` | Answers parts (a), (b), (c) | `parts [{label, marks, question, markScheme}]`, `aiMarking: "later"` | For now: student self-marks against the mark scheme. Later: AI marking |

**Confidence** is a layer over any question, not a separate type. It is on when the quiz says `confidence: true`.

**Assertion–reason options (fixed for all questions):**
- A – both true, and the reason explains the assertion
- B – both true, but the reason does not explain it
- C – assertion true, reason false
- D – assertion false, reason true
- E – both false

**Normalising answers:** typed answers ignore capitals and extra spaces and accept every listed alternative. Numeric answers accept a decimal comma and ignore spaces inside the number.

## 4. Confidence scoring

Before checking an answer the student picks **Guess / Fairly sure / Certain**. Marks are never changed. A separate **calibration score** is shown on the result:

| | Guess | Fairly sure | Certain |
|---|---|---|---|
| Right | +0.5 | +1 | +2 |
| Wrong | 0 | −1 | −2 |

The result page also lists "Certain but wrong" questions first in review, because those are the misconceptions that matter most.

## 5. Diagram format (for labelling)

- Use an SVG (preferred, it stays sharp) or PNG, placed in `<quiz>images/`.
- `targets` use x and y as percentages (0–100) from the top-left corner, so they stay correct at any screen size.
- The image must carry no text for the labels being tested. The sample `circuit.svg` follows this rule.
- Keep targets at least 12% apart so fingers can hit them.

## 6. Modes

- **Exam:** timer, no hints, answers revealed only at the end.
- **Practice:** immediate feedback after each answer.
- **Study:** explanation shown first, nothing is graded.
- **Review:** every question shows the student's answer, the right answer and the explanation.

## 7. Installable web app

- A web app manifest (name, icons, colours, standalone display).
- A service worker that caches the app, the bundled font, and every quiz and diagram listed in `subjects-manifest.json`, so everything works offline after the first visit.
- Results and progress stored on the device (local storage), with an "export my results" option.
- A version number so updates show a "new version ready" message.
- Must be served over HTTPS to be installable.

## 8. File layout

```
index.html  manifest.webmanifest  sw.js  README.md
css/ (fonts.css, style.css)   fonts/ (DM Sans, OFL licence)   icons/
js/  util.js store.js marking.js screens.js quiz.js events.js main.js
subjects-manifest.json
subjects/<Subject>/quizNN.json  +  images/
docs/SPEC.md
```

## 9. Status

Built and tested in v1.0: all 12 question types, practice / exam / study modes, per-question marks and partial credit, the confidence layer and calibration score, saved results and "continue where you left off", home and results dashboards, installable offline use, and a self-marked structured question.

Not built yet: automatic marking of structured questions (planned AI step), importing results from a file, and sound.

## 10. Open items

- App name and icon (current icon is a placeholder in the app's own style).
- Whether labelling questions should include decoy labels (extra labels that match no target).
- Which AI service will mark structured questions, and whether answers may leave the device.
