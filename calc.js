// important variables ---------------------

let inputStr = '';
const numArray = [];
const operatorArray = [];

const calculator = document.querySelector('#calculator');
const screen = document.querySelector('#screen');
const calcBtns = document.querySelectorAll('.calcBtn');
const operateBtns = document.querySelectorAll('.operateBtn');

// setup event listener functions ---------------- 

// main update function for calculator
calculator.addEventListener('mouseup', updateCalc);

// keyboard input
window.addEventListener('keydown', (event) => {
    let key = getAltKeyElement(event.key);
    if (!key) return;

    key.focus();
    key.dispatchEvent(new Event('mousedown'));
});

window.addEventListener('keyup', (event) => {
    const key = getAltKeyElement(event.key);
    if (!key) return;

    updateCalc(event);
    key.dispatchEvent(new Event('mouseup'));
});

// highlight operate buttons with larger border when clicked
operateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        resetActiveOperatorBtn();
        btn.classList.add('active');
    });
});

// add tabIndex and highlight each calculator button when clicked
calcBtns.forEach(btn => {
    btn.setAttribute('tabIndex', '0');

    btn.addEventListener('mousedown', () => {
        btn.style.cssText = 'color: white; background-color: black';
    });

    btn.addEventListener('mouseup', () => {
        btn.style.cssText = 'color: black background-color: white';
    });
});

// button functions -----------------------
function resetArrays() {
    numArray.length = 0,
    operatorArray.length = 0;
}

// reset operator button border size
function resetActiveOperatorBtn() {
    operateBtns.forEach(btn => {
        if(btn.classList.contains('active'))
        btn.classList.remove('active');
    });
}

function getAltKeyElement(key) {

    switch (key) {
        case 'Escape':
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

        if (decimalPlaces > 10)
            inputStr = inputStr.toFixed(10);
    }
    
    setScreen(inputStr);
}

function performOperation() {
    inputStr = '';

    if (numArray.length > 1) {

        // check for division by zero
        if (operatorArray[0] === '/' && numArray[1] === 0) {
            setScreen("You can't divide by zero!");
            resetArrays();
            return;
        }

        let result = operate(operatorArray[0], numArray[0], numArray[1]);
        
        numArray.length = 0;
        numArray.push(result);
        operatorArray.shift();
        
        setScreen(result);
        console.log(numArray, operatorArray);
    }
}

function numBtnUpdate(targetBtn) {
    // check if user tries to input more than one decimal dot
    if (targetBtn.id === 'dot' && inputStr.includes('.')) 
        return;

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

    console.log(numArray, operatorArray);
    performOperation();
    
    resetActiveOperatorBtn();
}

function updateCalc(event) {
    // if clear button pressed
    if (event.target.id === 'clear') {
        clear();
        return;
    }
    
    let classList = event.target.classList;

    // if number button pressed
    if (classList.contains('numBtn')) {
        numBtnUpdate(event.target);
    }
    // if function button pressed
    else if (classList.contains('funcBtn')) {
        funcBtnUpdate(event.target);
    }
    // if operate button pressed
    else if (classList.contains('operateBtn')) {
        operateBtnUpdate(event.target);
    }
    // if equals button pressed
    else if (event.target.id === 'equals') {
        equalsBtnUpdate();
    }
}

function handleKeyboardInput(event) {

    console.log(event.code);

    // check for digits and operater chars
    let filterRegEx = /[c\.\d\-\+\/\\*\%\r]/i;
    
    // if pressed key is not a digit, ignore
    if (!filterRegEx.test(event.key)) return;

    // check for multiple dots too

    // figure out how to send a cal btn event when a key is pressed
    // or use data-keys in the html to fire the event

    inputStr += event.key;
    setScreen(inputStr);
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