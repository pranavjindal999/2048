import Joi from "@hapi/joi";
const readline = require('readline-promise').default;

let rlp: any;

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
    let iterationPredicate!: () => boolean;
    switch (true) {
        case from > to:
            iterationPredicate = () => from >= to;
            break;
        case from < to:
            iterationPredicate = () => from <= to;
            break;
        case from === to:
            iterationPredicate = () => from === to;
            break;
    }

    while(iterationPredicate()) {
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
    rlp = rlp || readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true
    });
    
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