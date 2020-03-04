import Joi from "@hapi/joi";
const readline = require('readline-promise').default;

let rlp: any;

export type IterationState = {
    readonly from: number;
    readonly to: number;
    current: number;
}

export type IterationCallback = (iterationValue: IterationState) => void | 'break';

/**
 *  Executes the callback for every number in range provided.
 *  To early terminate the loop, return false from callback.
 *
 * @param {[number, number]} [from, to] range of numbers to iterate (both numbers inclusive)
 * @param {IterationCallback} callback iteration function to call with iteration state
 */
function forEveryNumberIn(
    [from, to]: [number, number],
    callback: IterationCallback
) {
    const state: IterationState = {
        from,
        to,
        current: from
    }

    const iterationModifier = from >= to ? () => --state.current : () => ++state.current;
    let iterationPredicate!: () => boolean;
    switch (true) {
        case from > to:
            iterationPredicate = () => state.current >= to;
            break;
        case from < to:
            iterationPredicate = () => state.current <= to;
            break;
        case from === to:
            iterationPredicate = () => state.current === to;
            break;
    }

    while(iterationPredicate()) {
        let returnValue = callback(state);
        if(returnValue === "break") {
            break;
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