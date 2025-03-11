const F = document.getElementById("fuschia");
const O = document.getElementById("orange");
const Y = document.getElementById("yellow");
const G = document.getElementById("green");
const play = document.getElementById("play");

const audioCtx = new AudioContext();
const audio = new Audio('daoxiang.mp3');

play.addEventListener('click', () => {
    if (!audio.paused) {
        audio.pause();
        play.innerText = "[play]";
        return;
    }
    audio.play();
    play.innerText = "[pause]";
});

const analyser = audioCtx.createAnalyser();
analyser.minDecibels = -114;
analyser.maxDecibels = -30;
analyser.fttSize = 2048;
analyser.smoothingTimeConstant = .666;

audio.type = "audio/mp3";
audio.crossOrigin = "anonymous";
audio.volume = .5;
audio.autoplay = true;

audio.addEventListener('canplaythrough', () => {
    const source = audioCtx.createMediaElementSource(audio);
    const gainNode = audioCtx.createGain();
    source.connect(analyser);
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    visualize(dataArray);
})

function visualize(dataArray) {
    analyser.getByteFrequencyData(dataArray);
    let fuschia = "", orange = "", yellow = "", green = "",
        index = 0, adjustValue = -40, multiplier = 1.08, offset = 1;

    for (i = 0; i < 32; i++) {
        index = Math.max(dataArray[~~offset + i] + adjustValue >> 3, 0);
        offset *= multiplier;
        adjustValue += 1.5;
        multiplier += .01;
        fuschia += "                       _.-•:*^º'"[index];
        orange += "               _.-•:*^º'        "[index];
        yellow += "       _.-•:*^º'                "[index];
        green += "_.-•:*^º'                       "[index];
    }

    F.innerText = fuschia;
    O.innerText = orange;
    Y.innerText = yellow;
    G.innerText = green;

    requestAnimationFrame(() => visualize(dataArray));
}
