class PipePair {
    constructor() {
        this.width = 80;
        this.spacing = 120;

        this.x = width;
        this.y = 0;

        this.topH = random(height - this.spacing);
        this.bottomH = this.topH + this.spacing;

        this.speed = 6;
    }

    show() {
        stroke(255);
        fill(255, 207, 68);
        rect(this.x, this.y, this.width, this.topH);
        rect(this.x, this.bottomH, this.width, height - this.bottomH);
    }

    update() {
        this.x -= this.speed;
    }

    hits(bird) {
        let birdTop = bird.y - bird.radius;
        let birdBottom = bird.y + bird.radius;
        let birdRight = bird.x + bird.radius;
        let birdLeft = bird.x - bird.radius;

        // Verifico che il giocatore sia nel range dell'ostacolo 
        if (birdRight > this.x && birdLeft < this.x + this.width) {
            if (birdTop < this.topH || birdBottom > this.bottomH)
                return true;
            else {
                // Se attraversa gli ostacoli senza venire colpito, incremento ulteriormente il punteggio
                bird.score += 9;
                return false;
            }
        } else
            return false;
    }

    offscreen() {
        return this.x < -this.width;
    }
}