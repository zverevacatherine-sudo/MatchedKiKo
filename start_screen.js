class StartScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.btn_w = 560;
        this.btn_h = 110;

        this.btn_start = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: CONFIG.HEIGHT / 2 - 15,
            width: this.btn_w,
            height: this.btn_h
        };

        this.btn_info = {
            x: CONFIG.WIDTH / 2 - this.btn_w / 2,
            y: CONFIG.HEIGHT / 2 + 120,
            width: this.btn_w,
            height: this.btn_h
        };
    }

    draw(start_allowed) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.59)";
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "58px Comic Sans MS, Arial";
        this.ctx.fillText(
            "AI Knowledge Assessment",
            CONFIG.WIDTH / 2,
            185
        );

        this.ctx.font = "25px Comic Sans MS, Arial";
        this.ctx.fillText(
            "Please read the assessment information before starting.",
            CONFIG.WIDTH / 2,
            235
        );

        this._drawButton(
            this.btn_start,
            "Start",
            start_allowed ? "rgb(39, 44, 78)" : "rgb(128, 128, 128)",
            start_allowed ? "white" : "rgb(96, 96, 96)"
        );

        if (!start_allowed) {
            this.ctx.font = "22px Comic Sans MS, Arial";
            this.ctx.fillStyle = "rgb(96, 96, 96)";
            this.ctx.fillText(
                "(Read the information first)",
                CONFIG.WIDTH / 2,
                this.btn_start.y + 82
            );
        }

        this._drawButton(
            this.btn_info,
            "Assessment information",
            "rgb(39, 44, 78)",
            "white"
        );
    }

    _drawButton(rect, text, bg, fg) {
        this.ctx.fillStyle = bg;
        drawRoundedRect(this.ctx, rect.x, rect.y, rect.width, rect.height, 18);
        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        drawRoundedRect(this.ctx, rect.x, rect.y, rect.width, rect.height, 18);
        this.ctx.stroke();

        this.ctx.fillStyle = fg;
        this.ctx.font = "42px Comic Sans MS, Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            text,
            rect.x + rect.width / 2,
            rect.y + rect.height / 2 + 15
        );
    }

    handle_click(x, y, start_allowed) {
        if (pointInRect(x, y, this.btn_start)) {
            return start_allowed ? "start" : null;
        }

        if (pointInRect(x, y, this.btn_info)) {
            return "info";
        }

        return null;
    }
}

class InfoScreen {
    constructor(ctx) {
        this.ctx = ctx;
        this.index = 0;
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
                    "There is no game task, mission, reward system, or performance feedback.",
                    "After all five sections, the assessment ends automatically."
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
        const page = this.pages[this.index];

        this.ctx.fillStyle = "rgba(0, 0, 0, 0.70)";
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

        this.ctx.fillStyle = "rgba(39, 44, 78, 0.96)";
        drawRoundedRect(this.ctx, 100, 95, 1000, 500, 20);
        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        drawRoundedRect(this.ctx, 100, 95, 1000, 500, 20);
        this.ctx.stroke();

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "42px Comic Sans MS, Arial";
        this.ctx.fillText(page.title, CONFIG.WIDTH / 2, 175);

        this.ctx.font = "27px Comic Sans MS, Arial";
        page.lines.forEach((line, i) => {
            this.ctx.fillText(line, CONFIG.WIDTH / 2, 285 + i * 65);
        });

        this.ctx.fillStyle = "rgb(39, 44, 78)";
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
        this.ctx.fillText(
            this.index === this.pages.length - 1 ? "✓" : ">",
            this.next_rect.x + this.next_rect.width / 2,
            this.next_rect.y + 43
        );
    }

    handle_click(x, y) {
        if (!pointInRect(x, y, this.next_rect)) return null;

        this.index++;
        if (this.index >= this.pages.length) {
            return "done";
        }

        return "next";
    }
}
