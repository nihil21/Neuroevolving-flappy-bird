const POPULATION_SIZE = 300;
let latestGen = [];
let birds = [];
let pipes = [];
let counter = 0;
let slider;

function setup() {
  tf.setBackend('cpu');
  
  let canvas = createCanvas(640, 480);
  canvas.parent("canvasDiv");

  slider = createSlider(1, 10, 1);
  slider.parent("slideDiv");
  for (let i = 0; i < POPULATION_SIZE; i++)
    birds[i] = new Bird();
}

function draw() {
  // Logica di gioco
  // Velocizzo lo scorrimento orizzontale a seconda del valore dello slider
  for (let n = 0; n < slider.value(); n++) {
    // Aggiungo coppie di ostacoli ogni intervallo prefissato
    if (counter % 100 == 0)
      pipes.push(new PipePair());
    counter++;

    // Per ogni ostacolo, verifico che non colpisca un giocatore
    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();

      // Il giocatore colpito viene salvato in un array di backup
      for (let j = birds.length - 1; j >= 0; j--) {
        if (pipes[i].hits(birds[j]) || birds[j].offscreen())
          latestGen.push(birds.splice(j, 1)[0]);
      }

      if (pipes[i].offscreen())
        pipes.splice(i, 1);
    }

    // Calcolo il miglior punteggio della generazione attuale
    let bestScoreRun = 0;
    for (let bird of birds) {
      // L'IA pensa a quale mossa fare
      bird.think(pipes);
      bird.update();
      if (bird.score > bestScoreRun)
        bestScoreRun = bird.score;
    }
    updateInfo(bestScoreRun, birds.length);

    if (birds.length === 0) {
      evolve(birds, POPULATION_SIZE, latestGen);
      pipes.splice(0, pipes.length);
      counter = 0;

      let span = document.getElementById("genNum");
      let genNum = 1 + parseInt(span.innerHTML);
      span.innerHTML = genNum;
    }
  }

  // Logica di disegno
  background("#33333D");

  for (let bird of birds)
    bird.show();

  for (let pipe of pipes)
    pipe.show();
}

function pause() {
  let pause = "resources/img/pause.png";
  let play = "resources/img/play.png";

  let img = document.getElementById('pause');
  let tokens = img.src.split("/");
  let status = tokens[tokens.length - 1];

  if (status === "pause.png") {
    img.src = play;
    noLoop();
  } else {
    img.src = pause;
    loop();
  }
}

function updateInfo(bestScoreRun, length) {
  document.getElementById("bestScoreRun").innerHTML = bestScoreRun;
  let bestScoreEver = parseInt(document.getElementById("bestScoreEver").innerHTML);
  if (bestScoreEver < bestScoreRun)
    document.getElementById("bestScoreEver").innerHTML = bestScoreRun;
  document.getElementById("birdsAlive").innerHTML = length;
}
