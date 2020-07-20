import { Construct, IConstruct } from 'constructs';
import { Test } from 'nodeunit';
import { App, Aspects, IAspect } from '../lib';

class MyConstruct extends Construct {
  public static IsMyConstruct(x: any): x is MyConstruct {
    return x.visitCounter !== undefined;
  }
  public visitCounter: number = 0;
}

class VisitOnce implements IAspect {
  public visit(node: IConstruct): void {
    if (MyConstruct.IsMyConstruct(node)) {
      node.visitCounter += 1;
    }
  }
}
export = {
  'Aspects.of(c) return an Aspects object'(test: Test) {
    // GIVEN
    const app = new App();
    const c = new Construct(app, 'foo');
    const visit1 = new VisitOnce();
    const visit2 = new VisitOnce();

    // WHEN
    const asp1 = Aspects.of(c);
    asp1.add(visit1);
    asp1.add(visit2);

    // THEN
    test.equal(asp1.aspects.length, 2);
    test.equal(asp1.aspects[0], visit1);
    test.equal(asp1.aspects[1], visit2);

    test.done();
  },

  'Aspects.of(c) returns the same object every time'(test: Test) {
    // GIVEN
    const app = new App();
    const c = new Construct(app, 'foo');
    const a1 = Aspects.of(c);

    // WHEN
    const a2 = Aspects.of(c);

    // THEN
    test.equal(a1, a2);
    test.done();
  },

  'Aspects are invoked only once'(test: Test) {
    const app = new App();
    const root = new MyConstruct(app, 'MyConstruct');
    Aspects.of(root).add(new VisitOnce());

    app.synth();
    test.deepEqual(root.visitCounter, 1);
    app.synth();
    test.deepEqual(root.visitCounter, 1);
    test.done();
  },
};
