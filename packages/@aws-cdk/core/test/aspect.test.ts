import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Construct, IConstruct } from 'constructs';
import { App } from '../lib';
import { IAspect, Aspects } from '../lib/aspect';

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

describe('aspect', () => {
  test('Aspects are invoked only once', () => {
    const app = new App();
    const root = new MyConstruct(app, 'MyConstruct');
    Aspects.of(root).add(new VisitOnce());
    app.synth();
    expect(root.visitCounter).toEqual(1);
    app.synth();
    expect(root.visitCounter).toEqual(1);

  });

  test('Warn if an Aspect is added via another Aspect', () => {
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
    expect(root.node.metadata[0].type).toEqual(cxschema.ArtifactMetadataEntryType.WARN);
    expect(root.node.metadata[0].data).toEqual('We detected an Aspect was added via another Aspect, and will not be applied');
    // warning is not added to child construct
    expect(child.node.metadata.length).toEqual(0);

  });

  test('Do not warn if an Aspect is added directly (not by another aspect)', () => {
    const app = new App();
    const root = new MyConstruct(app, 'Construct');
    const child = new MyConstruct(root, 'ChildConstruct');
    Aspects.of(root).add(new MyAspect());
    app.synth();
    expect(root.node.metadata[0].type).toEqual('foo');
    expect(root.node.metadata[0].data).toEqual('bar');
    expect(child.node.metadata[0].type).toEqual('foo');
    expect(child.node.metadata[0].data).toEqual('bar');
    // no warning is added
    expect(root.node.metadata.length).toEqual(1);
    expect(child.node.metadata.length).toEqual(1);

  });

});
