import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { App } from '../lib';
import { IAspect, Aspects } from '../lib/aspect';
import { Construct, IConstruct } from '../lib/construct-compat';

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

class MyAspect implements IAspect {
  public visit(node: IConstruct): void {
    node.node.addMetadata('foo', 'bar');
  }
}

nodeunitShim({
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

  'Warn if an Aspect is added via another Aspect'(test: Test) {
    const app = new App();
    const root = new MyConstruct(app, 'MyConstruct');
    const child = new MyConstruct(root, 'ChildConstruct');
    Aspects.of(root).add({
      visit(construct: IConstruct) {
        Aspects.of(construct).add({
          visit(inner: IConstruct) {
            inner.node.addMetadata('test', 'would-be-ignored');
          },
        });
      },
    });
    app.synth();
    test.deepEqual(root.node.metadata[0].type, cxschema.ArtifactMetadataEntryType.WARN);
    test.deepEqual(root.node.metadata[0].data, 'We detected an Aspect was added via another Aspect, and will not be applied');
    // warning is not added to child construct
    test.equal(child.node.metadata.length, 0);
    test.done();
  },

  'Do not warn if an Aspect is added directly (not by another aspect)'(test: Test) {
    const app = new App();
    const root = new MyConstruct(app, 'Construct');
    const child = new MyConstruct(root, 'ChildConstruct');
    Aspects.of(root).add(new MyAspect());
    app.synth();
    test.deepEqual(root.node.metadata[0].type, 'foo');
    test.deepEqual(root.node.metadata[0].data, 'bar');
    test.deepEqual(root.node.metadata[0].type, 'foo');
    test.deepEqual(child.node.metadata[0].data, 'bar');
    // no warning is added
    test.equal(root.node.metadata.length, 1);
    test.equal(child.node.metadata.length, 1);
    test.done();
  },

});
