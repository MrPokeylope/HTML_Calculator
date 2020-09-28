// important variables ---------------------

let inputArray = [];
let screenStr = '';

const calculator = document.querySelector('#calculator');
const screen = document.querySelector('#screen');
const calcBtns = document.querySelectorAll('.calcBtn');

// event listener functions ---------------- 

calculator.addEventListener('mouseup', updateScreen);

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

function clearScreen() {
    screenStr = '';
    setScreen(screenStr);
}

function changeSign(num) {
    if (num === 0) return;

    screenStr = -num;
    setScreen(screenStr);
}

function getPercentage(num) {
    screenStr = num / 100;
    setScreen(screenStr);
}

function updateScreen(event) {

    if (event.target.id === 'clear') {
        clearScreen();
        return;
    }
    
    let buttonStr = event.target.innerHTML;
    let classList = event.target.classList;

    if (classList.contains('numBtn')) {
        screenStr += buttonStr;
        setScreen(screenStr);
    }
    else if (classList.contains('funcBtn') || classList.contains('operateBtn')) {
        let input = parseInt(screenStr);

        switch(event.target.id) {
            case 'plus-minus':
                changeSign(input);
                break;

            case 'percent':
                getPercentage(input);
                break;

            case 'divide':
            case 'multiply':
            case 'subtract':
            case 'add':
                inputArray.push(input, buttonStr);
                screenStr = '';
                break;

            case 'equals':
                inputArray.push(input);
                console.log('Before operate: ' + inputArray);
                operate(inputArray[1], inputArray[0], inputArray[2]);
                inputArray = [];
                break;
        }
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
    screenStr = result;
    setScreen(result);
}