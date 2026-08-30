class Background {
    constructor() {
        this.image = null;
        this.imageLoaded = false;

        loadImage("Background/cosmos4.png")
            .then(img => {
                const canvas = document.createElement("canvas");
                canvas.width = CONFIG.WIDTH;
                canvas.height = CONFIG.HEIGHT;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
                this.image = canvas;
                this.imageLoaded = true;
            })
            .catch(() => {
                // The app still works if the asset has not yet been copied into the repo.
                this.imageLoaded = false;
            });
    }

    render(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, 0, 0);
        } else {
            ctx.fillStyle = "rgb(20, 24, 52)";
            ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        }
    }
}
