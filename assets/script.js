document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("textInput"); // Changed to 'nameInput'
  const synthesizeButton = document.getElementById("synthesizeButton");
  const audioPlayer = document.getElementById("audioPlayer");
  const nameHistory = document.getElementById("history"); // Changed to 'nameHistory'
  const genderRevealButton = document.getElementById("genderRevealButton"); // Changed to 'genderRevealButton'
  const genderModal = document.getElementById("genderModal");
  const genderPrediction = document.getElementById("genderPrediction");

  // Retrieve the name history from local storage or initialize an empty array
  let nameHistorySet = new Set(
    JSON.parse(localStorage.getItem("nameHistory")) || []
  );

  // Update the history section on page load
  updateHistory();

  synthesizeButton.addEventListener("click", () => {
    const textToSynthesize = nameInput.value.trim();

    if (textToSynthesize === "") {
      alert("Please enter text to synthesize.");
      return;
    }

    // Add the name to the history set
    if (!nameHistorySet.has(textToSynthesize)) {
      nameHistorySet.add(textToSynthesize);

      // Keep only the last 5 names in the history
      if (nameHistorySet.size > 5) {
        const firstElement = nameHistorySet.values().next().value;
        nameHistorySet.delete(firstElement);
      }

      // Save the updated name history to local storage
      localStorage.setItem(
        "nameHistory",
        JSON.stringify(Array.from(nameHistorySet))
      );

      // Update the history section on the page
      updateHistory();
    }

    // Google Cloud API key.
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
        audioEncoding: "MP3", // Specify the desired audio format
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

  genderRevealButton.addEventListener("click", () => {
    const name = nameInput.value.trim();

    if (name === "") {
      alert("Please enter a name before revealing the gender.");
      return;
    }

    // Call Genderize.io API to predict gender
    fetch(`https://api.genderize.io/?name=${name}`)
      .then((response) => response.json())
      .then((data) => {
        const gender = data.gender ? data.gender : "Gender not found";
        genderPrediction.textContent = `Predicted gender: ${gender}`;

        // Show the gender modal
        $(genderModal).modal("show");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while predicting gender. Please try again.");
      });
  });

  function updateHistory() {
    // Clear the history element
    nameHistory.innerHTML = "<h3>Name History:</h3>";

    // Update the history element with the last 5 searched names
    Array.from(nameHistorySet).forEach((name, index) => {
      const listItem = document.createElement("div");
      listItem.className = "list-group-item";
      listItem.textContent = `${index + 1}. ${name}`;
      nameHistory.appendChild(listItem);
    });
  }
});
