// button functions ---------------------------

const calcBtns = document.querySelectorAll('.calcBtn');
const screen = document.querySelector('#screen');

let operateStr = '';

calcBtns.forEach(btn => {
    btn.addEventListener('mousedown', () => {
        btn.style.cssText = 'color: white; background-color: black';
    });

    btn.addEventListener('mouseup', () => {
        btn.style.cssText = 'color: black background-color: white';

        operateStr += btn.innerHTML;
        screen.innerHTML = operateStr;
    });
});


// end of button functions --------------------

// operator functions -----------------------

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
        case '*':
            result = multiply(num1, num2);
            break;
        case '/':
            result = divide(num1, num2);
            break;
    }

    // const roundedResult = Math.round(result * 1000) / 1000;
    return result;
}

// end of operator functions -------------------

// console.log(operate('+', 2, 2));