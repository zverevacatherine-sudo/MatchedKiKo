class Quiz {
    constructor(ctx) {
        this.ctx = ctx;
        this.quiz_active = false;
        this.list_of_questions = [];
        this.department_title = "";
        this.department_id = null;

        this.question_index = 0;
        this.correct_answered_q = 0;

        this.responses = [];
        this.answer_rects = [];

        this.scored_question_count = 0;
        this.attention_check_index = -1;

        this.continue_rect = {
            x: CONFIG.WIDTH / 2 - 200,
            y: CONFIG.HEIGHT / 2 + 120,
            width: 400,
            height: 70
        };
    }

    open_quiz(dept_data) {
        this.quiz_active = true;

        this.department_title =
            dept_data.title;

        this.department_id =
            dept_data.id;

        // Clone original content questions so the source assessment remains unchanged.
        this.list_of_questions =
            dept_data.questions.map(
                question => [
                    question[0],
                    [...question[1]],
                    question[2]
                ]
            );

        this.question_index = 0;
        this.correct_answered_q = 0;
        this.responses = [];

        this.scored_question_count =
            dept_data.questions.length;

        this.attention_check_index = -1;

        // Same in-study attention check as the gamified conditions.
        // It is added only to Section / Department 3 and does not count toward score.
        if (
            String(dept_data.id) ===
            "3"
        ) {
            this.attention_check_index =
                this.list_of_questions.length;

            this.list_of_questions.push([
                "Dear participant, please select \"Please answer here\".",
                [
                    "a) Continue",
                    "b) Please answer here",
                    "c) Next question",
                    "d) None of the above"
                ],
                1
            ]);
        }
    }

    close_quiz() {
        this.quiz_active = false;
    }

    wrap_to_three_lines(
        text,
        maxWidth
    ) {
        const words =
            text.split(" ");

        const lines = [
            "",
            "",
            ""
        ];

        let lineIndex = 0;
        let i = 0;

        while (
            i < words.length &&
            lineIndex < 3
        ) {
            const test =
                (
                    lines[lineIndex] +
                    " " +
                    words[i]
                ).trim();

            const width =
                measureText(
                    this.ctx,
                    test,
                    "28px Comic Sans MS, Arial"
                );

            if (
                width <= maxWidth
            ) {
                lines[lineIndex] =
                    test;

                i++;
            } else {
                lineIndex++;
            }
        }

        if (
            i < words.length
        ) {
            while (
                measureText(
                    this.ctx,
                    lines[2] + "...",
                    "28px Comic Sans MS, Arial"
                ) >
                    maxWidth &&
                lines[2].length > 0
            ) {
                lines[2] =
                    lines[2]
                        .slice(0, -1)
                        .trim();
            }

            lines[2] =
                (lines[2] || "") +
                "...";
        }

        return lines;
    }

    wrap_answer_to_two_lines(
        text,
        maxWidth
    ) {
        const words =
            text.split(" ");

        let line1 = "";
        let i = 0;

        while (
            i < words.length
        ) {
            const test =
                (
                    line1 +
                    " " +
                    words[i]
                ).trim();

            if (
                measureText(
                    this.ctx,
                    test,
                    "22px Comic Sans MS, Arial"
                ) <= maxWidth
            ) {
                line1 = test;
                i++;
            } else {
                break;
            }
        }

        let line2 = "";

        while (
            i < words.length
        ) {
            const test =
                (
                    line2 +
                    " " +
                    words[i]
                ).trim();

            if (
                measureText(
                    this.ctx,
                    test,
                    "22px Comic Sans MS, Arial"
                ) <= maxWidth
            ) {
                line2 = test;
                i++;
            } else {
                break;
            }
        }

        if (
            i < words.length
        ) {
            while (
                measureText(
                    this.ctx,
                    line2 + "...",
                    "22px Comic Sans MS, Arial"
                ) >
                    maxWidth &&
                line2.length > 0
            ) {
                line2 =
                    line2
                        .slice(0, -1)
                        .trim();
            }

            line2 += "...";
        }

        return [
            line1,
            line2
        ];
    }

    handle_click(x, y) {
        if (!this.quiz_active) {
            return null;
        }

        // Neutral completion screen: still no performance feedback.
        if (
            this.question_index >=
            this.list_of_questions.length
        ) {
            if (
                pointInRect(
                    x,
                    y,
                    this.continue_rect
                )
            ) {
                this.close_quiz();

                return "finished";
            }

            return null;
        }

        for (
            let i = 0;
            i < this.answer_rects.length;
            i++
        ) {
            const rect =
                this.answer_rects[i];

            if (
                !pointInRect(
                    x,
                    y,
                    rect
                )
            ) {
                continue;
            }

            const question =
                this.list_of_questions[
                    this.question_index
                ];

            const correct_idx =
                question[2];

            // Screening-only attention check in the third section.
            if (
                this.question_index ===
                this.attention_check_index
            ) {
                this.responses.push({
                    questionIndex:
                        this.question_index,
                    selectedIndex: i,
                    correct:
                        i === correct_idx,
                    attentionCheck: true
                });

                if (
                    i !== correct_idx
                ) {
                    this.close_quiz();

                    return "attention_failed";
                }

                this.question_index++;

                return "answered";
            }

            this.responses.push({
                questionIndex:
                    this.question_index,
                selectedIndex: i,
                correct:
                    i === correct_idx,
                attentionCheck: false
            });

            if (
                i === correct_idx
            ) {
                this.correct_answered_q++;
            }

            this.question_index++;

            return "answered";
        }

        return null;
    }

    draw() {
        if (!this.quiz_active) {
            return;
        }

        this.ctx.fillStyle =
            "rgba(0, 0, 0, 0.86)";

        this.ctx.fillRect(
            0,
            0,
            CONFIG.WIDTH,
            CONFIG.HEIGHT
        );

        if (
            this.question_index >=
            this.list_of_questions.length
        ) {
            this.ctx.fillStyle =
                "white";

            this.ctx.font =
                "30px Comic Sans MS, Arial";

            this.ctx.textAlign =
                "center";

            this.ctx.fillText(
                `${this.department_title} completed`,
                CONFIG.WIDTH / 2,
                CONFIG.HEIGHT / 2 - 40
            );

            // Basic condition intentionally shows no score/performance feedback.
            this.ctx.font =
                "23px Comic Sans MS, Arial";

            this.ctx.fillText(
                "Continue to the next section.",
                CONFIG.WIDTH / 2,
                CONFIG.HEIGHT / 2 + 10
            );

            this.ctx.fillStyle =
                "rgb(60, 60, 60)";

            drawRoundedRect(
                this.ctx,
                this.continue_rect.x,
                this.continue_rect.y,
                this.continue_rect.width,
                this.continue_rect.height,
                12
            );

            this.ctx.fill();

            this.ctx.strokeStyle =
                "rgb(200, 200, 200)";

            this.ctx.lineWidth = 1;

            drawRoundedRect(
                this.ctx,
                this.continue_rect.x,
                this.continue_rect.y,
                this.continue_rect.width,
                this.continue_rect.height,
                12
            );

            this.ctx.stroke();

            this.ctx.fillStyle =
                "white";

            this.ctx.font =
                "26px Comic Sans MS, Arial";

            this.ctx.fillText(
                "Continue",
                CONFIG.WIDTH / 2,
                this.continue_rect.y +
                    this.continue_rect.height /
                        2 +
                    10
            );

            return;
        }

        const [
            q,
            answers
        ] =
            this.list_of_questions[
                this.question_index
            ];

        this.ctx.fillStyle = "white";

        this.ctx.font =
            "22px Comic Sans MS, Arial";

        this.ctx.textAlign = "center";

        this.ctx.fillText(
            this.department_title,
            CONFIG.WIDTH / 2,
            110
        );

        const question_text =
            `Q${this.question_index + 1}/${this.list_of_questions.length}: ${q}`;

        const [
            q1,
            q2,
            q3
        ] =
            this.wrap_to_three_lines(
                question_text,
                1150
            );

        this.ctx.font =
            "28px Comic Sans MS, Arial";

        this.ctx.fillText(
            q1,
            CONFIG.WIDTH / 2,
            145
        );

        this.ctx.fillText(
            q2,
            CONFIG.WIDTH / 2,
            175
        );

        this.ctx.fillText(
            q3,
            CONFIG.WIDTH / 2,
            205
        );

        this.answer_rects = [];

        for (
            let i = 0;
            i < answers.length;
            i++
        ) {
            const rect = {
                x:
                    CONFIG.WIDTH / 2 -
                    550,
                y:
                    260 +
                    i * 95,
                width: 1100,
                height: 75
            };

            this.answer_rects.push(
                rect
            );

            this.ctx.fillStyle =
                "white";

            drawRoundedRect(
                this.ctx,
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                12
            );

            this.ctx.fill();

            this.ctx.strokeStyle =
                "rgb(200, 200, 200)";

            this.ctx.lineWidth = 1;

            drawRoundedRect(
                this.ctx,
                rect.x,
                rect.y,
                rect.width,
                rect.height,
                12
            );

            this.ctx.stroke();

            const [
                a1,
                a2
            ] =
                this.wrap_answer_to_two_lines(
                    answers[i],
                    1000
                );

            this.ctx.fillStyle =
                "black";

            this.ctx.font =
                "22px Comic Sans MS, Arial";

            this.ctx.textAlign =
                "center";

            if (a2 === "") {
                this.ctx.fillText(
                    a1,
                    rect.x +
                        rect.width /
                            2,
                    rect.y +
                        rect.height /
                            2 +
                        8
                );
            } else {
                this.ctx.fillText(
                    a1,
                    rect.x +
                        rect.width /
                            2,
                    rect.y +
                        rect.height /
                            2 -
                        12
                );

                this.ctx.fillText(
                    a2,
                    rect.x +
                        rect.width /
                            2,
                    rect.y +
                        rect.height /
                            2 +
                        20
                );
            }
        }
    }

    get_score() {
        return this.correct_answered_q;
    }

    get_responses() {
        return this.responses.slice();
    }
}
