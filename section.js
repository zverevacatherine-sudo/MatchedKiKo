class SectionCard {
    constructor(ctx) {
        this.ctx = ctx;
        this.department = null;
        this.rect = {
            x: CONFIG.WIDTH / 2 - 310,
            y: CONFIG.HEIGHT / 2 - 120,
            width: 620,
            height: 240
        };
    }

    setDepartment(department) {
        this.department = department;
    }

    handleClick(x, y) {
        if (this.department && pointInRect(x, y, this.rect)) {
            return this.department;
        }
        return null;
    }

    draw() {
        if (!this.department) return;

        // Keep the same dark-blue / white visual language as the original.
        this.ctx.fillStyle = "rgba(39, 44, 78, 0.94)";
        drawRoundedRect(
            this.ctx,
            this.rect.x,
            this.rect.y,
            this.rect.width,
            this.rect.height,
            18
        );
        this.ctx.fill();

        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 2;
        drawRoundedRect(
            this.ctx,
            this.rect.x,
            this.rect.y,
            this.rect.width,
            this.rect.height,
            18
        );
        this.ctx.stroke();

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.font = "34px Comic Sans MS, Arial";
        this.ctx.fillText(
            this.department.title,
            this.rect.x + this.rect.width / 2,
            this.rect.y + 95
        );

        this.ctx.font = "24px Comic Sans MS, Arial";
        this.ctx.fillText(
            "Click to open this assessment section",
            this.rect.x + this.rect.width / 2,
            this.rect.y + 155
        );
    }
}
