import { Test } from 'nodeunit';
import { IAspect } from '../lib/aspect';
import { IConstruct, Root } from '../lib/construct';

class MyConstruct extends Root {
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
    const root = new MyConstruct();
    root.node.apply(new VisitOnce());
    root.node.prepareTree();
    test.deepEqual(root.visitCounter, 1);
    root.node.prepareTree();
    test.deepEqual(root.visitCounter, 1);
    test.done();
  },
};
