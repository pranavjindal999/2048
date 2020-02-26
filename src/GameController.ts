import { MoveDirection } from './types';
import Joi from '@hapi/joi';
import { Board } from './Board';
import { readInput } from './utils';
import chalk from 'chalk';

export class GameController {
    board!: Board;

    constructor() {
        this.startNewGame();
    }

    async startNewGame() {
        console.log('\n\nStarting new game.')
        const size: number = await readInput('Enter board size: ', Joi.number())
        this.board = new Board(size);
        this.board.display();
        this.startGameInputLoop();
    }

    async startGameInputLoop() {
        const moveInput: MoveDirection = await readInput('Next move: ', Joi.string().pattern(/^[wasd]$/))
        this.board.mergeAndMove(moveInput);
        this.board.addNewNumber();
        this.board.display();

        if(this.board.isGameOver()) {
            console.log(chalk.red('You lost!'))
            this.startNewGame();
        } else if(this.board.isGameWon) {
            console.log(chalk.green('You Won!'))
            this.startNewGame();
        } else {
            this.startGameInputLoop();
        }
    }
}