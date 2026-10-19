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

## Summary cards (planned)
3 to 6 short points, one idea each, a "Remember" line, only facts that the course states. Until the card exists, put it in the quiz `instructions`.
