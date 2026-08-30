class AssessmentApp {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = CONFIG.WIDTH;
        this.canvas.height = CONFIG.HEIGHT;

        this.state = "menu"; // menu | info | assessment | complete
        this.info_completed = false;

        this.background = new Background();
        this.start_screen = new StartScreen(this.ctx);
        this.info_screen = new InfoScreen(this.ctx);
        this.section_card = new SectionCard(this.ctx);
        this.quiz = new Quiz(this.ctx);

        this.current_section_index = 0;
        this.total_correct_answers = 0;
        this.responses = [];

        this.setupEventListeners();
        this.updateSectionCard();
        this.loop();
    }

    setupEventListeners() {
        this.canvas.addEventListener("click", (e) => {
            e.preventDefault();

            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            this.handleClick(x, y);
        });
    }

    handleClick(x, y) {
        if (this.state === "menu") {
            const action = this.start_screen.handle_click(
                x,
                y,
                this.info_completed
            );

            if (action === "info") {
                this.info_screen.open();
                this.state = "info";
            } else if (action === "start") {
                this.startNewAssessment();
                this.state = "assessment";
            }
            return;
        }

        if (this.state === "info") {
            const action = this.info_screen.handle_click(x, y);
            if (action === "done") {
                this.info_completed = true;
                this.state = "menu";
            }
            return;
        }

        if (this.state === "assessment") {
            if (this.quiz.quiz_active) {
                const result = this.quiz.handle_click(x, y);

                if (result === "finished") {
                    this.total_correct_answers += this.quiz.get_score();

                    this.responses.push({
                        sectionId: Departments[this.current_section_index].id,
                        sectionTitle: Departments[this.current_section_index].title,
                        responses: this.quiz.get_responses()
                    });

                    this.current_section_index++;

                    if (this.current_section_index >= Departments.length) {
                        this.finishAssessment();
                    } else {
                        this.updateSectionCard();
                    }
                }
                return;
            }

            const dept = this.section_card.handleClick(x, y);
            if (dept) {
                this.quiz.open_quiz(dept);
            }
        }
    }

    startNewAssessment() {
        this.current_section_index = 0;
        this.total_correct_answers = 0;
        this.responses = [];
        this.quiz.close_quiz();
        this.updateSectionCard();
    }

    updateSectionCard() {
        if (this.current_section_index < Departments.length) {
            this.section_card.setDepartment(
                Departments[this.current_section_index]
            );
        }
    }

    finishAssessment() {
        this.state = "complete";

        // Keep result data available for later study integration,
        // but do not show performance feedback to the participant.
        window.assessmentResult = {
            totalCorrect: this.total_correct_answers,
            totalQuestions: Departments.reduce(
                (sum, d) => sum + d.questions.length,
                0
            ),
            responses: this.responses
        };

        console.log("Assessment completed", window.assessmentResult);
    }

    drawAssessment() {
        if (this.quiz.quiz_active) {
            // Same background remains visually present underneath the quiz overlay.
            this.quiz.draw();
            return;
        }

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        this.section_card.draw();
    }

    drawComplete() {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "48px Comic Sans MS, Arial";
        this.ctx.fillText(
            "Assessment completed",
            CONFIG.WIDTH / 2,
            CONFIG.HEIGHT / 2 - 20
        );

        this.ctx.font = "28px Comic Sans MS, Arial";
        this.ctx.fillText(
            "Thank you for your participation.",
            CONFIG.WIDTH / 2,
            CONFIG.HEIGHT / 2 + 45
        );
    }

    loop() {
        this.ctx.clearRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        this.background.render(this.ctx);

        if (this.state === "menu") {
            this.start_screen.draw(this.info_completed);
        } else if (this.state === "info") {
            this.info_screen.draw();
        } else if (this.state === "assessment") {
            this.drawAssessment();
        } else if (this.state === "complete") {
            this.drawComplete();
        }

        requestAnimationFrame(() => this.loop());
    }
}

window.addEventListener("load", () => {
    window.assessmentApp = new AssessmentApp();
});
