import Joi from "@hapi/joi";
const readline = require('readline-promise').default;

const rlp = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

/**
 *  Executes the callback for every number in range provided.
 *  To early terminate the loop, return false from callback.
 *
 * @param {[number, number]} [from, to] range of numbers to iterate (both numbers inclusive)
 * @param {((iterationValue: number) => void | false)} callback iteration function to call with current iteration value
 */
function forEveryNumberIn(
    [from, to]: [number, number],
    callback: (iterationValue: number) => void | false
) {
    const iterationModifier = from >= to ? () => --from : () => ++from;
    let iterartionPredicate!: () => boolean;
    switch (true) {
        case from > to:
            iterartionPredicate = () => from >= to;
            break;
        case from < to:
            iterartionPredicate = () => from <= to;
            break;
        case from === to:
            iterartionPredicate = () => from === to;
            break;
    }

    while(iterartionPredicate()) {
        let returnValue = callback(from);
        if(returnValue === false) {
            return false;
        }
        iterationModifier();
    }
}

/**
 * Reads input from Standard input.
 *
 * @param {string} question
 * @param {Joi.Schema} validation
 * @returns {Promise<any>}
 */
async function readInput(question: string, validation: Joi.Schema = Joi.any()): Promise<any> {
    const input = await rlp.questionAsync(question);

    const validationResult = validation.validate(input);
    if(validationResult.error || validationResult.errors) {
        console.log('Invalid input, try again!');
        return readInput(question, validation);
    } else {
        return validationResult.value;
    }
}

export {
    readInput,
    forEveryNumberIn
}