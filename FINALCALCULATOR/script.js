let result = document.getElementById("result");
let memory = 0;
let lastOperation = "";
let lastValue = 0;
let history = [];
let lastEqual = false;
let percentageClicked = false;

function addToResult(value) {
  if (lastEqual && !isOperator(value)) {
    clearResult();
    lastEqual = false;
  }
  if (result.innerText === "0" && value !== ".") {
    result.innerText = "";
  }
  if (isOperator(value)) {
    lastEqual = false;
  }
  result.innerText += value;
}

function clearResult() {
  result.innerText = "0";
  lastOperation = "";
}

function clearLast() {
  result.innerText = result.innerText.slice(0, -1);
}

function calculate() {
  let expression = result.innerText;

  if (expression.includes("**")) {
    result.innerText = "Error";
    lastEqual = true;
    return;
  }

  // Handle percentage if clicked
  if (percentageClicked) {
    expression = expression.replace(/%/g, "*0.01");
  }

  try {
    let answer = eval(expression);
    if (answer === Infinity || isNaN(answer)) {
      result.innerText = "Cannot divide by zero";
    } else {
      // Check if the result is too large
      if (Math.abs(answer) > 1e12) {
        result.innerText = answer.toExponential(6);
      } else {
        result.innerText = formatNumber(answer);
      }

      if (!lastEqual) {
        history.push(expression + " = " + result.innerText);
        updateHistory();
        lastValue = answer;
      }
    }
  } catch (error) {
    result.innerText = "Error";
  }

  lastEqual = true;
  lastOperation = "";
  updateMemory();
  percentageClicked = false;
}

function backspace() {
  if (result.innerText === "Cannot divide by zero") {
    clearResult();
  } else {
    result.innerText = result.innerText.slice(0, -1);
  }
}

function memoryRecall() {
  result.innerText = formatNumber(memory);
}

function memorySubtract() {
  memory -= parseFloat(result.innerText);
  result.innerText = formatNumber(memory);
  updateMemory();
}

function memoryAdd() {
  memory += parseFloat(result.innerText);
  result.innerText = formatNumber(memory);
  updateMemory();
}

function setPercentage() {
  if (!lastEqual) {
    addToResult("%");
    percentageClicked = true;
  }
}

function calculateSquareRoot() {
  let currentValue = parseFloat(result.innerText);
  if (currentValue < 0) {
    result.innerText = "Invalid input";
  } else {
    let squareRoot = Math.sqrt(currentValue);
    result.innerText = formatNumber(squareRoot);
  }
}

function showHistory() {
  let historyContent = document.getElementById("historyContent");
  let memoryContent = document.getElementById("memoryContent");

  if (
    historyContent.style.display === "none" ||
    historyContent.style.display === ""
  ) {
    historyContent.innerHTML = "</br> History: </br>" + history.join("<br>");
    historyContent.style.display = "block";
    memoryContent.style.display = "none";
  } else {
    historyContent.style.display = "none";
  }
}

function showMemory() {
  let historyContent = document.getElementById("historyContent");
  let memoryContent = document.getElementById("memoryContent");

  if (
    memoryContent.style.display === "none" ||
    memoryContent.style.display === ""
  ) {
    memoryContent.innerHTML = "</br> Memory: </br>" + formatNumber(memory);
    memoryContent.style.display = "block";
    historyContent.style.display = "none";
  } else {
    memoryContent.style.display = "none";
  }
}

document.getElementById("historyContent").style.backgroundColor = "#444";
document.getElementById("historyContent").style.color = "#fff";
document.getElementById("historyContent").style.borderRadius = "2px";
document.getElementById("historyContent").style.paddingLeft = "10px";

document.getElementById("memoryContent").style.backgroundColor = "#444";
document.getElementById("memoryContent").style.color = "#fff";
document.getElementById("memoryContent").style.borderRadius = "2px";
document.getElementById("memoryContent").style.paddingLeft = "10px";

function updateMemory() {
  let memoryContent = document.getElementById("memoryContent");
  memoryContent.innerHTML = "Memory: " + formatNumber(memory);
}

function updateHistory() {
  let historyContent = document.getElementById("historyContent");
  historyContent.innerHTML = history.join("<br>");
}

function clearHistory() {
  history = []; // Clear history array
  updateHistory(); // Update history display
}

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function isOperator(value) {
  return value === "+" || value === "-" || value === "*" || value === "/";
}
