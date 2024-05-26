# Calculator Web App

A simple web-based calculator implemented with HTML, CSS, and JavaScript.

## Features

- Basic arithmetic operations: addition, subtraction, multiplication, and division.
- Clear (C) button to reset the calculator.
- Responsive design using Bootstrap for a sleek and modern look.

## Demo

You can try out the calculator [here](https://your-live-demo-link.com).

## Screenshots

![Calculator Screenshot](screenshot.png)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/calculator-web-app.git
    ```
2. Navigate to the project directory:
    ```bash
    cd calculator-web-app
    ```
3. Open `index.html` in your preferred web browser:
    ```bash
    open index.html
    ```

## Usage

- Click on the buttons to perform arithmetic operations.
- Use the clear (C) button to reset the calculator.
- The current operation and result will be displayed on the screen.

## Files

- `index.html`: The main HTML file that contains the structure of the calculator.
- `script.js`: The JavaScript file that handles the calculator logic.
- `styles.css`: The CSS file for additional custom styling (if any).

## Code Overview

### index.html

This file contains the HTML structure and links to Bootstrap for styling and `script.js` for functionality. The calculator layout is created using Bootstrap's grid system.

### script.js

This file contains the JavaScript code for the calculator's functionality. It handles button clicks, updates the display, and performs the arithmetic operations.

```javascript
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
