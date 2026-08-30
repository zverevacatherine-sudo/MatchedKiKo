# KiKoGame — visually matched de-gamified control

This folder contains a de-gamified control condition derived from the current
KiKoGame JavaScript implementation.

## Experimental manipulation

Preserved:
- same 1200 × 700 canvas
- same `PICS/Background/cosmos4.png` visual background
- same question content, answer options, answer keys, and question order
- same dark quiz overlay
- same white answer boxes
- same general dark-blue / white interface language
- same five-section structure

Removed / neutralized:
- astronaut role takeover
- spaceship avatar and keyboard movement
- AIity / border-control / mission narrative
- moving background
- asteroids and collision challenge
- 3-life system
- healing keys / digital rewards
- progress display
- immediate correctness feedback after each section
- final score feedback
- mission-completed achievement
- planet / docking end state
- background music and interaction sounds
- game-specific rules and pause mechanics

The score is still calculated internally and stored in:
`window.assessmentResult`
so it can later be connected to study-data collection without giving
performance feedback to the participant.

## Required existing asset

Copy this file from the current KiKoGame repository:

`PICS/Background/cosmos4.png`

The rest of the old `PICS` assets are not needed by this control version.

## GitHub

Recommended workflow:

1. Create a new branch, e.g. `matched-control`.
2. Put these files in the branch root.
3. Keep the existing `PICS/Background/cosmos4.png`.
4. IMPORTANT: use the exact lowercase filenames referenced by `index.html`.
   Vercel runs on a case-sensitive Linux environment.
5. Commit and push.

Suggested commit message:

`Add visually matched de-gamified control condition`

## Vercel

This is a static HTML/CSS/JavaScript app. No framework and no build command
are required.

1. Import the GitHub repository in Vercel.
2. Select the branch/project containing this version.
3. Framework preset: `Other` / static.
4. Build command: leave empty.
5. Output directory: leave empty (repository root).
6. Deploy.

Every push to the selected branch will create a new deployment.
