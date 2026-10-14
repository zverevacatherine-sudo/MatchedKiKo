# Basic KiKo – Response Tracking Update

This update records how each participant answered the Basic AI-Literacy assessment
and transfers the data to the following Qualtrics survey via URL parameters.

## Data sent to Qualtrics

Main assessment:
- `condition=basic`
- `q1` ... `q15` = selected answer letters A-D
- `q1_correct` ... `q15_correct` = 1 correct / 0 incorrect
- `total_correct` = total number correct (0-15)
- `main_attention` = selected answer letter in the Department 3 attention check
- `main_attention_correct` = 1 / 0

Pre Study:
- `pre_q1` ... `pre_q3` = selected answer letters
- `pre_q1_correct` ... `pre_q3_correct` = 1 / 0
- `prestudy_score` = number correct (0-3)
- `pre_attention` = selected answer letter
- `pre_attention_correct` = 1 / 0

If present in the incoming assessment URL, these are forwarded too:
- `PROLIFIC_PID`
- `STUDY_ID`
- `SESSION_ID`

## Change the Qualtrics link

In `main.js`, search for:

```javascript
this.experience_study_url =
    "YOUR QUALTRICS URL";
```

Replace only the URL.

## Qualtrics setup

In the destination Qualtrics survey, create Embedded Data fields in Survey Flow
for every variable listed above. Leave the values blank; Qualtrics will populate
them from the URL parameters.

Recommended minimum fields for performance analysis:
`condition`, `PROLIFIC_PID`, `prestudy_score`, `q1`-`q15`,
`q1_correct`-`q15_correct`, `total_correct`, `main_attention_correct`.

## Test

1. Complete the Basic assessment once.
2. Before clicking "Continue with Experience Study", open the browser console.
3. Click the button.
4. The console logs "Sending study data to Qualtrics".
5. In Qualtrics, complete the test response and check Data & Analysis.
