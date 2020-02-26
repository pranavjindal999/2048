import "./chaiSetup";
import { forEveryNumberIn } from "../src/utils";
import { expect } from 'chai';
import sinon from "sinon";

describe('Tests for forEveryNumberIn', () => {
  it('should loop up correctly', () => {
      const cb = sinon.spy();
      forEveryNumberIn([1,3], cb);
      expect(cb).to.have.been.calledWith(1);
      expect(cb).to.have.been.calledWith(2);
      expect(cb).to.have.been.calledWith(3);
      expect(cb).to.have.been.calledThrice;
  });

  it('should loop down correctly', () => {
    const cb = sinon.spy();
    forEveryNumberIn([1,-1], cb);
    expect(cb).to.have.been.calledWith(1);
    expect(cb).to.have.been.calledWith(0);
    expect(cb).to.have.been.calledWith(-1);
    expect(cb).to.have.been.calledThrice;
  });

  it('should loop once correctly', () => {
    const cb = sinon.spy();
    forEveryNumberIn([1,1], cb);
    expect(cb).to.have.been.calledOnceWithExactly(1);
  });

  it('should early exit', () => {
    const cb = sinon.spy((value: number) => {
      if(value === 1) {
        return false;
      }
    });

    forEveryNumberIn([0,2], cb);
    expect(cb).to.have.been.calledTwice;
    // should have return undefined when loop did not early exit
    expect(cb).to.have.been.returned(undefined);
    // should have return false when loop did early exit
    expect(cb).to.have.been.returned(false);
    // safe check for early exit
    expect(cb).to.not.have.been.calledThrice;
  })
});