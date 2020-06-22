import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Test } from 'nodeunit';
import { App } from '../lib';
import { IAspect } from '../lib/aspect';
import { Construct, ConstructNode, IConstruct } from '../lib/construct-compat';

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
    root.node.applyAspect(new VisitOnce());
    ConstructNode.prepare(root.node);
    test.deepEqual(root.visitCounter, 1);
    ConstructNode.prepare(root.node);
    test.deepEqual(root.visitCounter, 1);
    test.done();
  },

  'Warn if an aspect is added via another aspect and will be ignored'(test: Test) {
    const app = new App();
    const root = new MyConstruct(app, 'MyConstruct');
    root.node.applyAspect({
      visit(construct: IConstruct) {
        // tslint:disable-next-line: no-console
        console.log('hiiiiii');
        construct.node.applyAspect({
          visit(inner: IConstruct) {
            // tslint:disable-next-line: no-console
           console.log('hiiiiii AGAINNNN');
           inner.node.addMetadata('test', 'would-be-ingored');
          }
        });
      }
    });
    app.synth();
    test.deepEqual(root.node.metadata[0].type, cxschema.ArtifactMetadataEntryType.WARN);
    test.deepEqual(root.node.metadata[0].data, 'We detected an aspect was added via another aspect, this is not supported and may result in an unexpected behavior');
    test.done();
  },

  // 'No warning is added if no aspect is added via another aspect'(test: Test) {
  //   const app = new App();
  //   const root = new MyConstruct(app, 'MyConstruct');
  //   const child = new MyConstruct(root, 'ChildConstruct');
  //   const gChild = new MyConstruct(child, 'GConstruct');
  //   const rootValue = 'Root';
  //   const childValue = 'Child';
  //   root.node.applyAspect(new SimpleAspect((rootValue)));
  //   child.node.applyAspect(new SimpleAspect(childValue));
  //   ConstructNode.prepare(root.node);

  //   test.deepEqual(gChild.node.metadata[0].type,  'Aspect');
  //   test.deepEqual(gChild.node.metadata[0].data,  'Applied');
  //   test.done();
  // },

};
