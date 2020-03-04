import "./chaiSetup";
import { forEveryNumberIn, IterationCallback } from "../src/utils";
import { expect } from 'chai';
import sinon from "sinon";

describe('Tests for forEveryNumberIn', () => {
  it('should loop up correctly', () => {
      const iterationValues: number[] = [];
      const cb : IterationCallback = (state) => {
        iterationValues.push(state.current);
      }
      const cbSpy = sinon.spy(cb);
      forEveryNumberIn([1,3], cbSpy);
      expect(iterationValues).to.deep.equal([1,2,3]);
      expect(cbSpy).to.have.been.calledThrice;
  });

  it('should loop down correctly', () => {
    const iterationValues: number[] = [];
    const cb : IterationCallback = (state) => {
      iterationValues.push(state.current);
    }
    const cbSpy = sinon.spy(cb);
    forEveryNumberIn([1,-1], cbSpy);
    expect(iterationValues).to.deep.equal([1,0,-1]);
    expect(cbSpy).to.have.been.calledThrice;
  });

  it('should loop once correctly', () => {
    const iterationValues: number[] = [];
    const cb : IterationCallback = (state) => {
      iterationValues.push(state.current);
    }
    const cbSpy = sinon.spy(cb);
    forEveryNumberIn([1,1], cbSpy);
    expect(iterationValues).to.deep.equal([1]);
    expect(cbSpy).to.have.been.calledOnce;
  });

  it('should early exit', () => {
    const cb : IterationCallback = (state) => {
      if(state.current === 1) {
        return "break";
      }
    }
    const cbSpy = sinon.spy(cb);

    forEveryNumberIn([0,2], cbSpy);
    expect(cbSpy).to.have.been.calledTwice;
    expect(cbSpy).to.not.have.been.calledThrice;
  })

  it('should skip loops if current is changed inside loop', () => {
    const iterationValues: number[] = [];
    const cb : IterationCallback = (state) => {
      iterationValues.push(state.current);
      if(state.current === 1) {
        state.current = 5;
      }
    }
    const cbSpy = sinon.spy(cb);

    forEveryNumberIn([0,10], cbSpy);
    expect(iterationValues).to.deep.equal([0,1,6,7,8,9,10]);
  })
});