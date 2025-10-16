export function calculateResult(
    previousResult: number,
    operationType: string,
    operand: number
): number {
    switch (operationType) {
        case 'add':
            return previousResult + operand;
        case 'subtract':
            return previousResult - operand;
        case 'multiply':
            return previousResult * operand;
        case 'divide':
            if (operand === 0) throw new Error('Division by zero');
            return previousResult / operand;
        default:
            throw new Error('Invalid operation type');
    }
}