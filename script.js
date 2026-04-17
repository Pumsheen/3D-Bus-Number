const recordBtn = document.getElementById("recordBtn");
const transcriptDiv = document.getElementById("transcript");
const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

function extractBusNumber(text) {
    text = text.toLowerCase();

    const wordMap = {
        zero:"0", one:"1", two:"2", three:"3", four:"4",
        five:"5", six:"6", seven:"7", eight:"8", nine:"9"
    };

    const letterMap = {
        a:"A", b:"B", c:"C", d:"D", e:"E", f:"F",
        g:"G", h:"H", i:"I", j:"J", k:"K", l:"L",
        m:"M", n:"N", o:"O", p:"P", q:"Q", r:"R",
        s:"S", t:"T", u:"U", v:"V", w:"W", x:"X",
        y:"Y", z:"Z"
    };

    for (let w in wordMap) text = text.replaceAll(w, wordMap[w]);
    for (let w in letterMap) text = text.replaceAll(w, letterMap[w]);

    text = text.replace(/\s+/g, "");
    const match = text.match(/[A-Z]*\d+[A-Z]*/);

    return match ? match[0] : null;
}

let recognition;
let isRecording = false;

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-SG";
} else {
    alert("Speech recognition not supported.");
}

recordBtn.addEventListener("click", () => {
    if (isRecording) {
        recognition.stop();
        recordBtn.textContent = "Start Recording";
    } else {
        recognition.start();
        recordBtn.textContent = "Stop Recording";
    }
    isRecording = !isRecording;
});

recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
    }

    transcriptDiv.innerText = transcript;

    let bus = extractBusNumber(transcript);

    if (bus) {
        transcriptDiv.innerHTML = "Bus Number: " + bus;

        fetch("https://threed-bus-number.onrender.com/bus", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ bus: bus })
        });
    } else {
        transcriptDiv.innerHTML = "No bus number detected.";
    }
};

copyBtn.onclick = () => {
    navigator.clipboard.writeText(transcriptDiv.innerText);
};

saveBtn.onclick = () => {
    const blob = new Blob([transcriptDiv.innerText], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "transcript.txt";
    link.click();
};

clearBtn.onclick = () => {
    transcriptDiv.innerHTML = "";
};

