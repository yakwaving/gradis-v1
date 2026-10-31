# Writing quizzes for Gradis (rules)

## Trick and difficulty
Every quiz is tricky. Difficulty is the amount of trick:
- **Easy**: one light, fair trap (a near-miss option, a symbol that is easy to swap).
- **Medium**: traps plus boundary cases (zero, equal values, "from 3 to 7 inclusive").
- **Difficult**: several traps per question, several steps of reasoning, and error-finding in code.
Tricks are about the idea, never about wording. One defensible answer per question, and the explanation names the trap.

## Options
- Options in a multiple-choice question are within about 20% of each other in length. The right answer is not systematically the longest or the shortest.
- Wrong options are real mistakes people make. Same grammar and style for all options.

## Code
- Use the code panel for any listing: fenced code in text, `code`, `bugline`, `bugfix`.
- Error questions: one clear fix per faulty line. Use realistic bugs: counter not increased, sum starting at 1, product starting at 0, `<` for `<=`, missing base case, wrong loop end, swapped `DIV`/`MOD`.
- Compute every trace and number in code. Never by hand.

## Summary pages (v1.10.0)

A summary is a page between quizzes, shown **only in Study mode** (Practice and Exam skip it). It prepares the questions that follow.
- File `subjects/<Subject>/sumNN.json`, listed in the manifest `quizzes` array just before the first quiz it prepares: `{"kind":"summary","title","intro","builds","at","blocks":[{"kind","title","body" or "items"}]}`.
- Block kinds: `remember`, `formula`, `dont` (Don't forget), `hint`, `format` (The format of), `example`. Maths with `$...$`, code with backticks or fences.
- One summary covers a whole group of quizzes (all the trig formulae once, before the first sin question). Never repeat: a later page is written only if it adds something new, and `builds` names the earlier page it builds on. A single very hard quiz may get its own page.
- `at` (default 1): the question number the page appears before (inside that quiz).
- Not graded, not counted as a question. Study mode has a Previous button; Practice and Exam can go back to review a checked question read-only.

## Maths questions (v1.9.0)

Write maths between dollar signs (`$x^2$`, `$$\frac{a}{b}$$`); it is drawn with KaTeX.

- `math` — typed answer on a maths keypad, marked by **equivalence** (`(x-1)(x+1)` = `x^2-1`). Fields: `answer` (text, e.g. `"x^2-1"`), optional `accepted` (more forms), `form` (`"expanded"` or `"factorised"`: the form is checked too), `set: true` (answer is a list of numbers such as `"2, -3"`, order free, partial marks), `keys` (keypad keys to show). Typed syntax: `^` power, `/` fraction, `sqrt(`, `cbrt(`, `ln(`, `log(` (base 10), `log_2(x)`, `sin(`, `pi`, `e`, `abs`/`|x|`, `y=` prefixes are ignored, equations compare up to a constant factor.
- `stepline` — a worked solution (`steps`: TeX strings, optional `labels`); tap the faulty step(s) (`bugs`: step numbers).
- `stepfix` — tap the faulty step (`bug`), then choose the replacement step (`options` TeX, `correct`). Marks: 1 for the step, the rest for the fix.
- Every tricky maths question still gets a "Watch out:" sentence (sign errors, lost ±, domain limits, chain rule...).

## Notes in Practice mode

Give every quiz and every summary file the same `"chapter"` text (for example `"chapter": "Tenses"`). In Study mode the summary pages appear between questions as before. In Practice mode a **NOTES** button appears on each question and opens every summary of that chapter seen so far (so the forms are always at hand, even in quizzes that have no summary of their own). Exam mode never shows notes. Quizzes without a `chapter` only show the summaries placed just before them.

## Subject options in `subjects-manifest.json`

Besides `description`, `color`, `dark`, `icon` and `quizzes`, a subject can have:

- `"sample": true` — shows a SAMPLE tag and lists the subject under SAMPLES at the bottom of the Subjects tab (use it for demo content such as *Quiz Types*).
- `"hidden": true` — leaves the subject out of the Subjects tab entirely (its files stay in the manifest).
- `"chapters": { "Chapter 1": "Introduction to algorithms", "Chapter 2": "Flowcharts" }` — optional names for chapters. The key is the chapter text of the quizzes (their `"chapter"` field, or the title before "Quiz N"). The name shows under the chapter heading and on the Continue card. Chapters you leave out keep their plain title.

## Master book (optional, one per subject)

A master book is a reference book for a subject: one markdown file, opened from a blue **MASTER BOOK** button at the bottom of the subject's quiz list. A subject with no book shows no button.

To add one, write the file and name it on the subject in `subjects-manifest.json`:

```json
"FUNDAMENTALS OF ALGORITHMS": {
  "book": "subjects/FUNDAMENTALS OF ALGORITHMS/master-book.md",
  "quizzes": [ ... ]
}
```

What the reader understands:

| Markdown | Shown as |
|---|---|
| `# Title`, then one line | the title and subtitle in the book's header |
| `## 1. Section` | a tappable section row (the number is optional); sections open and close |
| `### Sub-heading` | a sub-heading inside the section |
| paragraphs, `- ` bullets, `1. ` lists | text and lists |
| `\| a \| b \|` tables with a `\|---\|---\|` line | scrollable tables |
| a fenced block tagged `pascal` | a code panel with colours and line numbers (`text` is labelled Pseudocode) |
| `**bold**`, `` `inline code` `` | bold and code, also inside tables and lists |
| a paragraph starting `**Trap:` or `**Traps:` | a yellow warning box |

The book has a search box that filters its sections. The file is saved for offline use when the app installs, so a book you add or change needs a new `VERSION` in `sw.js`, like any other file.
