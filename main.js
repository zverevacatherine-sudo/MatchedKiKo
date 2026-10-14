class AssessmentApp {
    constructor() {
        this.canvas =
            document.getElementById(
                "gameCanvas"
            );

        this.ctx =
            this.canvas.getContext(
                "2d"
            );

        this.canvas.width =
            CONFIG.WIDTH;

        this.canvas.height =
            CONFIG.HEIGHT;

        // menu | prestudy | info | assessment | complete | terminated
        this.state = "menu";

        this.prestudy_completed =
            false;

        this.info_completed =
            false;

        // Change the Basic-condition Qualtrics link here if needed.
        this.experience_study_url =
            "https://qualtricsxmtjzm33q3t.qualtrics.com/jfe/form/SV_571FLn7KZJm4pi6";

        this.continue_study_rect = {
            x:
                CONFIG.WIDTH / 2 -
                310,
            y: 445,
            width: 620,
            height: 78
        };

        this.background =
            new Background();

        this.start_screen =
            new StartScreen(
                this.ctx
            );

        this.prestudy_screen =
            new PreStudyScreen(
                this.ctx
            );

        this.info_screen =
            new InfoScreen(
                this.ctx
            );

        this.termination_screen =
            new TerminationScreen(
                this.ctx
            );

        this.section_card =
            new SectionCard(
                this.ctx
            );

        this.quiz =
            new Quiz(
                this.ctx
            );

        this.current_section_index =
            0;

        this.total_correct_answers =
            0;

        this.responses = [];

        this.prestudy_results = null;

        // Preserve Prolific identifiers if the assessment URL contains them.
        this.incoming_participant_params =
            this.getIncomingParticipantParams();

        this.setupEventListeners();

        this.updateSectionCard();

        this.loop();
    }


    setupEventListeners() {
        this.canvas.addEventListener(
            "click",
            e => {
                e.preventDefault();

                const rect =
                    this.canvas
                        .getBoundingClientRect();

                const scaleX =
                    this.canvas.width /
                    rect.width;

                const scaleY =
                    this.canvas.height /
                    rect.height;

                const x =
                    (
                        e.clientX -
                        rect.left
                    ) *
                    scaleX;

                const y =
                    (
                        e.clientY -
                        rect.top
                    ) *
                    scaleY;

                this.handleClick(
                    x,
                    y
                );
            }
        );
    }


    handleClick(x, y) {
        // START MENU
        if (
            this.state === "menu"
        ) {
            const action =
                this.start_screen
                    .handle_click(
                        x,
                        y,
                        this.prestudy_completed,
                        this.info_completed
                    );

            if (
                action ===
                "prestudy"
            ) {
                this.prestudy_screen
                    .open();

                this.state =
                    "prestudy";
            } else if (
                action ===
                "info"
            ) {
                this.info_screen.open();

                this.state =
                    "info";
            } else if (
                action ===
                "start"
            ) {
                this.startNewAssessment();

                this.state =
                    "assessment";
            }

            return;
        }


        // PRE STUDY
        if (
            this.state ===
            "prestudy"
        ) {
            const result =
                this.prestudy_screen
                    .handle_click(
                        x,
                        y
                    );

            if (
                result === "passed"
            ) {
                this.prestudy_completed =
                    true;

                this.prestudy_results =
                    this.prestudy_screen
                        .get_results();

                this.state =
                    "menu";
            } else if (
                result ===
                "attention_failed"
            ) {
                this.terminateParticipant(
                    "C1F917Z4"
                );
            } else if (
                result ===
                "content_failed"
            ) {
                this.terminateParticipant(
                    "CT8ALQ35"
                );
            }

            return;
        }


        // ASSESSMENT INFORMATION
        if (
            this.state === "info"
        ) {
            const action =
                this.info_screen
                    .handle_click(
                        x,
                        y
                    );

            if (
                action === "done"
            ) {
                this.info_completed =
                    true;

                this.state =
                    "menu";
            }

            return;
        }


        // EXCLUDED PARTICIPANT
        if (
            this.state ===
            "terminated"
        ) {
            return;
        }


        // FINAL SCREEN
        if (
            this.state ===
            "complete"
        ) {
            if (
                pointInRect(
                    x,
                    y,
                    this.continue_study_rect
                )
            ) {
                this.goToExperienceStudy();
            }

            return;
        }


        // MAIN ASSESSMENT
        if (
            this.state ===
            "assessment"
        ) {
            if (
                this.quiz.quiz_active
            ) {
                const result =
                    this.quiz
                        .handle_click(
                            x,
                            y
                        );

                if (
                    result ===
                    "attention_failed"
                ) {
                    this.terminateParticipant(
                        "C1F917Z4"
                    );

                    return;
                }

                if (
                    result ===
                    "finished"
                ) {
                    this.total_correct_answers +=
                        this.quiz
                            .get_score();

                    this.responses.push({
                        sectionId:
                            Departments[
                                this.current_section_index
                            ].id,
                        sectionTitle:
                            Departments[
                                this.current_section_index
                            ].title,
                        responses:
                            this.quiz
                                .get_responses()
                    });

                    this.current_section_index++;

                    if (
                        this.current_section_index >=
                        Departments.length
                    ) {
                        this.finishAssessment();
                    } else {
                        this.updateSectionCard();
                    }
                }

                return;
            }

            const dept =
                this.section_card
                    .handleClick(
                        x,
                        y
                    );

            if (dept) {
                this.quiz.open_quiz(
                    dept
                );
            }
        }
    }


    getIncomingParticipantParams() {
        const currentParams =
            new URLSearchParams(
                window.location.search
            );

        const result = {};

        [
            "PROLIFIC_PID",
            "STUDY_ID",
            "SESSION_ID"
        ].forEach(key => {
            const value =
                currentParams.get(key);

            if (value) {
                result[key] = value;
            }
        });

        return result;
    }


    buildStudyData() {
        const data = {
            condition: "basic",
            total_correct:
                this.total_correct_answers
        };

        // Pre-study: three content questions + attention check.
        if (this.prestudy_results) {
            data.prestudy_score =
                this.prestudy_results
                    .contentCorrect;

            const preContent =
                this.prestudy_results
                    .responses
                    .filter(
                        response =>
                            !response
                                .attentionCheck
                    );

            preContent.forEach(
                (response, index) => {
                    const number =
                        index + 1;

                    data[
                        `pre_q${number}`
                    ] =
                        response
                            .selectedLetter;

                    data[
                        `pre_q${number}_correct`
                    ] =
                        response.correct
                            ? 1
                            : 0;
                }
            );

            const preAttention =
                this.prestudy_results
                    .responses
                    .find(
                        response =>
                            response
                                .attentionCheck
                    );

            if (preAttention) {
                data.pre_attention =
                    preAttention
                        .selectedLetter;

                data.pre_attention_correct =
                    preAttention.correct
                        ? 1
                        : 0;
            }
        }

        // Main assessment: flatten the 5 sections into Q1-Q15.
        let questionNumber = 1;
        let mainAttention = null;

        this.responses.forEach(
            section => {
                section.responses.forEach(
                    response => {
                        if (
                            response
                                .attentionCheck
                        ) {
                            mainAttention =
                                response;

                            return;
                        }

                        data[
                            `q${questionNumber}`
                        ] =
                            response
                                .selectedLetter;

                        data[
                            `q${questionNumber}_correct`
                        ] =
                            response.correct
                                ? 1
                                : 0;

                        questionNumber++;
                    }
                );
            }
        );

        if (mainAttention) {
            data.main_attention =
                mainAttention
                    .selectedLetter;

            data.main_attention_correct =
                mainAttention.correct
                    ? 1
                    : 0;
        }

        // Pass Prolific identifiers forward unchanged when available.
        Object.entries(
            this.incoming_participant_params
        ).forEach(
            ([key, value]) => {
                data[key] = value;
            }
        );

        return data;
    }


    buildExperienceStudyUrl() {
        const url =
            new URL(
                this.experience_study_url
            );

        const data =
            this.buildStudyData();

        Object.entries(
            data
        ).forEach(
            ([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null
                ) {
                    url.searchParams.set(
                        key,
                        String(value)
                    );
                }
            }
        );

        return url.toString();
    }


    goToExperienceStudy() {
        const targetUrl =
            this.buildExperienceStudyUrl();

        console.log(
            "Sending study data to Qualtrics:",
            this.buildStudyData()
        );

        window.location.href =
            targetUrl;
    }


    terminateParticipant(
        prolificCode =
            "C1F917Z4"
    ) {
        this.quiz.close_quiz();

        this.termination_screen
            .set_code(
                prolificCode
            );

        this.state =
            "terminated";
    }


    startNewAssessment() {
        this.current_section_index =
            0;

        this.total_correct_answers =
            0;

        this.responses = [];

        this.quiz.close_quiz();

        this.updateSectionCard();
    }


    updateSectionCard() {
        if (
            this.current_section_index <
            Departments.length
        ) {
            this.section_card
                .setDepartment(
                    Departments[
                        this.current_section_index
                    ]
                );
        }
    }


    finishAssessment() {
        this.state = "complete";

        // Keep performance data available for study integration,
        // but do NOT show it to the participant in the Basic condition.
        window.assessmentResult = {
            condition: "basic",

            totalCorrect:
                this.total_correct_answers,

            totalQuestions:
                Departments.reduce(
                    (
                        sum,
                        department
                    ) =>
                        sum +
                        department
                            .questions
                            .length,
                    0
                ),

            prestudy:
                this.prestudy_results,

            responses:
                this.responses,

            qualtricsData:
                this.buildStudyData()
        };

        console.log(
            "Assessment completed",
            window.assessmentResult
        );
    }


    drawAssessment() {
        if (
            this.quiz.quiz_active
        ) {
            this.quiz.draw();

            return;
        }

        this.ctx.fillStyle =
            "rgba(0, 0, 0, 0.18)";

        this.ctx.fillRect(
            0,
            0,
            CONFIG.WIDTH,
            CONFIG.HEIGHT
        );

        this.section_card.draw();
    }


    drawComplete() {
        this.ctx.fillStyle =
            "rgba(0, 0, 0, 0.55)";

        this.ctx.fillRect(
            0,
            0,
            CONFIG.WIDTH,
            CONFIG.HEIGHT
        );

        this.ctx.fillStyle =
            "white";

        this.ctx.textAlign =
            "center";

        this.ctx.font =
            "48px Comic Sans MS, Arial";

        this.ctx.fillText(
            "Assessment completed",
            CONFIG.WIDTH / 2,
            300
        );

        this.ctx.font =
            "28px Comic Sans MS, Arial";

        this.ctx.fillText(
            "Thank you for your participation.",
            CONFIG.WIDTH / 2,
            365
        );

        // Continue to Experience Study
        this.ctx.fillStyle =
            "rgb(39, 44, 78)";

        drawRoundedRect(
            this.ctx,
            this.continue_study_rect.x,
            this.continue_study_rect.y,
            this.continue_study_rect.width,
            this.continue_study_rect.height,
            16
        );

        this.ctx.fill();

        this.ctx.strokeStyle =
            "white";

        this.ctx.lineWidth = 2;

        drawRoundedRect(
            this.ctx,
            this.continue_study_rect.x,
            this.continue_study_rect.y,
            this.continue_study_rect.width,
            this.continue_study_rect.height,
            16
        );

        this.ctx.stroke();

        this.ctx.fillStyle =
            "white";

        this.ctx.font =
            "28px Comic Sans MS, Arial";

        this.ctx.fillText(
            "Continue with Experience Study:",
            CONFIG.WIDTH / 2,
            this.continue_study_rect.y +
                this.continue_study_rect.height /
                    2 +
                10
        );
    }


    loop() {
        this.ctx.clearRect(
            0,
            0,
            CONFIG.WIDTH,
            CONFIG.HEIGHT
        );

        this.background.render(
            this.ctx
        );

        if (
            this.state === "menu"
        ) {
            this.start_screen.draw(
                this.prestudy_completed,
                this.info_completed
            );
        } else if (
            this.state ===
            "prestudy"
        ) {
            this.prestudy_screen
                .draw();
        } else if (
            this.state === "info"
        ) {
            this.info_screen.draw();
        } else if (
            this.state ===
            "assessment"
        ) {
            this.drawAssessment();
        } else if (
            this.state ===
            "complete"
        ) {
            this.drawComplete();
        } else if (
            this.state ===
            "terminated"
        ) {
            this.termination_screen
                .draw();
        }

        requestAnimationFrame(
            () => this.loop()
        );
    }
}


window.addEventListener(
    "load",
    () => {
        window.assessmentApp =
            new AssessmentApp();
    }
);
