document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const synthesizeButton = document.getElementById("synthesizeButton");
    const audioPlayer = document.getElementById("audioPlayer");

    synthesizeButton.addEventListener("click", () => {
        const textToSynthesize = textInput.value.trim();

        if (textToSynthesize === "") {
            alert("Please enter text to synthesize.");
            return;
        }

        // Replace 'YOUR_API_KEY' with your actual Google Cloud API key.
        const apiKey = 'AIzaSyBgN4FyKfnT3BcbxvnmCjqgv-Msgbys3Yo';
        const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

        const request = {
            input: {
                text: textToSynthesize
            },
            voice: {
                languageCode: 'en-US',
                name: 'en-US-Wavenet-D',
                ssmlGender: 'FEMALE'
            },
            audioConfig: {
                audioEncoding: 'MP3' // You can specify the desired audio format
            }
        };

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })
        .then(response => response.json())
        .then(data => {
            const audioContentBase64 = data.audioContent;

            // Create a data URI from base64-encoded audio data
            const audioDataUri = `data:audio/mp3;base64,${audioContentBase64}`;

            // Set the data URI as the source for the audio element
            audioPlayer.src = audioDataUri;

            // Play the audio
            audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});