let screen = document.getElementById("screen");
let expression = "";

function press(value) {
  expression += value;
  screen.value = expression;
}

function clearScreen() {
  expression = "";
  screen.value = "";
}

function calculate() {
  try {
    const result = parseAndCalculate(expression);
    screen.value = result;
    expression = result.toString();
  } catch {
    screen.value = "Error";
    expression = "";
  }
}

function parseAndCalculate(expr) {
  const tokens = expr.match(/(\d+\.?\d*|\.\d+|[+\-*/])/g);
  if (!tokens) throw new Error("Invalid input");

  let values = [];
  let ops = [];

  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };

  const apply = () => {
    const b = values.pop();
    const a = values.pop();
    const op = ops.pop();
    if (op === '+') values.push(a + b);
    else if (op === '-') values.push(a - b);
    else if (op === '*') values.push(a * b);
    else if (op === '/') values.push(a / b);
  };

  for (let token of tokens) {
    if (!isNaN(token)) {
      values.push(parseFloat(token));
    } else {
      while (ops.length && precedence[ops[ops.length - 1]] >= precedence[token]) {
        apply();
      }
      ops.push(token);
    }
  }

  while (ops.length) {
    apply();
  }

  return values[0];
}