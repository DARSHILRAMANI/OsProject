function simulate() {
    // Get the input queue from the user
    const inputQueue = document.getElementById("queue").value;

    // Parse the input queue as an array of integers
    const queue = inputQueue.split(",").map(Number);

    // Initialize the starting head position and total seek time
    let headPos = queue[0];
    let seekTime = 0;

    // Initialize the output table body
    const outputBody = document.getElementById("output-body");
    outputBody.innerHTML = "";

    // Create an array to hold the track numbers and add the starting head position
    const tracks = [headPos];

    // Iterate through the queue and calculate the start and end positions for each request
    for (let i = 0; i < queue.length; i++) {
        const request = queue[i];
        const start = headPos;
        const end = request;

        // Calculate the seek time for this request
        const diff = Math.abs(end - start);
        seekTime += diff;

        // Add a row to the output table for this request
        const row = outputBody.insertRow();
        row.insertCell().innerText = request;
        row.insertCell().innerText = start;
        row.insertCell().innerText = end;

        // Update the head position for the next request
        headPos = end;

        // Add the track number to the array
        tracks.push(headPos);
    }

    // Display the total seek time
    // alert(`Total Seek Time: ${seekTime}`);


// Display the total seek time
const seekTimeElement = document.getElementById("seek-time");
seekTimeElement.textContent = `Total Seek Time: ${seekTime}`;


    // Draw the disk head movement chart
    const chartContainer = document.createElement("div");
    chartContainer.id = "chart-container";
    document.body.appendChild(chartContainer);

    const chart = new Chartist.Line("#chart-container", {
        labels: tracks,
        series: [
            tracks.map((track, i) => ({ x: i, y: track }))
        ]
    }, {
        showPoint: true,
        lineSmooth: false,
        axisX: {
            labelInterpolationFnc: function (value, index) {
                return index % 5 === 0 ? value : null;
            }
        }
    });
}

const promptButton = document.getElementById("prompt-button");

promptButton.addEventListener("click", function() {
  window.location.href = "quiz.html";
});