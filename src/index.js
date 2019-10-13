const ADDITION = '+';
const SUBTRACTION = '-';
const DIVISION = '/';
const MULTIPLICATION = '*';
const NUMBEERS = '0123456789.';

function eval() {
	// Do not use eval!!!
	return;
}

function CustomException(type, message) {
	return new Error(type + ' ' + message);
}

function BracketsException() {
	return new CustomException('ExpressionError:', 'Brackets must be paired');
}

function ZeroException() {
	const error = new CustomException('TypeError:', 'Division by zero.');
	return error;
}

function removeSpaces(expr) {
	return expr.replace(/\s/g, '');
}

function isValidBrackets(str) {
	var testFlow = '';
	var isCorrect = true;
	var index = 0;
	if (str.indexOf('()') !== -1) {
		isCorrect = false;
	}
	while (isCorrect && index < str.length) {
		if (str.charAt(index) === '(') {
			testFlow = testFlow + '(';
		} else {
			if (str.charAt(index) === ')') {
				if (testFlow.length > 0 && testFlow.charAt(testFlow.length - 1) === '(') {
					testFlow = testFlow.substring(0, testFlow.length - 1);
				} else {
					isCorrect = false;
				}
			}
		}
		index++;
	}
	return isCorrect && testFlow === '';
}

function separateNumbersAndOperation(expr) {
	var numbers = [];
	var operations = [];
	var number = '';
	for (var index = 0; index < expr.length; index++) {
		if (NUMBEERS.indexOf(expr[index]) === -1) {
			if (number !== '') {
				numbers.push(parseFloat(number));
				number = '';
			}
			if (expr[index] === SUBTRACTION) {
				if (index !== 0 && NUMBEERS.indexOf(expr[index - 1]) !== -1) {
					operations.push(ADDITION);
				}
				number = '-';
			} else {
				operations.push(expr[index]);
			}		
		} else {
			number = number + expr[index];
		}
	}
	if (number !== '') {
		numbers.push(parseFloat(number));
		number = '';
	}
	return {
		numbers: numbers,
		operations: operations
	};
}

function countHighOperation(operations) {
	var count = 0;
	operations.forEach(function(operation) {
		if (operation === MULTIPLICATION || operation === DIVISION) {
			count++;
		}
	});
	return count;
}

function calculate(operation, firstValue, secondValue) {
	switch (operation) {
		case ADDITION: return firstValue + secondValue;
		case SUBTRACTION: return firstValue - secondValue;
		case MULTIPLICATION: return firstValue * secondValue;
		case DIVISION: return firstValue / secondValue;
		default: return false;
	}
}

function calculateExpressionWithoutBrackets(expr) {
	var separetedExpression = separateNumbersAndOperation(expr);
	var numberOfHighOperations = countHighOperation(separetedExpression.operations);
	var operationCount = separetedExpression.operations.length;
	while (operationCount !== 0) {
		var index = 0;
		if (numberOfHighOperations !== 0) {
			while (numberOfHighOperations !== 0) {
				if (separetedExpression.operations[index] === MULTIPLICATION || separetedExpression.operations[index] === DIVISION ) {
					if (separetedExpression.operations[index] === DIVISION && separetedExpression.numbers[index + 1] === 0) {
						throw new ZeroException();
					}
					const result = calculate(separetedExpression.operations[index], separetedExpression.numbers[index], separetedExpression.numbers[index + 1]);
					separetedExpression.operations.splice(index, 1);
					separetedExpression.numbers.splice(index, 1);
					separetedExpression.numbers[index] = result;
					numberOfHighOperations--;
					operationCount--;
				} else {
					index++;
				}
			}
		} else {
			while (operationCount !== 0) {
				const result = calculate(separetedExpression.operations[index], separetedExpression.numbers[index], separetedExpression.numbers[index + 1]);
				separetedExpression.operations.splice(index, 1);
				separetedExpression.numbers.splice(index, 1);
				separetedExpression.numbers[index] = result;
				operationCount--;
			}
		}
	}
	return separetedExpression.numbers[0]
}

function calculateCountOfBrackets(expr) {
	return (expr.match(new RegExp(/\(/, 'g')) || []).length;
}

function calculateExpressionWithBrackets(expr) {
	var workingExpression = expr;
	var countOfBrackets = calculateCountOfBrackets(expr);
	while (countOfBrackets !== 0) {
		const firstClosedBracketPosition = workingExpression.indexOf(')');
		var correctOpenedBraketPosition = firstClosedBracketPosition - 1;
		var isFoundCorrectOpenedBraket = false;
		while (!isFoundCorrectOpenedBraket) {
			if (workingExpression[correctOpenedBraketPosition] !== '(') {
				correctOpenedBraketPosition--;
			} else {
				isFoundCorrectOpenedBraket = true;
			}
		}
		const smallExpression = workingExpression.substr(correctOpenedBraketPosition + 1, firstClosedBracketPosition - correctOpenedBraketPosition - 1 );
		const result = calculateExpressionWithoutBrackets(smallExpression);
		countOfBrackets--;
		if (correctOpenedBraketPosition === 0) {
			if (firstClosedBracketPosition === workingExpression.length - 1) {
				workingExpression = result;
			} else {
				workingExpression = result + workingExpression.substr(firstClosedBracketPosition + 1, workingExpression.length - 1);
			}
		} else {
			if (firstClosedBracketPosition === workingExpression.length - 1) {
				workingExpression = workingExpression.substr(0, correctOpenedBraketPosition) + result;
			} else {
				workingExpression = workingExpression.substr(0, correctOpenedBraketPosition) + result + workingExpression.substr(firstClosedBracketPosition + 1, workingExpression.length - 1);
			}
		}
		workingExpression = workingExpression.replace('+-', '-');
		workingExpression = workingExpression.replace('--', '+');
	}
	return calculateExpressionWithoutBrackets(workingExpression);
}

function expressionCalculator(expr) {
	const expression = removeSpaces(expr);
	var result = false;
	if (isValidBrackets(expression)) {
		if (expression.indexOf('(') !== -1) {
			result = calculateExpressionWithBrackets(expression);
		} else {
			result = calculateExpressionWithoutBrackets(expression);
		}
	} else {
		throw new BracketsException();
	}
	return result;
}

module.exports = {
	expressionCalculator
}