function generateInputs() {
    const algorithm = document.getElementById('algorithm-select').value;

    switch (algorithm) {
        case 'sjrt':
            generateInputsSJRT();
            break;
        case 'sjf':
            generateInputsSJF();
            break;
        case 'priority':
            generateInputsPriority();
            break;
        case 'round-robin':
            generateInputsRoundRobin();
            break;
        default:
            alert('Invalid algorithm selected');
    }
}

function generateInputsSJRT() {
    const processCount = document.getElementById('process-count').value;
    const inputsContainer = document.getElementById('inputs-container');
    inputsContainer.innerHTML = '';
    for (let i = 0; i < processCount; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <label for="arrival-time-${i}">Arrival Time:</label>
            <input type="number" id="arrival-time-${i}" min="0" value="0">
            <label for="burst-time-${i}">Burst Time:</label>
            <input type="number" id="burst-time-${i}" min="0" value="0">
        `;
        inputsContainer.appendChild(inputGroup);
    }
}

function generateInputsSJF() {
        const processCount = document.getElementById('process-count').value;
        const inputsContainer = document.getElementById('inputs-container');
        inputsContainer.innerHTML = '';
        for (let i = 0; i < processCount; i++) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            inputGroup.innerHTML = `
                <label for="arrival-time-${i}">Arrival Time:</label>
                <input type="number" id="arrival-time-${i}" min="0" value="0">
                <label for="burst-time-${i}">Burst Time:</label>
                <input type="number" id="burst-time-${i}" min="0" value="0">
            `;
            inputsContainer.appendChild(inputGroup);
        }
}

function generateInputsPriority() {const processCount = document.getElementById('process-count').value;
    const inputsContainer = document.getElementById('inputs-container');
    inputsContainer.innerHTML = '';
    for (let i = 0; i < processCount; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <label for="arrival-time-${i}">Arrival Time:</label>
            <input type="number" id="arrival-time-${i}" min="0" value="0">
            <label for="burst-time-${i}">Burst Time:</label>
            <input type="number" id="burst-time-${i}" min="0" value="0">
            <label for="priority-${i}">Priority:</label>
            <input type="number" id="priority-${i}" min="0" value="0">
        `;
        inputsContainer.appendChild(inputGroup);
    }// Generate inputs specific to Priority Scheduling algorithm
}

function generateInputsRoundRobin() {

    const processCount = document.getElementById('process-count').value;
    const inputsContainer = document.getElementById('inputs-container');
    inputsContainer.innerHTML = '';
    for (let i = 0; i < processCount; i++) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        inputGroup.innerHTML = `
            <label for="arrival-time-${i}">Arrival Time:</label>
            <input type="number" id="arrival-time-${i}" min="0" value="0">
            <label for="burst-time-${i}">Burst Time:</label>
            <input type="number" id="burst-time-${i}" min="0" value="0">
        `;
        inputsContainer.appendChild(inputGroup);
    }

}



function simulate() {
    const algorithm = document.getElementById('algorithm-select').value;

    switch (algorithm) {
        case 'sjrt':
            simulatesrtf();
            break;
        case 'sjf':
            simulateSJF();
            break;
        case 'priority':
            simulatePriority();
            break;
        case 'round-robin':
            simulateRoundRobin();
            break;
        default:
            alert('Invalid algorithm selected');
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function simulatesrtf() {
    const processCount = document.getElementById('process-count').value;
    const processes = [];
    for (let i = 0; i < processCount; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival-time-${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst-time-${i}`).value);
        processes.push({
            id: i,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            priority: 0,
            remainingTime: burstTime,
            startTime: -1,
            completionTime: -1,
            waitingTime: 0,
            turnaroundTime: 0
        });
    }

    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    const ganttContainer = document.getElementById('gantt-container');
    ganttContainer.innerHTML = '';
    
    let currentTime = 0;
    let completedProcesses = 0;
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    while (completedProcesses < processCount) {
        let shortestIndex = -1;
        let shortestTime = Infinity;
        for (let i = 0; i < processCount; i++) {
            if (processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0 && processes[i].burstTime < shortestTime) {
                shortestTime = processes[i].burstTime;
                shortestIndex = i;
            }
        }

        if (shortestIndex === -1) {
            currentTime++;
        } else {
            const currentProcess = processes[shortestIndex];
            if (currentProcess.startTime === -1) {
                currentProcess.startTime = currentTime;
            }
            currentProcess.remainingTime--;
            currentTime++;
            if (currentProcess.remainingTime === 0) {
                currentProcess.completionTime = currentTime;
                currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
                currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
                completedProcesses++;
            }
            const ganttBar = document.createElement('div');
            ganttBar.className = 'gantt-bar';
            ganttBar.style.width = `${currentProcess.burstTime * 30}px`;
            ganttBar.innerText = `P${currentProcess.id} (${currentTime})`;
            ganttContainer.appendChild(ganttBar);
        }
    }

    for (let i = 0; i < processCount; i++) {
        const resultRow = document.createElement('tr');
        resultRow.innerHTML = `
            <td>P${processes[i].id}</td>
            <td>${processes[i].arrivalTime}</td>
            <td>${processes[i].burstTime}</td>
            <td>${processes[i].priority}</td>
            <td>${processes[i].turnaroundTime}</td>
            <td>${processes[i].waitingTime}</td>
        `;
        resultsContainer.appendChild(resultRow);
    }

    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    for (let i = 0; i < processCount; i++) {
        totalTurnaroundTime += processes[i].turnaroundTime;
        totalWaitingTime += processes[i].waitingTime;
    }
    const averageTurnaroundTime = totalTurnaroundTime / processCount;
    const averageWaitingTime = totalWaitingTime / processCount;
    const resultRow = document.createElement('tr');
    resultRow.innerHTML = `
        <td colspan="3">Average</td>
        <td>${averageTurnaroundTime.toFixed(2)}</td>
        <td>${averageWaitingTime.toFixed(2)}</td>
    `;
    resultsContainer.appendChild(resultRow);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function simulateSJF() {
    
    const processCount = parseInt(document.getElementById('process-count').value);
    const processes = [];
    for (let i = 0; i < processCount; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival-time-${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst-time-${i}`).value);
        processes.push({
            id: i,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            priority:0,
            remainingTime: burstTime,
            startTime: -1,
            completionTime: -1,
            waitingTime: 0,
            turnaroundTime: 0
        });
    }

    processes.sort((a, b) => {
        if (a.remainingTime !== b.remainingTime) {
            return a.remainingTime - b.remainingTime;
        } else {
            return a.arrivalTime - b.arrivalTime;
        }
    }); // Sort processes by remaining time and then arrival time

    const ganttContainer = document.getElementById('gantt-container');
    ganttContainer.innerHTML = '';

    let currentTime = 0;
    let completedProcesses = 0;
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    while (completedProcesses < processCount) {
        let currentProcessIndex = -1;
        let shortestRemainingTime = Infinity;

        // Find the process with the shortest remaining time among those arrived
        for (let i = 0; i < processCount; i++) {
            if (processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0) {
                if (processes[i].remainingTime < shortestRemainingTime) {
                    shortestRemainingTime = processes[i].remainingTime;
                    currentProcessIndex = i;
                }
            }
        }

        if (currentProcessIndex === -1) {
            // No process arrived yet, move time forward to the next arrival
            currentTime = processes[completedProcesses].arrivalTime;
        } else {
            const currentProcess = processes[currentProcessIndex];
            currentProcess.startTime = currentTime;
            currentTime += currentProcess.remainingTime;
            currentProcess.completionTime = currentTime;
            currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
            currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
            completedProcesses++;

            const ganttBar = document.createElement('div');
            ganttBar.className = 'gantt-bar';
            ganttBar.style.width = `${currentProcess.burstTime * 30}px`;
            ganttBar.innerText = `P${currentProcess.id}`;
            ganttContainer.appendChild(ganttBar);

            currentProcess.remainingTime = 0;
        }
    }

    for (let i = 0; i < processCount; i++) {
        const resultRow = document.createElement('tr');
        resultRow.innerHTML = `
            <td>P${processes[i].id}</td>
            <td>${processes[i].arrivalTime}</td>
            <td>${processes[i].burstTime}</td>
            <td>${processes[i].priority}</td>
            <td>${processes[i].turnaroundTime}</td>
            <td>${processes[i].waitingTime}</td>
        `;
        resultsContainer.appendChild(resultRow);
    }

    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    for (let i = 0; i < processCount; i++) {
        totalTurnaroundTime += processes[i].turnaroundTime;
        totalWaitingTime += processes[i].waitingTime;
    }
    const averageTurnaroundTime = totalTurnaroundTime / processCount;
    const averageWaitingTime = totalWaitingTime / processCount;
    const resultRow = document.createElement('tr');
    resultRow.innerHTML = `
        <td colspan="3">Average</td>
        <td>${averageTurnaroundTime.toFixed(2)}</td>
        <td>${averageWaitingTime.toFixed(2)}</td>
    `;
    resultsContainer.appendChild(resultRow);
    
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function simulatePriority() {
	const processCount = document.getElementById('process-count').value;
	const processes = [];
	for (let i = 0; i < processCount; i++) {
		const arrivalTime = parseInt(document.getElementById(`arrival-time-${i}`).value);
		const burstTime = parseInt(document.getElementById(`burst-time-${i}`).value);
		const priority = parseInt(document.getElementById(`priority-${i}`).value);
		processes.push({ 	id: i,
      arrivalTime: arrivalTime,
      burstTime: burstTime,
      priority: priority,
      remainingTime: burstTime,
      startTime: -1,
      completionTime: -1,
      waitingTime: 0,
      turnaroundTime: 0
    });
  }
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  const ganttContainer = document.getElementById('gantt-container');
  ganttContainer.innerHTML = '';
  
  let currentTime = 0;
  let completedProcesses = 0;
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = '';
  
  while (completedProcesses < processCount) {
    let currentProcess = null;
    let highestPriority = Infinity;
    for (let i = 0; i < processCount; i++) {
      if (processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0 && processes[i].priority < highestPriority) {
        currentProcess = processes[i];
        highestPriority = processes[i].priority;
      }
    }
  
    if (currentProcess === null) {
      currentTime++;
    } else {
      if (currentProcess.startTime === -1) {
        currentProcess.startTime = currentTime;
      }
      currentProcess.remainingTime--;
      currentTime++;
      if (currentProcess.remainingTime === 0) {
        currentProcess.completionTime = currentTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
        currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
        completedProcesses++;
      }
      
    }const ganttBar = document.createElement('div');
            ganttBar.className = 'gantt-bar';
            ganttBar.style.width = `${currentProcess.burstTime * 30}px`;
            ganttBar.innerText = `P${currentProcess.id} (${currentTime})`;
            ganttContainer.appendChild(ganttBar);
  }
  
  for (let i = 0; i < processCount; i++) {
    const resultRow = document.createElement('tr');
    resultRow.innerHTML = `
      <td>P${processes[i].id}</td>
      <td>${processes[i].arrivalTime}</td>
      <td>${processes[i].burstTime}</td>
      <td>${processes[i].priority}</td>
      <td>${processes[i].turnaroundTime}</td>
      <td>${processes[i].waitingTime}</td>
    `;
    resultsContainer.appendChild(resultRow);
  }
  
  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;
  for (let i = 0; i < processCount; i++) {
    totalTurnaroundTime += processes[i].turnaroundTime;
    totalWaitingTime += processes[i].waitingTime;
  }
  const averageTurnaroundTime = totalTurnaroundTime / processCount;
  const averageWaitingTime = totalWaitingTime / processCount;
  const resultRow = document.createElement('tr');
  resultRow.innerHTML = `
    <td colspan="4">Average</td>
    <td>${averageTurnaroundTime.toFixed(2)}</td>
    <td>${averageWaitingTime.toFixed(2)}</td>
  `;
  resultsContainer.appendChild(resultRow);
}  
//////////////////////////////////////////////////////////////////////////////////////


function simulateRoundRobin() {
    const processCount = document.getElementById('process-count').value;
    const timeQuantum = parseInt(document.getElementById('time-quantum').value);
    const contextSwitchTime = parseInt(document.getElementById('context-switch-time').value);

    const processes = [];
    for (let i = 0; i < processCount; i++) {
        const arrivalTime = parseInt(document.getElementById(`arrival-time-${i}`).value);
        const burstTime = parseInt(document.getElementById(`burst-time-${i}`).value);
        processes.push({
            id: i,
            arrivalTime: arrivalTime,
            burstTime: burstTime,
            priority: 0,
            remainingTime: burstTime,
            startTime: -1,
            completionTime: -1,
            waitingTime: 0,
            turnaroundTime: 0
        });
    }

    const ganttContainer = document.getElementById('gantt-container');
    ganttContainer.innerHTML = '';

    let currentTime = 0;
    let completedProcesses = 0;
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';

    while (completedProcesses < processCount) {
        for (let i = 0; i < processCount; i++) {
            const currentProcess = processes[i];
            if (currentProcess.remainingTime > 0 && currentProcess.arrivalTime <= currentTime) {
                if (currentProcess.startTime === -1) {
                    currentProcess.startTime = currentTime;
                }
                if (currentProcess.remainingTime <= timeQuantum) {
                    currentTime += currentProcess.remainingTime;
                    currentProcess.remainingTime = 0;
                } else {
                    currentTime += timeQuantum;
                    currentProcess.remainingTime -= timeQuantum;
                }
                if (currentProcess.remainingTime === 0) {
                    currentProcess.completionTime = currentTime;
                    currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
                    currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
                    completedProcesses++;
                }
                const ganttBar = document.createElement('div');
                ganttBar.className = 'gantt-bar';
                const barWidth = currentProcess.remainingTime > 0 ? timeQuantum : (timeQuantum - currentProcess.remainingTime);
                ganttBar.style.width = `${barWidth * 30}px`;
                ganttBar.innerText = `P${currentProcess.id}`;
                ganttContainer.appendChild(ganttBar);
                currentTime += contextSwitchTime; // Add context switch time
            }
        }
    }

    for (let i = 0; i < processCount; i++) {
        const resultRow = document.createElement('tr');
        resultRow.innerHTML = `
            <td>P${processes[i].id}</td>
            <td>${processes[i].arrivalTime}</td>
            <td>${processes[i].burstTime}</td>
            <td>${processes[i].priority}</td>
            <td>${processes[i].turnaroundTime}</td>
            <td>${processes[i].waitingTime}</td>
        `;
        resultsContainer.appendChild(resultRow);
    }

    let totalTurnaroundTime = 0;
    let totalWaitingTime = 0;
    for (let i = 0; i < processCount; i++) {
        totalTurnaroundTime += processes[i].turnaroundTime;
        totalWaitingTime += processes[i].waitingTime;
    }
    const averageTurnaroundTime = totalTurnaroundTime / processCount;
    const averageWaitingTime = totalWaitingTime / processCount;
    const resultRow = document.createElement('tr');
    resultRow.innerHTML = `
        <td colspan="3">Average</td>
        <td>${averageTurnaroundTime.toFixed(2)}</td>
        <td>${averageWaitingTime.toFixed(2)}</td>
    `;
    resultsContainer.appendChild(resultRow);
}
