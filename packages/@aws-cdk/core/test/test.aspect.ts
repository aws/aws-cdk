import { Test } from 'nodeunit';
import { App } from '../lib';
import { IAspect } from '../lib/aspect';
import { Construct, IConstruct } from 'constructs';

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
  'Aspects are invoked only once'(test: Test) {
    const app = new App();
    const root = new MyConstruct(app, 'MyConstruct');
<<<<<<< HEAD
    Aspects.of(root).apply(new VisitOnce());

=======
    root.node.applyAspect(new VisitOnce());
>>>>>>> origin/master
    app.synth();
    test.deepEqual(root.visitCounter, 1);
    app.synth();
    test.deepEqual(root.visitCounter, 1);
    test.done();
  },
};
