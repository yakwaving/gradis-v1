# Gradis

A quiz-first study app. It runs in the browser, installs on a phone like an app, and works offline.

- 12 question types: single choice, multiple select, true/false, fill in the blank, short answer, numeric, matching, ordering, diagram labelling, table completion, assertion–reason, and structured (extended) questions.
- Three modes: practice (feedback after each answer), exam (timer, answers at the end), study (explanations, not graded).
- Optional confidence rating on every question, with a separate calibration score.
- Results and in-progress quizzes are saved on the device. Nothing is sent anywhere.

## Run it on your computer

The app loads its quizzes from files, so it must be served over HTTP. Opening `index.html` by double-clicking will not work.

```
cd gradis-app
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Put it online (so it can be installed)

Upload the whole folder to any static host that uses HTTPS, for example GitHub Pages, Netlify or Cloudflare Pages. There is no build step.

**Install on a phone**
- Android (Chrome): open the site, then menu → *Install app* (or *Add to Home screen*).
- iPhone (Safari): open the site, then Share → *Add to Home Screen*.

After the first visit the app and all quizzes are saved on the phone and work with no internet.

## Add or change quizzes

1. Put a quiz file in `subjects/<Subject name>/quizNN.json` (see `docs/SPEC.md` for the format and a sample in `subjects/Quiz Types/`).
2. List it in `subjects-manifest.json`:

```json
{ "subjects": { "Physics": ["quiz00", "quiz01"] } }
```

Optional settings for a subject:

```json
{ "subjects": { "Physics": { "quizzes": ["quiz00"], "color": "#5b8cff", "dark": "#3a5fc4", "icon": "flask", "description": "Mechanics and waves" } } }
```

Icons available: `check`, `book`, `flask`, `chip`, `calc`. Without an icon the subject shows its first letter.

A question with a mistake (unknown type, missing field) is skipped, and the app shows a small notice. Details are in the browser console.

## Release an update

1. Change the `VERSION` line at the top of `sw.js` (for example `gradis-1.0.1`) and the `APP_VERSION` line in `js/util.js`.
2. Upload the files.

Installed apps show a "New version ready" message the next time they are opened with a connection. Saved results are kept.

## Good to know

- Results live in the browser's storage on that phone. Clearing the browser's site data, or uninstalling, removes them. The upload button on the Results screen saves a backup file.
- Structured (extended) questions are self-marked against the mark scheme. Automatic marking is planned.
- The font is DM Sans (SIL Open Font License, see `fonts/OFL.txt`). It is bundled, so nothing is loaded from the internet.
- The app icon is a simple placeholder in the app's own style. Replace the files in `icons/` to change it.
