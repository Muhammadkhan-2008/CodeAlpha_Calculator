document.addEventListener('DOMContentLoaded', function() {
    // Calculator state
    const calculator = {
        displayValue: '0',
        firstOperand: null,
        waitingForSecondOperand: false,
        operator: null,
        operationHistory: '',
        lastResult: null
    };

    // DOM Elements
    const display = document.getElementById('display');
    const operationDisplay = document.getElementById('operation-display');
    const buttons = document.querySelectorAll('.btn');
    
    // Update the display
    function updateDisplay() {
        display.textContent = calculator.displayValue;
        operationDisplay.textContent = calculator.operationHistory;
        
        // Add animation effect
        display.style.transform = 'scale(1.05)';
        setTimeout(() => {
            display.style.transform = 'scale(1)';
        }, 100);
    }
    
    // Reset calculator
    function resetCalculator() {
        calculator.displayValue = '0';
        calculator.firstOperand = null;
        calculator.waitingForSecondOperand = false;
        calculator.operator = null;
        calculator.operationHistory = '';
        updateDisplay();
    }
    
    // Clear entry (current input)
    function clearEntry() {
        calculator.displayValue = '0';
        updateDisplay();
    }
    
    // Delete last character
    function deleteLast() {
        if (calculator.displayValue.length > 1) {
            calculator.displayValue = calculator.displayValue.slice(0, -1);
        } else {
            calculator.displayValue = '0';
        }
        updateDisplay();
    }
    
    // Input a digit
    function inputDigit(digit) {
        const { displayValue, waitingForSecondOperand } = calculator;
        
        if (waitingForSecondOperand === true) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
        
        updateDisplay();
    }
    
    // Input a decimal point
    function inputDecimal() {
        if (calculator.waitingForSecondOperand === true) {
            calculator.displayValue = '0.';
            calculator.waitingForSecondOperand = false;
            return;
        }
        
        if (!calculator.displayValue.includes('.')) {
            calculator.displayValue += '.';
        }
        
        updateDisplay();
    }
    
    // Handle operators
    function handleOperator(nextOperator) {
        const { firstOperand, displayValue, operator } = calculator;
        const inputValue = parseFloat(displayValue);
        
        // Update operation history display
        if (calculator.operator) {
            calculator.operationHistory = `${firstOperand} ${getOperatorSymbol(calculator.operator)} ${inputValue}`;
        }
        
        if (operator && calculator.waitingForSecondOperand) {
            calculator.operator = nextOperator;
            calculator.operationHistory = `${firstOperand} ${getOperatorSymbol(nextOperator)}`;
            updateDisplay();
            return;
        }
        
        if (firstOperand === null && !isNaN(inputValue)) {
            calculator.firstOperand = inputValue;
        } else if (operator) {
            const result = calculate(firstOperand, inputValue, operator);
            
            calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
            calculator.firstOperand = result;
            calculator.operationHistory = `${firstOperand} ${getOperatorSymbol(operator)} ${inputValue} =`;
            calculator.lastResult = result;
        }
        
        calculator.waitingForSecondOperand = true;
        calculator.operator = nextOperator;
        updateDisplay();
    }
    
    // Perform calculation
    function calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                if (secondOperand === 0) {
                    alert('Cannot divide by zero!');
                    resetCalculator();
                    return 0;
                }
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }
    
    // Get operator symbol for display
    function getOperatorSymbol(operator) {
        switch (operator) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return operator;
        }
    }
    
    // Handle button clicks
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const { value } = this.dataset;
            
            // Add click animation
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 150);
            
            // Handle different button types
            if (value === 'clear') {
                resetCalculator();
                return;
            }
            
            if (value === 'clear-entry') {
                clearEntry();
                return;
            }
            
            if (value === 'backspace') {
                deleteLast();
                return;
            }
            
            if (value === '.') {
                inputDecimal();
                return;
            }
            
            if (value === '=') {
                if (calculator.operator && calculator.firstOperand !== null) {
                    handleOperator(calculator.operator);
                    calculator.operator = null;
                    calculator.operationHistory = '';
                }
                return;
            }
            
            // Check if the value is an operator
            if (['+', '-', '*', '/'].includes(value)) {
                handleOperator(value);
                return;
            }
            
            // Otherwise, it's a number
            inputDigit(value);
        });
    });
    
    // Keyboard support
    document.addEventListener('keydown', function(event) {
        const { key } = event;
        
        // Prevent default for calculator keys
        if (/[\d+\-*/.=]|Enter|Backspace|Delete|Escape/.test(key)) {
            event.preventDefault();
        }
        
        // Handle key presses
        if (key >= '0' && key <= '9') {
            inputDigit(key);
        } else if (key === '.') {
            inputDecimal();
        } else if (key === '+' || key === '-' || key === '*' || key === '/') {
            handleOperator(key);
        } else if (key === 'Enter' || key === '=') {
            if (calculator.operator && calculator.firstOperand !== null) {
                handleOperator(calculator.operator);
                calculator.operator = null;
                calculator.operationHistory = '';
            }
        } else if (key === 'Escape' || key === 'Delete') {
            resetCalculator();
        } else if (key === 'Backspace') {
            deleteLast();
        } else if (key === 'c' || key === 'C') {
            resetCalculator();
        }
        
        // Highlight the pressed button
        highlightButton(key);
    });
    
    // Highlight button when key is pressed
    function highlightButton(key) {
        let buttonValue = key;
        
        // Map keyboard keys to button values
        if (key === 'Enter') buttonValue = '=';
        if (key === 'Escape' || key === 'Delete') buttonValue = 'clear';
        if (key === 'Backspace') buttonValue = 'backspace';
        
        const button = document.querySelector(`[data-value="${buttonValue}"]`);
        if (button) {
            button.classList.add('key-pressed');
            setTimeout(() => {
                button.classList.remove('key-pressed');
            }, 150);
        }
    }
    
    // Add CSS for key pressed effect
    const style = document.createElement('style');
    style.textContent = `
        .key-pressed {
            transform: translateY(2px) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            background-color: #dfe6e9 !important;
        }
        .operator.key-pressed {
            background-color: #5b4fcf !important;
        }
        .equals.key-pressed {
            background-color: #00a085 !important;
        }
        .clicked {
            transform: translateY(2px) !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
    `;
    document.head.appendChild(style);
    
    // Initialize calculator display
    updateDisplay();
    
    // Add welcome message
    setTimeout(() => {
        operationDisplay.textContent = "Welcome! Use keyboard or buttons";
        setTimeout(() => {
            if (calculator.operationHistory === '') {
                operationDisplay.textContent = '';
            }
        }, 3000);
    }, 1000);
});