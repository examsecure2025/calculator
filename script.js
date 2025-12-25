let calculatorCurrentValue = '0';
let calculatorPreviousValue = '';
let calculatorOperation = null;
let calculatorShouldResetDisplay = false;

const calculatorDisplay = document.getElementById('calculatorDisplay');
const calculatorExpression = document.getElementById('calculatorExpression');
const calculatorError = document.getElementById('calculatorError');
const calculatorClearBtn = document.getElementById('calculatorClear');
const calculatorEqualsBtn = document.getElementById('calculatorEquals');

//  funcion para mapakita sagot sa calculator
function updateCalculatorDisplay() {
    calculatorDisplay.textContent = calculatorCurrentValue;
    if (calculatorDisplay.scrollWidth > calculatorDisplay.clientWidth) {
        calculatorDisplay.style.fontSize = '24px';
    } else {
        calculatorDisplay.style.fontSize = '';
    }
}

function getOperatorSymbol(operator) {
    switch(operator) {
        case 'add':
            return '+';
        case 'subtract':
            return '-';
        case 'multiply':
            return '×';
        case 'divide':
            return '÷';
        default:
            return '';
    }
}

function updateCalculatorExpression() {
    if (calculatorPreviousValue !== '' && calculatorOperation !== null) {
        const operatorSymbol = getOperatorSymbol(calculatorOperation);
        calculatorExpression.textContent = calculatorPreviousValue + ' ' + operatorSymbol + ' ' + calculatorCurrentValue;
    } else {
        calculatorExpression.textContent = '';
    }
}

function clearCalculatorError() {
    calculatorError.textContent = '';
    calculatorError.classList.remove('show');
}

function showCalculatorError(message) {
    calculatorError.textContent = message;
    calculatorError.classList.add('show');
    setTimeout(clearCalculatorError, 3000);
}

// dito ung input ng user na  number na pinindot ng user
function handleNumberInput(number) {
    if (calculatorShouldResetDisplay) {
        calculatorCurrentValue = '0';
        calculatorShouldResetDisplay = false;
    }

    if (number === '.' && calculatorCurrentValue.includes('.')) {
        return;
    }

    if (calculatorCurrentValue === '0' && number !== '.') {
        calculatorCurrentValue = number;
    } else {
        calculatorCurrentValue += number;
    }

    clearCalculatorError();
    updateCalculatorDisplay();
    updateCalculatorExpression();
}

// ito yung  na natitriger kung anong operator pinindot ni user
function handleOperatorInput(operator) {
    const inputValue = parseFloat(calculatorCurrentValue);

    if (calculatorPreviousValue === '') {
        calculatorPreviousValue = inputValue;
    } else if (calculatorOperation) {
        const result = performCalculation();
        calculatorCurrentValue = String(result);
        calculatorPreviousValue = result;
        updateCalculatorDisplay();
    }

    calculatorShouldResetDisplay = true;
    calculatorOperation = operator;
    updateCalculatorExpression();
    clearCalculatorError();
}

// dito   yung actual na pagcompute ng numbers 
function performCalculation() {
    const prev = parseFloat(calculatorPreviousValue);
    const current = parseFloat(calculatorCurrentValue);

    if (isNaN(prev) || isNaN(current)) {
        showCalculatorError('Invalid input');
        return 0;
    }

    switch (calculatorOperation) {
        case 'add':
            return prev + current;
        case 'subtract':
            return prev - current;
        case 'multiply':
            return prev * current;
        case 'divide':
            if (current === 0) {
                showCalculatorError('Cannot divide by zero');
                return prev;
            }
            return prev / current;
        default:
            return current;
    }
}

function handleEqualsClick() {
    if (calculatorOperation === null || calculatorPreviousValue === '') {
        return;
    }

    const button = calculatorEqualsBtn;
    button.disabled = true;
    button.classList.add('loading');

    setTimeout(function() {
        const result = performCalculation();
        const operatorSymbol = getOperatorSymbol(calculatorOperation);
        calculatorExpression.textContent = calculatorPreviousValue + ' ' + operatorSymbol + ' ' + calculatorCurrentValue + ' =';
        calculatorCurrentValue = String(result);
        calculatorPreviousValue = '';
        calculatorOperation = null;
        calculatorShouldResetDisplay = true;
        updateCalculatorDisplay();

        button.classList.remove('loading');
        button.disabled = false;
    }, 300);
}

function clearCalculator() {
    calculatorCurrentValue = '0';
    calculatorPreviousValue = '';
    calculatorOperation = null;
    calculatorShouldResetDisplay = false;
    calculatorExpression.textContent = '';
    clearCalculatorError();
    updateCalculatorDisplay();
}

function handleClearClick() {
    const button = calculatorClearBtn;
    button.disabled = true;
    button.classList.add('loading');

    setTimeout(function() {
        clearCalculator();
        button.classList.remove('loading');
        button.disabled = false;
    }, 200);
}


function setupCalculatorEventListeners() {
    const numberButtons = document.querySelectorAll('.calculator-btn-number');
    const operatorButtons = document.querySelectorAll('.calculator-btn-operator');

    numberButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const number = button.getAttribute('data-number');
            handleNumberInput(number);
        });
    });

    operatorButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const action = button.getAttribute('data-action');
            handleOperatorInput(action);
        });
    });

    calculatorEqualsBtn.addEventListener('click', handleEqualsClick);
    calculatorClearBtn.addEventListener('click', handleClearClick);
}

document.addEventListener('DOMContentLoaded', function() {
    setupCalculatorEventListeners();
    updateCalculatorDisplay();
});
