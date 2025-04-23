/**
 * Power Calculator - Enhanced JavaScript Implementation
 * Features:
 * - Calculation history
 * - Keyboard support
 * - Dark/light theme toggle
 * - Error handling
 * - Special operations (%, ±)
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const display = document.getElementById('display');
    const historyDisplay = document.querySelector('.history-value');
    const buttons = document.querySelectorAll('.buttons .btn');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Calculator State
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
        lastResult: null,
        memoryValue: 0
    };
    
    // Update the display with current value
    function updateDisplay() {
        display.textContent = calculator.displayValue;
    }
    
    // Update calculation history
    function updateHistory() {
        if (calculator.firstOperand !== null && calculator.operator) {
            historyDisplay.textContent = `${calculator.firstOperand} ${getOperatorSymbol(calculator.operator)}`;
        } else if (calculator.lastResult !== null && !calculator.waitingForSecondOperand) {
            historyDisplay.textContent = '';
        }
    }
    
    // Format operator symbols for display
    function getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }
    
    // Handle input of decimal point
    function inputDecimal() {
        // If waiting for second operand, start fresh with '0.'
        if (calculator.waitingForSecondOperand) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }
        
        // Don't allow more than one decimal point
        if (!calculator.displayValue.includes('.')) {
            calculator.displayValue += '.';
        }
    }
    
    // Handle inputs of digits (0-9)
    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;
        
        if (waitingForSecondOperand) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            // Overwrite '0' if it's the only digit
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }
    
    // Handle operator inputs (+, -, *, /, =)
    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;
        // Convert string to number
        const inputValue = parseFloat(displayValue);
        
        // Handle case where operators are changed before second operand
        if (operator && calculator.waitingForSecondOperand && nextOperator !== '=') {
            calculator.operator = nextOperator;
            updateHistory();
            return;
        }
        
        // If no first operand yet, store it
        if (firstOperand === null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator && !isNaN(inputValue)) {
            // Otherwise perform calculation
            try {
                const result = performCalculation();
                calculator.displayValue = `${parseFloat(result.toFixed(8))}`;
                calculator.firstOperand = result;
                calculator.lastResult = result;
            } catch (error) {
                calculator.displayValue = 'Error';
                setTimeout(() => resetCalculator(), 1500);
                return;
            }
        }
        
        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator === '=' ? null : nextOperator;
        updateHistory();
    }
    
    // Calculate result based on operator
    function performCalculation() {
        const { firstOperand, operator, displayValue } = calculator;
        const secondOperand = parseFloat(displayValue);
        
        if (isNaN(firstOperand) || isNaN(secondOperand)) {
            return secondOperand;
        }
        
        let result;
        
        switch (operator) {
            case '+':
                result = firstOperand + secondOperand;
                break;
            case '-':
                result = firstOperand - secondOperand;
                break;
            case '*':
                result = firstOperand * secondOperand;
                break;
            case '/':
                if (secondOperand === 0) {
                    throw new Error('Division by zero');
                }
                result = firstOperand / secondOperand;
                break;
            default:
                return secondOperand;
        }
        
        // Check if result is valid
        if (!isFinite(result)) {
            throw new Error('Invalid calculation result');
        }
        
        return result;
    }
    
    // Reset calculator to initial state
    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        calculator.lastResult = null;
        updateDisplay();
        historyDisplay.textContent = '';
    }
    
    // Handle percentage button
    function calculatePercentage() {
        const currentValue = parseFloat(calculator.displayValue);
        
        if (!isNaN(currentValue)) {
            if (calculator.operator && calculator.firstOperand !== null) {
                // If in middle of operation, calculate percentage of first operand
                calculator.displayValue = `${(calculator.firstOperand * (currentValue / 100)).toFixed(8)}`;
            } else {
                // Otherwise, just convert to percentage (divide by 100)
                calculator.displayValue = `${(currentValue / 100).toFixed(8)}`;
            }
            // Remove trailing zeros
            calculator.displayValue = `${parseFloat(calculator.displayValue)}`;
        }
    }
    
    // Toggle positive/negative
    function toggleSign() {
        const currentValue = parseFloat(calculator.displayValue);
        
        if (!isNaN(currentValue) && currentValue !== 0) {
            calculator.displayValue = `${-currentValue}`;
        }
    }

    // Event listeners for button clicks
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const { value } = button.dataset;
            
            // Apply button press animation
            button.classList.add('active');
            setTimeout(() => button.classList.remove('active'), 100);
            
            // Handle different button types
            switch (value) {
                case '+':
                case '-':
                case '*':
                case '/':
                case '=':
                    handleOperator(value);
                    break;
                case '.':
                    inputDecimal();
                    break;
                case 'C':
                    resetCalculator();
                    break;
                case '%':
                    calculatePercentage();
                    break;
                case '±':
                    toggleSign();
                    break;
                default:
                    // Must be a digit
                    if (!isNaN(value)) {
                        inputDigit(value);
                    }
            }
            
            updateDisplay();
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', (event) => {
        let { key } = event;
        
        // If Enter key is pressed, treat as equals
        if (key === 'Enter') key = '=';
        
        // If Escape key is pressed, clear the calculator
        if (key === 'Escape') {
            resetCalculator();
            return;
        }
        
        // Match keyboard input to calculator buttons
        if (/\d/.test(key)) {
            event.preventDefault();
            inputDigit(key);
        } else if (key === '.') {
            event.preventDefault();
            inputDecimal();
        } else if (['+', '-', '*', '/', '='].includes(key)) {
            event.preventDefault();
            handleOperator(key);
        }
        
        updateDisplay();
    });
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const themeIcon = themeToggle.querySelector('i');
        document.body.classList.toggle('dark-mode');
        
        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const themeIcon = themeToggle.querySelector('i');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    
    // Initialize the calculator display
    updateDisplay();
});
