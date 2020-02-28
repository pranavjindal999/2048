import { config } from './config';
import { random } from 'lodash';
import { forEveryNumberIn } from './utils';
import { MoveDirection, PositionTuple } from './types';
import chalk from 'chalk';

export class Board {
    private newItemLocation: PositionTuple = [0,0];
    private board: Array<Array<number>>;
    isGameWon = false;

    constructor(private readonly size: number) {
        this.board = (new Array(size)).fill([]);
        this.board.forEach((row, index) => {
            var arr = new Array(size);
            arr.fill(0);
            this.board[index] = arr;
        });

        // show two numbers initially
        this.addNewNumber();
        this.addNewNumber();
    }

    /**
     * Displays the board on console.
     */
    display() {
        console.clear();
        let output = '';
        this.board.forEach((rowItem, row) => {
            rowItem.forEach((num, column) => {
                const [rowIndex, columnIndex] = this.newItemLocation;
                if(rowIndex === row && columnIndex === column) {
                    output += chalk.red(`${num}  `.padEnd(5))
                } else {
                    output += `${num}  `.padEnd(5)
                }
            })
            output += '\n\n';
        })

        console.log(output)
    }

    /**
     * Adds a new number on board if a position is available.
     */
    addNewNumber() {
        const numberToInsert = random(0, 1) ? 2 : 4;
        const emptyPositions: Array<[number, number]> = [];
        this.board.forEach((row, rowIndex) => {
            row.forEach((item, columnIndex) => {
                if(item === 0) {
                    emptyPositions.push([rowIndex, columnIndex]);
                }
            })
        });

        if(emptyPositions.length) {
            const [rowIndex, columnIndex] = emptyPositions[random(0, emptyPositions.length -1)]
            this.board[rowIndex][columnIndex] = numberToInsert;
            this.newItemLocation = [rowIndex, columnIndex];
        }
    }

    /**
     * Getter/Setter for board.
     * Used for deciding how to read the board (vertically or 90 rotated).
     * For Down and Up, board can be read as it is.
     * Right and Left, board has to be read 90 rotated.
     *
     * @param {PositionTuple} [x,y]
     * @param {MoveDirection} direction
     * @param {number} [value]
     */
    directionalBoard([x,y]: PositionTuple, direction: MoveDirection, value?: number) {
        if(direction === MoveDirection.DOWN || direction === MoveDirection.UP) {
            if(value !== undefined) {
                this.board[x][y] = value;
            } else {
                return this.board[x]?.[y];
            }
        } else {
            if(value !== undefined) {
                this.board[y][x] = value;
            } else {
                return this.board[y]?.[x];
            }
        }
    }

    /**
     * Checks if the move is in right direction or down direction.
     * Used for conditions of move & merge.
     *
     * @param {MoveDirection} direction
     * @returns boolean
     */
    isDownOrRight(direction: MoveDirection) {
        if(direction === MoveDirection.DOWN || direction === MoveDirection.RIGHT) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Checks if game is over or not.
     * Have to do this because there may be a case when no place to add new number
     * is available, yet numbers are mergable.
     *
     * @returns
     * @memberof Board
     */
    isGameOver() {
        let areTwoSameNumbersFound = false;
        forEveryNumberIn([0, this.maxIndex], x => {
            return forEveryNumberIn([0, this.maxIndex], y => {
                const currentElement = this.board[x.current][y.current];
                const rightElement = this.board[x.current][y.current+1];
                const belowElement = this.board[x.current+1]?.[y.current];
                if(!currentElement || currentElement === rightElement || currentElement === belowElement) {
                    areTwoSameNumbersFound = true;
                    return "break";
                }
            })
        })

        return !areTwoSameNumbersFound;
    }

    mergeAndMove(direction: MoveDirection) {
        // for every row/column do the same move and merge.
        forEveryNumberIn([0, this.maxIndex], (y) => {
            // merge cycle for a row/column

            // range is one less, because we do not need move/merge cycle for "TOP" row/column
            const tuple: PositionTuple = this.isDownOrRight(direction) ? [this.maxIndex, 1] : [0, this.maxIndex - 1];
            forEveryNumberIn(tuple, (x) => {
                const currentElement = this.directionalBoard([x.current, y.current], direction);
                // from current to upper
                const upperRange: PositionTuple = this.isDownOrRight(direction) ? 
                                                  [x.current-1, 0] : 
                                                  [x.current+1, this.maxIndex];
                
                // if currentElement is present, try merging it with upper numbers
                currentElement && forEveryNumberIn(upperRange, (xAgain) => {
                    const nextUpperElement = this.directionalBoard([xAgain.current, y.current], direction);
                    if(nextUpperElement === currentElement) {
                        // set-ing currentElement as twice, and nullifying the nextUpperElement.
                        this.directionalBoard([x.current, y.current], direction, 2 * currentElement);
                        this.directionalBoard([xAgain.current, y.current], direction, 0);

                        if(config.winWhen === 2 * currentElement) {
                            this.isGameWon = true;
                        }
                        // because merge successful, currentElement's merging can be terminated
                        return "break";
                    } else if(nextUpperElement) {
                        // if nextUpperElement is there and not equal, then currentElement's merging can be terminated
                        return "break";
                    }
                })
            })

            // move cycle for a row/column
            forEveryNumberIn(tuple, (x) => {
                const currentElement = this.directionalBoard([x.current, y.current], direction);
                 // from current to upper
                const upperRange: PositionTuple = this.isDownOrRight(direction) ? 
                                                  [x.current-1, 0] :
                                                  [x.current+1, this.maxIndex];

                // if currentElement is zero, then only we need to find upper element to move down
                !currentElement && forEveryNumberIn(upperRange, (xAgain) => {
                    const nextUpperElement = this.directionalBoard([xAgain.current, y.current], direction);
                    if(nextUpperElement) {
                         // set-ing currentElement as nextUpperElement, and nullifying the nextUpperElement.
                        this.directionalBoard([x.current, y.current], direction, nextUpperElement);
                        this.directionalBoard([xAgain.current, y.current], direction, 0);
                        // can early exit because move done
                        return "break";
                    }
                })
            })
        })
    }

    private get maxIndex() {
        return this.size - 1;
    }
}