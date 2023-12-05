document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("textInput");
  const synthesizeButton = document.getElementById("synthesizeButton");
  const audioPlayer = document.getElementById("audioPlayer");
  const historyElement = document.getElementById("history");
  const revealGenderButton = document.getElementById("genderRevealButton");
  const genderModal = document.getElementById("genderModal");
  const predictedGenderElement = document.getElementById("predictedGender");

  // Retrieve the name history from local storage or initialize an empty array
  let nameHistory = new Set(
    JSON.parse(localStorage.getItem("nameHistory")) || []
  );

  // Update the history section on page load
  updateHistory();

  synthesizeButton.addEventListener("click", () => {
    const textToSynthesize = textInput.value.trim();

    if (textToSynthesize === "") {
      alert("Please enter text to synthesize.");
      return;
    }

    // Add the name to the history set
    if (!nameHistory.has(textToSynthesize)) {
      nameHistory.add(textToSynthesize);

      // Keep only the last 5 names in the history
      if (nameHistory.size > 5) {
        const firstElement = nameHistory.values().next().value;
        nameHistory.delete(firstElement);
      }

      // Save the updated name history to local storage
      localStorage.setItem(
        "nameHistory",
        JSON.stringify(Array.from(nameHistory))
      );

      // Update the history section on the page
      updateHistory();
    }

    // Replace 'YOUR_API_KEY' with your actual Google Cloud API key.
    const apiKey = "AIzaSyBgN4FyKfnT3BcbxvnmCjqgv-Msgbys3Yo";
    const apiUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const request = {
      input: {
        text: textToSynthesize,
      },
      voice: {
        languageCode: "en-US",
        name: "en-US-Wavenet-D",
        ssmlGender: "FEMALE",
      },
      audioConfig: {
        audioEncoding: "MP3", // You can specify the desired audio format
      },
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.json())
      .then((data) => {
        const audioContentBase64 = data.audioContent;

        // Create a data URI from base64-encoded audio data
        const audioDataUri = `data:audio/mp3;base64,${audioContentBase64}`;

        // Set the data URI as the source for the audio element
        audioPlayer.src = audioDataUri;

        // Play the audio
        audioPlayer.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });

  // Function to handle the "Gender Reveal" button click
  revealGenderButton.addEventListener("click", () => {
    const name = textInput.value.trim(); // Corrected ID to 'textInput'
    if (name === "") {
      alert("Please enter a name before revealing the gender.");
      return;
    }

    // Call Genderize.io API to predict gender
    fetch(`https://api.genderize.io/?name=${name}`)
      .then((response) => response.json())
      .then((data) => {
        const genderPrediction = data.gender ? data.gender : 'Gender not found';
        predictedGenderElement.textContent = `Predicted gender: ${genderPrediction}`;
        // Show the modal after setting the prediction
        $(genderModal).modal('show');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while predicting gender. Please try again.');
      });
  });

  function updateHistory() {
    // Clear the history element
    historyElement.innerHTML = "<h3>Name History:</h3>";

    // Update the history element with the last 5 searched names
    Array.from(nameHistory).forEach((name, index) => {
      const listItem = document.createElement("div");
      listItem.className = "list-group-item";
      listItem.textContent = `${index + 1}. ${name}`;
      historyElement.appendChild(listItem);
    });
  }
});
