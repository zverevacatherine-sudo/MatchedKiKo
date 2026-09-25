class StartScreen {
    constructor(ctx) {
        this.ctx = ctx;

        this.btn_w = 560;
        this.btn_h = 90;

        this.btn_start = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: 315,
            width: this.btn_w,
            height: this.btn_h
        };

        this.btn_info = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: 425,
            width: this.btn_w,
            height: this.btn_h
        };

        this.btn_prestudy = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: 535,
            width: this.btn_w,
            height: this.btn_h
        };
    }

    draw(prestudy_completed, info_completed) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.59)";
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        // Neutral Basic KiKo title — no game branding.
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "52px Comic Sans MS, Arial";

        this.ctx.fillText(
            "AI-Literacy Assessment",
            CONFIG.WIDTH / 2,
            200
        );

        const start_allowed =
            prestudy_completed && info_completed;

        // START
        this._drawButton(
            this.btn_start,
            "Start",
            start_allowed,
            false
        );

        // ASSESSMENT INFORMATION
        this._drawButton(
            this.btn_info,
            "Assessment information",
            prestudy_completed,
            false
        );

        // PRE STUDY
        this._drawButton(
            this.btn_prestudy,
            prestudy_completed
                ? "Pre Study completed"
                : "Pre Study",
            !prestudy_completed,
            prestudy_completed
        );
    }

    _drawButton(rect, label, active, completed) {
        this.ctx.fillStyle =
            active
                ? "rgb(39, 44, 78)"
                : "rgb(128, 128, 128)";

        drawRoundedRect(
            this.ctx,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            18
        );

        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;

        drawRoundedRect(
            this.ctx,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            18
        );

        this.ctx.stroke();

        this.ctx.fillStyle =
            active
                ? "white"
                : "rgb(96, 96, 96)";

        this.ctx.font =
            "40px Comic Sans MS, Arial";

        this.ctx.textAlign = "center";

        this.ctx.fillText(
            label,
            rect.x + rect.width / 2,
            rect.y + rect.height / 2 + 14
        );
    }

    handle_click(
        x,
        y,
        prestudy_completed,
        info_completed
    ) {
        if (
            !prestudy_completed &&
            pointInRect(
                x,
                y,
                this.btn_prestudy
            )
        ) {
            return "prestudy";
        }

        if (
            prestudy_completed &&
            pointInRect(
                x,
                y,
                this.btn_info
            )
        ) {
            return "info";
        }

        if (
            prestudy_completed &&
            info_completed &&
            pointInRect(
                x,
                y,
                this.btn_start
            )
        ) {
            return "start";
        }

        return null;
    }
}


class InfoScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.index = 0;

        // Preserve the Basic KiKo information pages.
        this.pages = [
            {
                title: "Assessment information",
                lines: [
                    "This assessment contains 15 multiple-choice questions.",
                    "The questions are grouped into five sections with three questions each.",
                    "Please select exactly one answer for every question."
                ]
            },
            {
                title: "Navigation",
                lines: [
                    "Click the section card to open a section.",
                    "After answering all three questions, click Continue.",
                    "The next section will then become available."
                ]
            },
            {
                title: "Completion",
                lines: [
                    "Please complete the assessment independently.",
                    "After all five sections, click the link to finalize the study."
                ]
            }
        ];

        this.next_rect = {
            x: CONFIG.WIDTH - 150,
            y: CONFIG.HEIGHT - 125,
            width: 85,
            height: 65
        };
    }

    open() {
        this.index = 0;
    }

    draw() {
        const page =
            this.pages[this.index];

        this.ctx.fillStyle =
            "rgba(0, 0, 0, 0.70)";

        this.ctx.fillRect(
            0,
            0,
            CONFIG.WIDTH,
            CONFIG.HEIGHT
        );

        this.ctx.fillStyle =
            "rgba(39, 44, 78, 0.96)";

        drawRoundedRect(
            this.ctx,
            100,
            95,
            1000,
            500,
            20
        );

        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;

        drawRoundedRect(
            this.ctx,
            100,
            95,
            1000,
            500,
            20
        );

        this.ctx.stroke();

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font =
            "42px Comic Sans MS, Arial";

        this.ctx.fillText(
            page.title,
            CONFIG.WIDTH / 2,
            175
        );

        this.ctx.font =
            "27px Comic Sans MS, Arial";

        page.lines.forEach(
            (line, i) => {
                this.ctx.fillText(
                    line,
                    CONFIG.WIDTH / 2,
                    285 + i * 65
                );
            }
        );

        this.ctx.fillStyle =
            "rgb(39, 44, 78)";

        drawRoundedRect(
            this.ctx,
            this.next_rect.x,
            this.next_rect.y,
            this.next_rect.width,
            this.next_rect.height,
            12
        );

        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;

        drawRoundedRect(
            this.ctx,
            this.next_rect.x,
            this.next_rect.y,
            this.next_rect.width,
            this.next_rect.height,
            12
        );

        this.ctx.stroke();

        this.ctx.fillStyle = "white";
        this.ctx.font = "32px Arial";

        // Keep the same simple rectangular navigation button.
        this.ctx.fillText(
            ">",
            this.next_rect.x +
                this.next_rect.width / 2,
            this.next_rect.y + 43
        );
    }

    handle_click(x, y) {
        if (
            !pointInRect(
                x,
                y,
                this.next_rect
            )
        ) {
            return null;
        }

        this.index++;

        if (
            this.index >=
            this.pages.length
        ) {
            return "done";
        }

        return "next";
    }
}
