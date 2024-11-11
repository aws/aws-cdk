import { Construct, IConstruct } from 'constructs';
import * as cxschema from '../../cloud-assembly-schema';
import { App, Stack } from '../lib';
import { IAspect, Aspects } from '../lib/aspect';
import { Bucket, CfnBucket } from '../../aws-s3';
import { Template } from '../../assertions';

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

class EnableBucketVersioningAspect implements IAspect {
  public visit(node: IConstruct): void {
    if (node instanceof CfnBucket) {
      node.versioningConfiguration = {
        status: 'Enabled'
      };
    }
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
    expect(root.node.metadata[0].data).toEqual('We detected an Aspect was added via another Aspect, and will not be applied [ack: @aws-cdk/core:ignoredAspect]');
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

  test('Aspects applied without priority get the default priority value', () => {
    const app = new App();
    const root = new MyConstruct(app, 'Construct');
    const child = new MyConstruct(root, 'ChildConstruct');

    // WHEN - adding an Aspect without priority specified
    Aspects.of(root).add(new MyAspect());

    // THEN - the priority is set to default (600)
    let aspectApplication = Aspects.of(root).list[0];
    expect(aspectApplication.priority).toEqual(600);
  });

  test('Can override Aspect priority with changePriority() function', () => {
    const app = new App();
    const root = new MyConstruct(app, 'Construct');
    const child = new MyConstruct(root, 'ChildConstruct');

    // WHEN - adding an Aspect without priority specified and resetting it.
    Aspects.of(root).add(new MyAspect());
    let aspectApplication = Aspects.of(root).list[0];

    // THEN - we can reset the priority of an Aspect
    aspectApplication.changePriority(0);
    expect(Aspects.of(root).list[0].priority).toEqual(0);
  });

  test('In-place mutating Aspect gets applied', () => {
    const app = new App();
    const stack = new Stack(app, 'My-Stack');

    // GIVEN - Bucket with versioning disabled
    const bucket = new Bucket(stack, 'my-bucket', {
      versioned: false,
    });

    // WHEN - adding a the Aspect to enable bucket versioning gets applied:
    Aspects.of(stack).add(new EnableBucketVersioningAspect());

    // THEN - Aspect is successfully applied
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      'VersioningConfiguration': {
        'Status': 'Enabled',
      }
    });
  });
});
