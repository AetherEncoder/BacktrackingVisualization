const sizeInput = document.getElementById("array-size");
const buildInputsBtn = document.getElementById("build-inputs");
const valueInputsEl = document.getElementById("value-inputs");
const startBtn = document.getElementById("start");
const resetBtn = document.getElementById("reset");
const memoryBlockEl = document.getElementById("memory-block");
const statusEl = document.getElementById("status");
const currentSubsetEl = document.getElementById("current-subset");
const subsetListEl = document.getElementById("subset-list");

let activeTimer = null;
let isRunning = false;

function delay(ms) {
  return new Promise((resolve) => {
    activeTimer = setTimeout(resolve, ms);
  });
}

function clearTimer() {
  if (activeTimer !== null) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
}

function buildValueInputs() {
  const count = Math.max(1, Math.min(10, Number(sizeInput.value) || 1));
  sizeInput.value = String(count);
  valueInputsEl.innerHTML = "";

  for (let i = 0; i < count; i += 1) {
    const input = document.createElement("input");
    input.type = "number";
    input.value = String(i + 1);
    input.placeholder = `a[${i}]`;
    input.setAttribute("aria-label", `Value for index ${i}`);
    valueInputsEl.appendChild(input);
  }
}

function getSetValues() {
  const inputs = Array.from(valueInputsEl.querySelectorAll("input"));
  return inputs.map((input, index) => {
    const value = Number(input.value);
    if (Number.isNaN(value)) {
      return index + 1;
    }
    return value;
  });
}

function renderMemoryBlock(values) {
  memoryBlockEl.innerHTML = "";
  values.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = String(index);
    cell.innerHTML = `<div class="index">idx ${index}</div><div class="value">${value}</div>`;
    memoryBlockEl.appendChild(cell);
  });
}

function setStatus(text) {
  statusEl.textContent = `Status: ${text}`;
}

function setCurrentSubset(subset) {
  currentSubsetEl.textContent = `Current subset: [${subset.join(", ")}]`;
}

function updateCellStyles(index, mode) {
  const cell = memoryBlockEl.querySelector(`.cell[data-index="${index}"]`);
  if (!cell) {
    return;
  }
  cell.classList.remove("active", "pending");
  if (mode) {
    cell.classList.add(mode);
  }
}

function appendSubset(subset) {
  const item = document.createElement("li");
  item.textContent = `[${subset.join(", ")}]`;
  subsetListEl.appendChild(item);
  subsetListEl.scrollTop = subsetListEl.scrollHeight;
}

async function powerSetVisual(values, index, subset, chosenFlags) {
  if (!isRunning) {
    return;
  }

  if (index === values.length) {
    setStatus("Reached base case, output subset");
    setCurrentSubset(subset);
    appendSubset(subset);
    await delay(550);
    return;
  }

  setStatus(`Decision at index ${index}: exclude ${values[index]}`);
  updateCellStyles(index, "pending");
  await delay(420);
  updateCellStyles(index, chosenFlags[index] ? "active" : null);
  await powerSetVisual(values, index + 1, subset, chosenFlags);

  if (!isRunning) {
    return;
  }

  setStatus(`Decision at index ${index}: include ${values[index]}`);
  chosenFlags[index] = true;
  subset.push(values[index]);
  updateCellStyles(index, "active");
  setCurrentSubset(subset);
  await delay(420);
  await powerSetVisual(values, index + 1, subset, chosenFlags);

  subset.pop();
  chosenFlags[index] = false;
  updateCellStyles(index, null);
  setCurrentSubset(subset);
}

async function startVisualization() {
  if (isRunning) {
    return;
  }

  const values = getSetValues();
  isRunning = true;
  startBtn.disabled = true;
  setStatus("Starting recursion...");
  subsetListEl.innerHTML = "";
  renderMemoryBlock(values);
  setCurrentSubset([]);

  try {
    const flags = new Array(values.length).fill(false);
    await powerSetVisual(values, 0, [], flags);
    if (isRunning) {
      setStatus("Done. Generated all subsets.");
    }
  } finally {
    isRunning = false;
    startBtn.disabled = false;
    clearTimer();
  }
}

function resetVisualization() {
  clearTimer();
  isRunning = false;
  startBtn.disabled = false;
  subsetListEl.innerHTML = "";
  memoryBlockEl.innerHTML = "";
  setStatus("waiting for input");
  setCurrentSubset([]);
}

buildInputsBtn.addEventListener("click", buildValueInputs);
startBtn.addEventListener("click", startVisualization);
resetBtn.addEventListener("click", resetVisualization);

buildValueInputs();
