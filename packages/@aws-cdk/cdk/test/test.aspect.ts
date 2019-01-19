import { Test } from 'nodeunit';
import { AspectVisitType, IAspect } from '../lib/aspects/aspect';
import { IConstruct, Root } from '../lib/core/construct';

class MyConstruct extends Root {
  public static IsMyConstruct(x: any): x is MyConstruct {
    return x.visitCounter !== undefined;
  }
  public visitCounter: number = 0;
}

class VisitMany implements IAspect {
  public readonly visitType = AspectVisitType.Multiple;

  public visit(node: IConstruct): void {
    if (MyConstruct.IsMyConstruct(node)) {
      node.visitCounter += 1;
    }
  }
}

class VisitOnce implements IAspect {
  public readonly visitType = AspectVisitType.Single;

  public visit(node: IConstruct): void {
    if (MyConstruct.IsMyConstruct(node)) {
      node.visitCounter += 1;
    }
  }
}
export = {
  'Aspects with multiple visit type': {
    'are invoked every time'(test: Test) {
      const root = new MyConstruct();
      root.apply(new VisitMany());
      root.node.prepareTree();
      test.deepEqual(root.visitCounter, 1);
      root.node.prepareTree();
      test.deepEqual(root.visitCounter, 2);
      test.done();
    },
  },
  'Aspects with single visit type': {
    'are invoked only once'(test: Test) {
      const root = new MyConstruct();
      root.apply(new VisitOnce());
      root.node.prepareTree();
      test.deepEqual(root.visitCounter, 1);
      root.node.prepareTree();
      test.deepEqual(root.visitCounter, 1);
      test.done();
    },
  },
  'A construct can have both Aspect types'(test: Test) {
    const root = new MyConstruct();
    root.apply(new VisitOnce());
    root.apply(new VisitMany());
    root.node.prepareTree();
    test.deepEqual(root.visitCounter, 2);
    root.node.prepareTree();
    test.deepEqual(root.visitCounter, 3);
    test.done();
  },
};
