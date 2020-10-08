// important variables ---------------------

const calculator = document.querySelector('#calculator');
const screen = document.querySelector('#screen');
const calcBtns = document.querySelectorAll('.calcBtn');
const operateBtns = Array.from(document.querySelectorAll('.operateBtn'));

let inputStr = '0';
let lastOperator = '';
let lastNum = 0;
const maxScreenDigits = 11;
const numArray = [];
const operatorArray = [];

setScreen(inputStr);
let debug = true;

// setup event listener functions ---------------- 

// main update function for calculator
calculator.addEventListener('click', (event) => { updateCalc(event.target) });

// keyboard input
window.addEventListener('keydown', (event) => {
    let key = getAltKeyElement(event.key);
    if (!key) return;

    key.classList.add('active');
    key.dispatchEvent(new Event('click'));
    updateCalc(key);
});

window.addEventListener('keyup', (event) => {
    const key = getAltKeyElement(event.key);
    if (!key) return;

    key.classList.remove('active');
    key.dispatchEvent(new Event('click'));
});

// utility functions -----------------------

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetArrays() {
    numArray.length = 0,
    operatorArray.length = 0;
    lastOperator = '';
    lastNum = 0;
}

function clear() {
    inputStr = '0';
    resetArrays();
    clearActiveOperatorBtn();
    setScreen(inputStr);
}

function clearActiveOperatorBtn() {
    let button = checkForActiveOperatorBtn();
    if (button) button.classList.toggle('selected');
}

function checkForActiveOperatorBtn() {
    return operateBtns.find(btn => btn.classList.contains('selected'))
}

function getAltKeyElement(key) {

    switch (key) {
        case 'Escape':
        case 'Backspace':
            key = 'c';
            break;

        case 'Enter':
            key = '='
            break;

        case 'Alt':
            key = '+/-'
            break;
    }
    return document.querySelector(`div [data-key='${key}']`);
}

function setScreen(string) {

    if (typeof string === 'number')
        string = string.toString();

    if (string !== '0') string = shrinkBigNumbers(string);

    screen.innerHTML = string;
}

function shrinkBigNumbers(numStr) {

    // if number isn't larger than the screen size, return
    if (numStr.length <= maxScreenDigits) return numStr;
    
    // if number doesn't contain a decimal
    if (!numStr.includes('.')) {
        // convert to exponential notation
        numStr = parseInt(numStr).toExponential(5);
    }
    // if a number does contain a decimal
    else {
        let  decimalArray = numStr.split('.');

        // if the whole number side is large
        if (decimalArray[0].length >= 6) {
            let decimalSpaceLeft = (maxScreenDigits - 1) - decimalArray[0].length;

            if (decimalSpaceLeft === 0) {
                numStr = parseInt(numStr).toExponential(5);
            } else {
                decimalArray[1] = decimalArray[1].slice(0, decimalSpaceLeft);
                numStr = decimalArray.join('.');
            }
        }
        // if the decimal side is large
        else if (decimalArray[1].length > decimalArray[0].length) {

            // if the number is really close to 0
            if (decimalArray[1].length > 4 && decimalArray[0] === '0') {
                numStr = parseFloat(numStr).toPrecision(1);
            } else {
                decimalArray[1] = decimalArray[1].slice(0, 4);
                numStr = decimalArray.join('.');
            }
        }
    }
    return numStr;
}

function performOperation() {
    inputStr = '0';

    if (numArray.length > 1) {

        // check for division by zero
        if (operatorArray[0] === '/' && numArray[1] === 0) {
            screen.classList.toggle('blinking');
            screen.innerHTML = "You can't divide by zero!";

            sleep(3000).then(() => {
                screen.classList.toggle('blinking');
                clear();
            });
            return;
        }

        let result = operate(operatorArray[0], numArray[0], numArray[1]);
        
        // save previous variables
        lastOperator = operatorArray.shift();
        lastNum = numArray[1];

        numArray.length = 0;
        numArray.push(result);
        
        if (debug) console.log(numArray, operatorArray);

        setScreen(result);
    }
}

// button functions ---------------- 

function numBtnUpdate(targetBtn) {
    
    if (targetBtn.id === 'dot') {
        // return if user tries to input more than one decimal dot
        if (inputStr.includes('.')) return;
        // add 0 to new dot if 0 isn't there
        if (numArray.length === 1) inputStr = '0';

    } else if (targetBtn.id === 'zero') {
        // stop repeating zeroes
        if (numArray.length === 0 && inputStr === '0') return;
    }
    // overwrite 0 with new value
    if (inputStr === '0' && targetBtn.id !== 'dot') inputStr = '';

    // stop number overflow on screen
    if (inputStr.length === maxScreenDigits) return;

    inputStr += targetBtn.innerHTML;
    setScreen(inputStr);
}

function funcBtnUpdate(targetBtn) {

    let targetValue = +inputStr;

    if (numArray.length === 0 && targetValue === 0) return;
    else if (numArray.length === 1 && targetValue === 0) {
        targetValue = numArray[0];
    }
    
    switch(targetBtn.id) {
        case 'plus-minus':
            inputStr = -targetValue;
            break;
            
        case 'percent':
            inputStr = targetValue / 100;
            break;
    }

    if (numArray.length === 1) {
        numArray[0] = inputStr;
        if (debug) console.log(numArray, operatorArray);
    }

    setScreen(inputStr);
}

function operateBtnUpdate(targetBtn) {

    let currentBtn = checkForActiveOperatorBtn();

    // handle operator array
    if (currentBtn) {
        operatorArray[0] = targetBtn.innerHTML;
        targetBtn.classList.toggle('selected');
        currentBtn.classList.toggle('selected');
    } else {
        targetBtn.classList.toggle('selected');
        operatorArray.push(targetBtn.innerHTML);
    }

    // handle numArray
    if (numArray.length === 0) {
        numArray.push(+inputStr);
    }

    if (debug) console.log(numArray, operatorArray);

    performOperation();
}

function equalsBtnUpdate() {

    if (inputStr === '0' && numArray.length === 0) {
        // nothing to redo, exit
        if (lastOperator === '' && lastNum === 0) return;

        numArray.push(lastNum);
        operatorArray.push(lastOperator);

    } else if (numArray.length === 1 && operatorArray.length === 0) {
        // swap out first index with lastNum and add the new input
        numArray[0] = +inputStr;
        numArray[1] = lastNum;
        operatorArray.push(lastOperator);
        
    } else {
        // otherwise just push last operator
        numArray.push(+inputStr);
    }

    if (debug) console.log(numArray, operatorArray);

    performOperation();
    clearActiveOperatorBtn();
}

function updateCalc(button) {

    // if clear button pressed
    if (button.id === 'clear') {
        clear();
        return;
    }
    
    let classList = button.classList;

    // if number button pressed
    if (classList.contains('numBtn')) {
        numBtnUpdate(button);
    }
    // if function button pressed
    else if (classList.contains('funcBtn')) {
        funcBtnUpdate(button);
    }
    // if operate button pressed
    else if (classList.contains('operateBtn')) {
        operateBtnUpdate(button);
    }
    // if equals button pressed
    else if (button.id === 'equals') {
        equalsBtnUpdate();
    }
}

// math functions -----------------------

function add(num1, num2) {
	return num1 + num2;
}

function subtract(num1, num2) {
	return num1 - num2;
}

function multiply(num1, num2) {
	return num1 * num2;
}

function divide(num1, num2) {
    return num1 / num2;
}

function operate(operator, num1, num2) {
    let result = 0;

    switch(operator) {
        case '+':
            result = add(num1, num2);
            break;
        case '-':
            result = subtract(num1, num2);
            break;
        case 'x':
            result = multiply(num1, num2);
            break;
        case '/':
            result = divide(num1, num2);
            break;
    }

    // const roundedResult = Math.round(result * 1000) / 1000;
    return result;
}