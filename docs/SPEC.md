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
| `code` | Taps blocks into the gaps of a code listing | `code` (gaps `{{1}}`, `{{2}}`…), `blocks` (answers plus decoys), `answers` (one block per gap, in order), optional `language` | Marks split per gap. A block can be used once; list it twice if it is needed twice. Indentation comes from the `code` text |
| `flowchart` | Places shapes and/or types text in a flowchart drawn from data | `nodes`, `edges`, optional `height`, `shapes` | Marks split across every asked item (each shape and each text box) |

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


## 6. Flowchart format

```json
{ "type": "flowchart", "marks": 3, "question": "…",
  "nodes": [
    { "id": "s", "shape": "terminator", "text": "Start", "x": 50, "y": 8 },
    { "id": "d", "shape": "decision", "x": 50, "y": 44, "ask": ["text"], "accepted": ["n > 0", "n > 0?"] },
    { "id": "p", "shape": "process", "text": "Print positive", "x": 22, "y": 70, "ask": ["shape"] }
  ],
  "edges": [ { "from": "s", "to": "d" }, { "from": "d", "to": "p", "label": "Yes", "via": [[22, 44]] } ] }
```

- The drawing is 100 units wide. `x`, `y` are the centre of a node in those units. The height is worked out, or set with `height`.
- `shape`: `terminator` (start/end), `process`, `decision`, `io` (input/output). Default sizes can be changed with `w` and `h`.
- `ask` makes a node part of the question: `["text"]` shows the shape and a box to type in; `["shape"]` shows the text and an empty dashed slot; `["shape","text"]` asks for both. Nodes without `ask` are drawn as given.
- Typed text ignores capitals and spaces. List every accepted wording in `accepted`.
- Edges run from one node to another with a straight or stepped line. For a line that must go around other nodes (a loop back), add `via`, a list of `[x, y]` points to pass through. `label` adds "Yes"/"No" text.

## 7. Code blocks format

```json
{ "type": "code", "marks": 3, "language": "Python", "question": "…",
  "code": "total = 0\nfor i in range({{1}}, 6):\n    total = total + {{2}}\nprint({{3}})",
  "blocks": ["1", "i", "total", "6", "0", "5"], "answers": ["1", "i", "total"] }
```

A gap can hold a short piece of code (`i`) or a whole line (`print("Even")`). Put the gap on its own line with the indentation you want to test.
