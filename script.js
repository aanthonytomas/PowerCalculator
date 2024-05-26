const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let operator = null;
let previousInput = null;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-value');

        if (value === 'C') {
            currentInput = '0';
            operator = null;
            previousInput = null;
        } else if (value === '=') {
            if (operator && previousInput !== null) {
                currentInput = operate(previousInput, currentInput, operator);
                operator = null;
                previousInput = null;
            }
        } else if (['+', '-', '*', '/'].includes(value)) {
            if (operator && previousInput !== null) {
                currentInput = operate(previousInput, currentInput, operator);
            }
            operator = value;
            previousInput = currentInput;
            currentInput = '0';
        } else {
            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                currentInput += value;
            }
        }

        updateDisplay();
    });
});

function updateDisplay() {
    if (operator && previousInput !== null) {
        display.textContent = `${previousInput} ${operator} ${currentInput}`;
    } else {
        display.textContent = currentInput;
    }
}

function operate(a, b, operator) {
    a = parseFloat(a);
    b = parseFloat(b);

    switch (operator) {
        case '+':
            return (a + b).toString();
        case '-':
            return (a - b).toString();
        case '*':
            return (a * b).toString();
        case '/':
            return (a / b).toString();
        default:
            return b;
    }
}
