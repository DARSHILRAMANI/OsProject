
function generateInputs() {
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
			<input type="number" id="burst-time-${i}" min="1" value="1">
			<label for="priority-${i}">Priority:</label>
			<input type="number" id="priority-${i}" min="1" value="1">
		`;
		inputsContainer.appendChild(inputGroup);
	}
}

function simulate() {
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
      const ganttBar = document.createElement('div');
      ganttBar.className = 'gantt-bar';
      ganttBar.style.backgroundColor = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)})`;
      ganttBar.style.width = '30px';
      ganttBar.style.flexGrow = currentProcess.burstTime;
      ganttBar.innerText = `P${currentProcess.id}`;
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
    <td colspan="4">Average</td>
    <td>${averageTurnaroundTime.toFixed(2)}</td>
    <td>${averageWaitingTime.toFixed(2)}</td>
  `;
  resultsContainer.appendChild(resultRow);
}  

