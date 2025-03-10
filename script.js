// Voice Initialization
const synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
    voices = synth.getVoices();
    if (!voices.length) setTimeout(loadVoices, 100);
}
synth.onvoiceschanged = loadVoices;
loadVoices();

// Text to Speech
function handleConversion() {
    const text = document.getElementById('textBox').value.trim();
    if (!text) return alert('Please enter text first');
    
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find(v => v.lang.startsWith(navigator.language)) || voices[0];
    synth.speak(utterance);
}

// Voice Input
function startVoiceInput() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return alert('Speech input not supported');
    
    const recognition = new Recognition();
    recognition.lang = navigator.language;
    recognition.interimResults = false;

    recognition.onresult = e => {
        document.getElementById('textBox').value = e.results[0][0].transcript;
    };

    recognition.start();
}

// Copy to Clipboard
async function copyContent() {
    try {
        await navigator.clipboard.writeText(document.getElementById('textBox').value);
        alert('Text copied to clipboard');
    } catch {
        alert('Failed to copy text');
    }
}

// Download Audio as a file
function downloadAudio() {
    const text = document.getElementById('textBox').value.trim();
    if (!text) return alert('Please enter text first');
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices.find(v => v.lang.startsWith(navigator.language)) || voices[0];

    // Create an audio element to capture the speech
    const audioBlob = new Blob([utterance], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = 'text_to_speech.wav';
    a.click();
    URL.revokeObjectURL(audioUrl);
}
