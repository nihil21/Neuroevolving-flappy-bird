class Bird {

    constructor() {
        this.x = 64;
        this.y = height / 2;
        this.radius = 12;

        this.gravity = 0.4;
        this.lift = 10;
        this.velocity = 0;

        this.score = 0;
        this.fitness;

        this.brain = new NeuralNetwork(5, 8, 2);
    }

    think(pipes) {
        let closestPipe = null;
        let distanceFromClosest = Infinity;
        for (let i = 0; i < pipes.length; i++) {
            let distance = pipes[i].x + pipes[i].width - this.x;
            if (distance < distanceFromClosest && distance > 0) {
                closestPipe = pipes[i];
                distanceFromClosest = distance;
            }
        }

        let inputs = [];
        inputs[0] = this.y / height;
        inputs[1] = this.velocity / 10;
        inputs[2] = closestPipe.topH / height;
        inputs[3] = closestPipe.bottomH / height;
        inputs[4] = closestPipe.x / width

        let outputs = this.brain.predict(inputs);
        if (outputs[0] > outputs[1])
            this.up();
    }

    show() {
        stroke(255);
        fill(255, 104, 89, 100);
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }

    update() {
        this.score++;

        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y < this.radius) {
            this.y = this.radius;
            this.velocity = 0;
        }
    }

    up() {
        this.velocity -= this.lift;
    }

    offscreen() {
        let birdBottom = this.y + this.radius;
        return birdBottom > height;
    }

    clone() {
        let cloneBird = new Bird();
        cloneBird.brain.dispose();
        cloneBird.brain = this.brain.clone();

        return cloneBird;
    }

    mutate(rate) {
        function fn(x) {
            if (Math.random() < rate)
                return x + randomGaussian() * 0.5;
            else
                return x;
        }

        this.brain.mutate(fn);
    }

    crossover(partner, rate) {
        let children = [];
        let childA = this.clone();
        let childB = this.clone();

        children.push(childA);
        children.push(childB);

        if (Math.random() < rate) {
            let parentA_ih_dna = this.brain.weights_ih.dataSync();
            let parentA_ho_dna = this.brain.weights_ho.dataSync();
            let parentB_ih_dna = partner.brain.weights_ih.dataSync();
            let parentB_ho_dna = partner.brain.weights_ho.dataSync();

            let crossPoint_ih = Math.floor(Math.random() * parentA_ih_dna.length);
            let crossPoint_ho = Math.floor(Math.random() * parentA_ho_dna.length);
            let childA_ih_dna = [...parentA_ih_dna.slice(0, crossPoint_ih), ...parentB_ih_dna.slice(crossPoint_ih, parentB_ih_dna.length)];
            let childA_ho_dna = [...parentA_ho_dna.slice(0, crossPoint_ho), ...parentB_ho_dna.slice(crossPoint_ho, parentB_ho_dna.length)];
            let childB_ih_dna = [...parentB_ih_dna.slice(0, crossPoint_ih), ...parentA_ih_dna.slice(crossPoint_ih, parentA_ih_dna.length)];
            let childB_ho_dna = [...parentB_ho_dna.slice(0, crossPoint_ho), ...parentA_ho_dna.slice(crossPoint_ho, parentA_ho_dna.length)];

            let wih_shape = this.brain.weights_ih.shape;
            let who_shape = this.brain.weights_ho.shape;

            childA.dispose();
            childA.brain.weights_ih = tf.tensor(childA_ih_dna, wih_shape);
            childA.brain.weights_ho = tf.tensor(childA_ho_dna, who_shape);
            childB.dispose();
            childB.brain.weights_ih = tf.tensor(childB_ih_dna, wih_shape);
            childB.brain.weights_ho = tf.tensor(childB_ho_dna, who_shape);
        }
        
        return children;
    }

    dispose() {
        this.brain.dispose();
    }
}
