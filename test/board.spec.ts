import { config } from './../src/config';
import { Board } from './../src/Board';
import "./chaiSetup";
import { expect } from 'chai';
import sinon from "sinon";
import { forEveryNumberIn } from '../src/utils';
import { MoveDirection } from '../src/types';

describe('Tests for Board', () => {
    let boardInstance = new Board(4);

    beforeEach(() => {
        boardInstance = new Board(4);
    })

    function getCounts(boardInstance: Board) {
        let zeroCount = 0;
        let nonZeroCount = 0;
        forEveryNumberIn([0, 3], (x) => {
            forEveryNumberIn([0,3], (y) => {
                boardInstance["board"][x.current][y.current] ? nonZeroCount++ : zeroCount++;
            })
        })

        return { zeroCount, nonZeroCount };
    }

    it('should correctly instantiate the board', () => {
        expect(boardInstance["board"].length).to.equal(4);
        expect(boardInstance["board"][0].length).to.equal(4);

        let { zeroCount, nonZeroCount } = getCounts(boardInstance);
        expect(zeroCount).to.equal(14)
        expect(nonZeroCount).to.equal(2)
    });

    it('should correctly identify if game is over', () => {
        expect(boardInstance.isGameOver()).to.equal(false);

        boardInstance["board"] = [
            [2,4,2,4],
            [4,2,4,2],
            [2,4,2,4],
            [4,2,4,2],
        ]

        expect(boardInstance.isGameOver()).to.equal(true);
    })

    it('should correctly identify if game is over', () => {
        expect(boardInstance.isGameOver()).to.equal(false);

        boardInstance["board"] = [
            [2,4,2,0],
            [4,2,4,2],
            [2,4,2,4],
            [4,2,4,2],
        ]

        expect(boardInstance.isGameOver()).to.equal(false);
    })

    it('should randomly add a new number at empty place', () => {
        boardInstance["board"] = [
            [2,4,2,4],
            [4,2,4,2],
            [2,0,2,4],
            [4,2,0,2],
        ]
       
        {
            boardInstance.addNewNumber();
            let { zeroCount, nonZeroCount } = getCounts(boardInstance);
            expect(zeroCount).to.equal(1);
            expect(nonZeroCount).to.equal(15);
        }

        {
            boardInstance.addNewNumber();
            let { zeroCount, nonZeroCount } = getCounts(boardInstance);
            expect(zeroCount).to.equal(0);
            expect(nonZeroCount).to.equal(16);
        }
    })

    it('should get correct board value for directions', () => {
        boardInstance["board"] = [
            [1,2,3,4],
            [5,6,7,8],
            [9,10,11,12],
            [13,14,15,16],
        ]

        expect(boardInstance.directionalBoard([2,1], MoveDirection.DOWN)).to.equal(10)
        expect(boardInstance.directionalBoard([2,1], MoveDirection.UP)).to.equal(10)
        expect(boardInstance.directionalBoard([2,1], MoveDirection.RIGHT)).to.equal(7)
        expect(boardInstance.directionalBoard([2,1], MoveDirection.LEFT)).to.equal(7)
    })

    it('should set correct board value for directions', () => {
        boardInstance["board"] = [
            [1,2,3,4],
            [5,6,7,8],
            [9,10,11,12],
            [13,14,15,16],
        ]

        boardInstance.directionalBoard([2,1], MoveDirection.DOWN, 20)
        expect(boardInstance["board"][2][1]).to.equal(20);
        boardInstance.directionalBoard([2,1], MoveDirection.UP, 30)
        expect(boardInstance["board"][2][1]).to.equal(30);
        boardInstance.directionalBoard([2,1], MoveDirection.RIGHT, 40)
        expect(boardInstance["board"][1][2]).to.equal(40);
        boardInstance.directionalBoard([2,1], MoveDirection.LEFT, 50)
        expect(boardInstance["board"][1][2]).to.equal(50);
    })

    it('should merge correctly when moving down', () => {
        boardInstance.addNewNumber = () => {};
        boardInstance["board"] = [
            [4,2,0,4],
            [4,4,4,0],
            [2,2,0,0],
            [2,8,2,4],
        ]

        boardInstance.mergeAndMove(MoveDirection.DOWN)
        expect(boardInstance["board"]).to.deep.equal([
            [0,2,0,0],
            [0,4,0,0],
            [8,2,4,0],
            [4,8,2,8],
        ])
    })

    it('should merge correctly when moving right', () => {
        boardInstance.addNewNumber = () => {};
        boardInstance["board"] = [
            [4,0,0,4],
            [0,4,0,2],
            [2,4,2,8],
            [4,4,2,2]
        ]

        boardInstance.mergeAndMove(MoveDirection.RIGHT)
        expect(boardInstance["board"]).to.deep.equal([
            [0,0,0,8],
            [0,0,4,2],
            [2,4,2,8],
            [0,0,8,4],
        ])
    })

    it('should merge correctly when moving up', () => {
        boardInstance.addNewNumber = () => {};
        boardInstance["board"] = [
            [2,8,2,4],
            [2,2,0,0],
            [4,4,4,0],
            [4,2,0,4],
        ]

        boardInstance.mergeAndMove(MoveDirection.UP)
        expect(boardInstance["board"]).to.deep.equal([
            [4,8,2,8],
            [8,2,4,0],
            [0,4,0,0],
            [0,2,0,0],
        ])
    })

    it('should merge correctly when moving left', () => {
        boardInstance.addNewNumber = () => {};
        boardInstance["board"] = [
            [4,0,0,4],
            [2,0,4,0],
            [8,2,4,2],
            [2,2,4,4]
        ]

        boardInstance.mergeAndMove(MoveDirection.LEFT)
        expect(boardInstance["board"]).to.deep.equal([
            [8,0,0,0],
            [2,4,0,0],
            [8,2,4,2],
            [4,8,0,0],
        ])
    })

    it('should correctly detect win condition', () => {
        const half = config.winWhen/2;
        boardInstance["board"] = [
            [4,0,0,4],
            [2,0,half,0],
            [8,2,half,2],
            [2,2,4,4]
        ]

        expect(boardInstance.isGameWon).to.be.equal(false);
        boardInstance.mergeAndMove(MoveDirection.DOWN);
        expect(boardInstance.isGameWon).to.be.equal(true);
    })
})