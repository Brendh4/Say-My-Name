// modal gender reveal add to html
<div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Gender reveal data</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>LINK DATA FROM API HERE</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        {/* <button type="button" class="btn btn-primary">Save changes</button> */}
      </div>
    </div>
  </div>
</div>


//API fetch using user input
document.getElementById("revealGenderButton").addEventListener("click", function () {
    var userInput = document.getElementById("userInput").value;
    var queryURL = "https://api.genderize.io/?name=" + userInput;

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            document.getElementById("modalBodyContent").innerHTML = "<p>Gender: " + data.gender + "<br>Probability: " + data.probability + "</p>";
            new bootstrap.Modal(document.getElementById("genderModal")).show();
        })
        .catch(function (error) {
            alert("Error fetching gender data from API.");
        });
});


//make sure this is added to html
<button id="genderRevealButton" class="btn btn-primary mb-2">Gender reveal</button> to html aswell