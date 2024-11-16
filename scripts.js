// Speech-to-text functionality with comments for easy customization
const startStopButton = document.getElementById('startStopButton');
let recognition;
let isRecording = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // For continuous transcription
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }

        // Insert the text into the iframe's content
        const iframeDoc = document.getElementById('embed-preview-iframe').contentDocument;
        if (iframeDoc) {
            const textField = iframeDoc.querySelector('textarea, input'); // Adjust to target the correct field if needed
            if (textField) {
                textField.value = finalTranscript;
            }
        }
    };

    startStopButton.addEventListener('click', () => {
        if (!isRecording) {
            recognition.start();
            startStopButton.textContent = 'Stop Recording';
            startStopButton.style.backgroundColor = 'var(--danger)';
            isRecording = true;
        } else {
            recognition.stop();
            startStopButton.textContent = 'Start Recording';
            startStopButton.style.backgroundColor = '';
            isRecording = false;
        }
    });
} else {
    alert('Speech Recognition not supported in this browser.');
}
