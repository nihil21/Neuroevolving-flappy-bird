// Probabilità di mutazione
const p_m = 0.01;
// Probabilità di crossover
const p_c = 0.7;

function evolve(birds, POPULATION_SIZE, latestGen) {
    calculateFitness(latestGen);

    for (let i = 0; i < POPULATION_SIZE; i += 2) {
        // Seleziono due individui dalla generazione precedente in base alla loro idoneità
        let birdA = poolSelection(latestGen);
        let birdB = poolSelection(latestGen);
        // Applico gli operatori crossover con probabilità p_c e mutazione con probabilità p_m
        let childs = birdA.crossover(birdB, p_c);
        childs[0].mutate(p_m);
        childs[1].mutate(p_m);
        birds[i] = childs[0];
        birds[i + 1] = childs[1];
    }

    latestGen.splice(0, latestGen.length);
}

function poolSelection(latestGen) {
    // Implementazione algoritmo di selezione proporzionale alla fitness ("metodo della roulette")
    let index = 0;
    let r = random(1);   // Fitness normalizzate, quindi la loro somma corrisponde a 1

    while (r > 0) {
        r = r - latestGen[index].fitness;
        index++;
    }
    index--;

    return latestGen[index];
}

function calculateFitness(latestGen) {
    let sum = 0;
    for (let bird of latestGen)
        sum += bird.score;

    for (let bird of latestGen)
        bird.fitness = bird.score / sum;
}