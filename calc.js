// important variables ---------------------

let numArray = [];
let operatorArray = [];
let inputStr = '';

const calculator = document.querySelector('#calculator');
const screen = document.querySelector('#screen');
const calcBtns = document.querySelectorAll('.calcBtn');
const operateBtns = document.querySelectorAll('.operateBtn');

// setup event listener functions ---------------- 

// main update function for calculator
calculator.addEventListener('mouseup', updateCalc);

// highlight operate buttons with larger border when clicked
operateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        resetActiveOperatorBtn();
        btn.classList.add('active');
    });
});

// highlight every calculator button when pressed
calcBtns.forEach(btn => {
    btn.addEventListener('mousedown', () => {
        btn.style.cssText = 'color: white; background-color: black';
    });

    btn.addEventListener('mouseup', () => {
        btn.style.cssText = 'color: black background-color: white';
    });
});

// button functions -----------------------

function setScreen(string) {
    screen.innerHTML = string;
}

// reset operator button border size
function resetActiveOperatorBtn() {
    operateBtns.forEach(btn => {
        if(btn.classList.contains('active'))
            btn.classList.remove('active');
    });
}

function clear() {
    numArray.length = 0;
    operatorArray.length = 0;
    inputStr = '';
    setScreen('');
    resetActiveOperatorBtn();
}

function changeSign(num) {
    if (num === 0) return;

    inputStr = -num;
    setScreen(inputStr);
}

function getPercentage(num) {
    inputStr = num / 100;
    setScreen(inputStr);
}

function performOperation() {
    inputStr = '';

    if (numArray.length > 1) {
        let result = operate(operatorArray[0], numArray[0], numArray[1]);
        
        numArray.length = 0;
        numArray.push(result);
        operatorArray.shift();
        
        setScreen(result);
        console.log(numArray, operatorArray);
    }
}

function numBtnUpdate(targetBtn) {
    inputStr += targetBtn.innerHTML;
    setScreen(inputStr);
}

function funcBtnUpdate(targetBtn) {

    let numInput = parseInt(inputStr);

    switch(targetBtn.id) {
        case 'plus-minus':
            changeSign(numInput);
            break;

        case 'percent':
            getPercentage(numInput);
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