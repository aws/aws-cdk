import { Construct, IConstruct } from 'constructs';
import { Test } from 'nodeunit';
import { App, Aspects, IAspect } from '../lib';
import { synthesize } from '../lib/private/synthesis';

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
    Aspects.of(root).apply(new VisitOnce());

    synthesize(root);
    test.deepEqual(root.visitCounter, 1);
    synthesize(root);
    test.deepEqual(root.visitCounter, 1);
    test.done();
  },
};
