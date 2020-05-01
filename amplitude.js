const ctx = document.getElementById("GameCanvas").getContext("2d");

const width = 1280;
const height = 720;

const elementRadius = 16;

const moveSpeed = 200;

const energyDecrease = 10;
const energyIncrease = 0;
const energyMaximum = 100;

const frequency = 5;
const amplitudeDefault = 100;
const amplitudeLow = 20;

const waveColourDefault = "red";
const waveColourLow = "blue";

const waveFrontPosition = width / 4;

const obsFrequency = 0.2;


let Amplitude = {};
let sawImage;

async function init() {

    sawImage = await loadImage("saw.png");
    restart();

}

function restart() {

    Amplitude = {};
    Amplitude.Wave = {
        energy: energyMaximum,
        front: height / 2,
        elements: []
    }
    Amplitude.Obs = {
        last: 0,
        elements: []
    };
    Amplitude.Time = 0;

}

function isUsing() {
    return keyDown(32);
}

function update(dt) {
    while (dt > 1 / 60) {
        dt -= 1 / 60
        updateFixed(1 / 60);
    }
    updateFixed(dt);
}

function updateFixed(dt) {

    const previousTime = Amplitude.Time;
    Amplitude.Time += dt;
    const newTime = Amplitude.Time;


    let gameOver = false;

    // are we using energy
    {
        let usingEnergy = false;
        if (isUsing() && Amplitude.Wave.energy > 0) {
            usingEnergy = true;
            Amplitude.Wave.energy -= energyDecrease * dt;
        } else {
            Amplitude.Wave.energy += energyIncrease * dt;
        }

        const difference = (Math.sin(newTime * frequency) - Math.sin(previousTime * frequency)) * (usingEnergy ? amplitudeLow : amplitudeDefault)
        Amplitude.Wave.front += difference;

        if ((Amplitude.Wave.front < -elementRadius * 2) || (Amplitude.Wave.front > height + elementRadius * 2)) {
            gameOver = true;
        }

        // move all wave elements back

        let removeNumber = 0;
        for (const element of Amplitude.Wave.elements) {
            element.x -= moveSpeed * dt;
            if (element.x < -elementRadius * 2) {
                removeNumber++;
            }
        }

        Amplitude.Wave.elements.splice(0, removeNumber);

        // create new wave front element
        const waveElement = {}
        waveElement.x = waveFrontPosition;
        waveElement.y = Amplitude.Wave.front;
        waveElement.colour = (usingEnergy ? waveColourLow : waveColourDefault);
        Amplitude.Wave.elements.push(waveElement)
    }



    {
        const distanceToDeath = (elementRadius + sawImage.width / 2) * (elementRadius + sawImage.width / 2);
        let removeNumber = 0;
        for (const element of Amplitude.Obs.elements) {
            element.x -= moveSpeed * dt;
            if (element.x < -sawImage.width * 2) {
                removeNumber++;
            }

            if (element.x < waveFrontPosition + elementRadius + sawImage.width / 2 && element.x > waveFrontPosition - elementRadius - sawImage.width / 2) {
                const xDiff = element.x - waveFrontPosition;
                const yDiff = element.y - Amplitude.Wave.front;
                if (xDiff * xDiff + yDiff * yDiff < distanceToDeath) {
                    gameOver = true;
                }
            }
        }
        Amplitude.Obs.elements.splice(0, removeNumber);

        if (Amplitude.Time - Amplitude.Obs.last >= obsFrequency) {
            const delta = Amplitude.Time - Amplitude.Obs.last - obsFrequency;
            Amplitude.Obs.last = Amplitude.Time + obsFrequency;
            const obs = {
                y: Math.random() * Math.floor(height),
                x: width + sawImage.width - moveSpeed * delta,
            };
            Amplitude.Obs.elements.push(obs);
        }
    }

    if (gameOver) {
        restart();
    }

}

function draw() {


    const barColour = (Amplitude.Wave.elements.length > 0 ? Amplitude.Wave.elements[Amplitude.Wave.elements.length - 1].colour : "red")
    drawNumber(Math.floor(Amplitude.Time), 5, 25, width - 10, height - 30, "black", 0.3)
    drawRectangle(5, 2, (width - 10) * Amplitude.Wave.energy / energyMaximum, 20, barColour, 1)

    drawBatchStart();
    let colour = (Amplitude.Wave.elements.length > 0 ? Amplitude.Wave.elements[Amplitude.Wave.elements.length - 1] : "");
    for (const waveElement of Amplitude.Wave.elements) {
        if (colour != waveElement.colour) {
            drawBatchEnd();
            drawBatchStart();
            colour = waveElement.colour;
        }
        drawCircle(waveElement.x, waveElement.y, elementRadius, waveElement.colour);
    }
    drawBatchEnd();

    const angle = -(Amplitude.Time % Math.PI * 2) * 2;
    for (const element of Amplitude.Obs.elements) {
        drawImage(sawImage, element.x, element.y, angle);

    }

}