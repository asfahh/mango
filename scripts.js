document.addEventListener("DOMContentLoaded", function() {
    const startStopButton = document.getElementById('startStopButton');
    const iframe = document.getElementById('embed-preview-iframe');
    let recognition;
    let isRecording = false;

    // Function to handle speech results
    function handleSpeechResults(event) {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }

        // Send text to the iframe using postMessage
        if (iframe) {
            iframe.contentWindow.postMessage({ type: 'speechToText', text: finalTranscript }, '*');
            console.log("Text sent to iframe:", finalTranscript);
        }
    }

    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            console.log("Speech recognition started");
        };

        recognition.onend = function() {
            console.log("Speech recognition ended");
            isRecording = false;
            startStopButton.textContent = 'Start Recording';
            startStopButton.style.backgroundColor = '';
        };

        recognition.onerror = function(event) {
            console.error("Speech recognition error:", event.error);
            isRecording = false;
            startStopButton.textContent = 'Start Recording';
            startStopButton.style.backgroundColor = '';
        };

        recognition.onresult = handleSpeechResults;

        startStopButton.addEventListener('click', () => {
            if (!isRecording) {
                recognition.start();
                startStopButton.textContent = 'Stop Recording';
                startStopButton.style.backgroundColor = 'var(--danger)';
                isRecording = true;
            } else {
                recognition.stop();
            }
        });
    } else {
        alert('Speech Recognition not supported in this browser.');
    }
});
