# Basic KiKo – Study Flow Update

This version preserves the non-gamified Basic KiKo condition and adds the same
study-procedure logic used in the two gamified conditions.

## Added study-flow logic

1. `Pre Study` is the only active first step.
2. Pre Study contains:
   - three AI-literacy screening questions (correct: B, D, D)
   - one attention check
3. Pre Study exclusion:
   - attention check failed -> `C1F917Z4`
   - all three content questions wrong while attention check is passed -> `CT8ALQ35`
   - if both fail, attention failure takes priority -> `C1F917Z4`
4. After passing Pre Study, `Assessment information` becomes active.
5. After viewing Assessment information, `Start` becomes active.
6. Section 3 contains the same additional attention check.
   - it does not count toward the 15 content questions / score
   - failed attention check -> `C1F917Z4`
7. After all five sections, the neutral completion screen shows:
   - `Assessment completed`
   - `Continue with Experience Study:`
8. The button redirects to the configured Qualtrics URL.

## Change the Qualtrics URL

Open `main.js` and edit:

```javascript
this.experience_study_url =
    "https://qualtricsxmbx6typpy4.qualtrics.com/jfe/form/SV_0w8HiouRlacVJH0";
```

## Intentionally NOT added

To keep this condition genuinely non-gamified, this update does **not** add:

- background music
- department click sounds
- asteroid/comet mechanics
- lives / healing keys
- game score feedback
- Mission completed / AIity narrative
- timed/flying departments

Those remain differences between Basic KiKo and the gamified conditions.
