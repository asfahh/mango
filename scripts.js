// Speech-to-text functionality with comments for easy customization
const startStopButton = document.getElementById('startStopButton');
let recognition;
let isRecording = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // For continuous transcription
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = function() {
        console.log("Speech recognition started");
    };

    recognition.onend = function() {
        console.log("Speech recognition ended");
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error:", event.error);
    };

    recognition.onresult = function(event) {
        let finalTranscript = '';
        console.log("Speech recognition onresult event:", event);
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
                console.log("Final transcript:", finalTranscript);
            }
        }

        // Insert the text into the iframe's content
        const iframe = document.getElementById('embed-preview-iframe');
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc) {
            const textField = iframeDoc.evaluate(
                '//*[@id="__next"]/div/main/div[1]/div/div[3]/div/div/textarea', 
                iframeDoc, 
                null, 
                XPathResult.FIRST_ORDERED_NODE_TYPE, 
                null
            ).singleNodeValue;

            if (textField) {
                textField.value = finalTranscript;
                console.log("Text inserted into iframe:", finalTranscript);
            } else {
                console.warn("Text field not found in iframe.");
            }
        } else {
            console.warn("Iframe document not accessible.");
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
