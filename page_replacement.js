document.getElementById("algorithmForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const refString = document.getElementById("inputString").value;
    const numFrames = parseInt(document.getElementById("inputFrames").value);
    const pages = refString.split(" ");
    const numPages = pages.length;
    let frames = new Array(numFrames).fill(-1);
    let faults = 0;
    let hits = 0;
    let lastUsed = new Array(numFrames).fill(0);

    let tableData = "<table><tr><th>Reference</th>";
    for (let i = 0; i < numFrames; i++) {
        tableData += "<th>Frame " + i + "</th>";
    }
    tableData += "<th>Page Status</th></tr>";

    for (let i = 0; i < numPages; i++) {
        let found = false;
        for (let j = 0; j < numFrames; j++) {
            if (frames[j] == pages[i]) {
                hits++;
                found = true;
                lastUsed[j] = i + 1;
                break;
            }
        }
        if (!found) {
            const index = lastUsed.indexOf(Math.min(...lastUsed));
            frames[index] = pages[i];
            lastUsed[index] = i + 1;
            faults++;
        }
        tableData += "<tr><td>" + pages[i] + "</td>";
        for (let j = 0; j < numFrames; j++) {
            if (frames[j] == -1) {
                tableData += "<td></td>";
            } else {
                tableData += "<td>" + frames[j] + "</td>";
            }
        }
        if (!found) {
            tableData += "<td>FAULT</td></tr>";
        } else {
            tableData += "<td>HIT</td></tr>";
        }
    }

    const hitRatio = ((hits / numPages) * 100).toFixed(2);
    const faultRatio = ((faults / numPages) * 100).toFixed(2);
    let tableData2 = "<h2>Page Faults: " + faults + "</h2><br>";
    tableData2 += "<h2>Page Hits: " + hits + "</h2></br>";
    tableData2 += "<h2>Fault Ratio: " + faultRatio + "% </h2><br>";
    tableData2 += "<h2>Hit Ratio: " + hitRatio + "% </h2><br>";

    document.getElementById("result").innerHTML = tableData + "</table>" + tableData2;
});
