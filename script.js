const recordBtn = document.getElementById("recordBtn");
const transcriptDiv =  document.getElementById("transcript");
const copyBtn = document.getElementById("copyBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

function extractBusNumber(text) {
    text = text.toLowerCase();

    //Convert word numbers -> digits
    const wordMap = {
        "zero":"0",
        "one":"1",
        "two":"2",
        "three":"3",
        "four":"4",
        "five": "5",
        "six": "6",
        "seven": "7",
        "eight": "8",
        "nine": "9"
    };

    //Convert letters -> Letters
    const letterMap = {
        "a": "A", "b": "B", "c": "C", "d": "D",
        "e": "E", "f": "F", "g": "G", "h": "H",
        "i": "I", "j": "J", "k": "K", "l": "L",
        "m": "M", "n": "N", "o": "O", "p": "P",
        "q": "Q", "r": "R", "s": "S", "t": "T",
        "u": "U", "v": "V", "w": "W", "x": "X",
        "y": "Y", "z": "Z"
    };

    for (let word in wordMap) {
        text = text.replaceAll(word,wordMap[word]);
    }

    // Replace letter words
    for (let word in letterMap) {
        text = text.replaceAll(word, letterMap[word]);
    }

    // Remove spaces (important for "1 0 A" → "10A")
    text = text.replace(/\s+/g, "");

    //Extract first number found
    let match = text.match(/[A-Z]*\d+[A-Z]*/);
    return match ? match[0] : null;
}

let recognition;
let isRecording = false;

if("webkitSpeechRecognition" in window){
    recognition=new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults =true;
    recognition.lang ="en-SG";
    console.log(recognition);
}else{
    alert("Speech recognition no supported in this browser. Try Chrome.");
};

recordBtn.addEventListener("click",() =>{
    if(isRecording){
        recognition.stop();
        recordBtn.textContent = "Start Recording";
        recordBtn.classList.remove("recording");
    }else{
        recognition.start()
        recordBtn.textContent = "Stop Recording";
        recordBtn.classList.add("recording");
    }
    isRecording=!isRecording;
});

recognition.onresult= (event) => {
    let transcript="";
    for (let i = event.resultIndex; i<event.results.length; i++){
        transcript+=(event.results)[i][0].transcript;
        document.getElementById("transcript").innerText = text;

    let bus = extractBusNumber(text);
    console.log("Sending bus:", bus);

    // 🔥 SEND TO BACKEND HERE
    fetch("https://threed-bus-number.onrender.com/bus", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bus: bus })
    });
};
    let busNumber = extractBusNumber(transcript);

    if(busNumber){
        transcriptDiv.innerHTML = "Bus Number:"+busNumber;
    } else{
        transcriptDiv.innerHTML="No bus number detected.";
    }
};

copyBtn.addEventListener("click",() =>{
    navigator.clipboard.writeText(transcriptDiv.innerText);
    alert("Text Copied to Clipboard");
});
saveBtn.addEventListener("click",() =>{
    const blob=new Blob([transcriptDiv.innerText],{type:"text/plain"});
    const link = document.createElement("a");
        link.href= URL.createObjectURL(blob);
        link.download= "transcript.txt";
        link.click();
});

clearBtn.addEventListener("click",() =>{
    transcriptDiv.innerHTML="";
});

