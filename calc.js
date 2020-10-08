// important variables ---------------------

const calculator = document.querySelector('#calculator');
const screen = document.querySelector('#screen');
const calcBtns = document.querySelectorAll('.calcBtn');
const operateBtns = document.querySelectorAll('.operateBtn');

let inputStr = '';
let lastOperation = '';
const maxScreenDigits = 11;
const numArray = [];
const operatorArray = [];

setScreen(inputStr);

// setup event listener functions ---------------- 

// main update function for calculator
calculator.addEventListener('click', (event) => { updateCalc(event.target) });

// keyboard input
window.addEventListener('keydown', (event) => {
    let key = getAltKeyElement(event.key);
    if (!key) return;

    // console.log(key);
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

// highlight operate buttons with larger border when clicked
operateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        resetActiveOperatorBtn();
        btn.classList.add('selected');
    });
});

// button functions -----------------------

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function resetArrays() {
    numArray.length = 0,
    operatorArray.length = 0;
}

// reset operator button border size
function resetActiveOperatorBtn() {
    operateBtns.forEach(btn => {
        if(btn.classList.contains('selected'))
        btn.classList.remove('selected');
    });
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

    if (string.length === 0)
        string = '0';
    else if (string.length > maxScreenDigits) {
        console.log('screen length: ' + string.length);
        console.log('inputstr: ' + inputStr);
        // string = string.slice(0, maxScreenDigits);
        string = parseFloat(string).toExponential(5);
    }

    screen.innerHTML = string;
}

function clear() {
    inputStr = '';
    resetArrays();
    resetActiveOperatorBtn();
    setScreen('');
}

function changeSign(num) {
    if (num === 0) return;

    inputStr = -num;
    setScreen(inputStr);
}

function getPercentage(num) {

    inputStr = num / 100;
    let decimalPlaces = inputStr.toString()
    
    if (decimalPlaces.includes('.')) {
        decimalPlaces = decimalPlaces.split('.')[1].length;

        if (decimalPlaces > maxScreenDigits)
            inputStr = inputStr.toFixed(maxScreenDigits);
    }
    
    setScreen(inputStr);
}

function performOperation() {
    inputStr = '';

    if (numArray.length > 1) {

        // check for division by zero
        if (operatorArray[0] === '/' && numArray[1] === 0) {
            screen.classList.toggle('blinking');
            screen.innerHTML = "You can't divide by zero!";

            sleep(3000).then( () => {
                screen.classList.toggle('blinking');
                clear();
            });
            return;
        }

        let result = operate(operatorArray[0], numArray[0], numArray[1]);
        
        numArray.length = 0;
        numArray.push(result);
        lastOperator = operatorArray.shift();
        
        setScreen(result);
        console.log(numArray, operatorArray);
    }
}

function numBtnUpdate(targetBtn) {
    
    if (targetBtn.id === 'dot') {
        // check if user tries to input more than one decimal dot
        if (inputStr.includes('.')) return;
        // otherwise add a zero to the input string
        if (inputStr.length === 0)
            inputStr = '0';
    } 

    inputStr += targetBtn.innerHTML;
    setScreen(inputStr);
}

function funcBtnUpdate(targetBtn) {

    switch(targetBtn.id) {
        case 'plus-minus':
            changeSign(+inputStr);
            break;

        case 'percent':
            if (numArray.length === 1 && inputStr === '')
                getPercentage(numArray[0]);
            else
                getPercentage(+inputStr);
            break;
    }
}

function operateBtnUpdate(targetBtn) {

    operatorArray.push(targetBtn.innerHTML);

    if (+inputStr !== 0)
        numArray.push(+inputStr);

    console.log(numArray, operatorArray);
    performOperation();
}

function equalsBtnUpdate() {

    if (inputStr === '') return;

    numArray.push(+inputStr);

    if (operatorArray.length === 0 && lastOperation !== '')
        operatorArray.push(lastOperator);

    console.log(numArray, operatorArray);
    performOperation();
    resetActiveOperatorBtn();
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