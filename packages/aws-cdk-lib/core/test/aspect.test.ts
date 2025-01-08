import { Construct, IConstruct } from 'constructs';
import { Template } from '../../assertions';
import { Bucket, CfnBucket } from '../../aws-s3';
import * as cxschema from '../../cloud-assembly-schema';
import { App, CfnResource, Stack, Tag, Tags } from '../lib';
import { IAspect, Aspects, AspectPriority } from '../lib/aspect';
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
        status: 'Enabled',
      };
    }
  }
}

class AddLoggingBucketAspect implements IAspect {
  private processed = false;
  public visit(node: IConstruct): void {
    // Check if the node is an S3 Bucket
    if (node instanceof CfnBucket && !this.processed) {
      // Add a new logging bucket Bucket to the stack this bucket belongs to.
      const stack = Stack.of(node);
      new Bucket(stack, 'my-new-logging-bucket-from-aspect', {
        bucketName: 'my-new-logging-bucket-from-aspect',
      });
      this.processed = true;
    }
  }
}

class AddSingletonBucketAspect implements IAspect {
  private processed = false;
  public visit(node: IConstruct): void {
    if (Stack.isStack(node) && !this.processed) {
      // Add a new logging bucket Bucket to the stack this bucket belongs to.
      new Bucket(node, 'my-new-logging-bucket-from-aspect', {
        bucketName: 'my-new-logging-bucket-from-aspect',
      });
      this.processed = true;
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

  test('if stabilization is disabled, warn if an Aspect is added via another Aspect', () => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': false } });
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

    // THEN - the priority is set to default
    let aspectApplication = Aspects.of(root).applied[0];
    expect(aspectApplication.priority).toEqual(AspectPriority.DEFAULT);
  });

  test('Can override Aspect priority', () => {
    const app = new App();
    const root = new MyConstruct(app, 'Construct');
    const child = new MyConstruct(root, 'ChildConstruct');

    // WHEN - adding an Aspect without priority specified and resetting it.
    Aspects.of(root).add(new MyAspect());
    let aspectApplication = Aspects.of(root).applied[0];

    // THEN - we can reset the priority of an Aspect
    aspectApplication.priority = 0;
    expect(Aspects.of(root).applied[0].priority).toEqual(0);
  });

  test('In-place mutating Aspect gets applied', () => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': true } });
    const stack = new Stack(app, 'My-Stack');

    // GIVEN - Bucket with versioning disabled
    const bucket = new Bucket(stack, 'my-bucket', {
      versioned: false,
    });

    // WHEN - adding the Aspect to enable bucket versioning gets applied:
    Aspects.of(stack).add(new EnableBucketVersioningAspect());

    // THEN - Aspect is successfully applied
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      VersioningConfiguration: {
        Status: 'Enabled',
      },
    });
  });

  test('mutating Aspect that creates a node gets applied', () => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': true } });
    const stack = new Stack(app, 'My-Stack');

    // GIVEN - Bucket with versioning disabled
    const bucket = new Bucket(stack, 'my-bucket', {
      bucketName: 'my-original-bucket',
      versioned: false,
    });

    // WHEN - adding the Aspect to add a logging bucket:
    Aspects.of(stack).add(new AddLoggingBucketAspect());

    // THEN - Aspect is successfully applied, new logging bucket is added
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'my-new-logging-bucket-from-aspect',
    });
  });

  test('can set mutating Aspects in specified orcder and visit newly created node', () => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': true } });
    const stack = new Stack(app, 'My-Stack');

    // GIVEN - Bucket with versioning disabled
    const bucket = new Bucket(stack, 'my-bucket', {
      bucketName: 'my-original-bucket',
      versioned: false,
    });

    // WHEN - adding both Aspects but making LoggingBucket Aspect run first
    Aspects.of(stack).add(new AddLoggingBucketAspect(), { priority: 90 });
    Aspects.of(stack).add(new EnableBucketVersioningAspect(), { priority: 100 });

    // THEN - both Aspects are successfully applied, new logging bucket is added with versioning enabled
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'my-new-logging-bucket-from-aspect',
      VersioningConfiguration: {
        Status: 'Enabled',
      },
    });
  });

  test('Tags are applied to newly created node from the LoggingBucket Aspect', () => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': true } });
    const stack = new Stack(app, 'My-Stack');

    // GIVEN - Bucket with versioning disabled
    const bucket = new Bucket(stack, 'my-bucket', {
      bucketName: 'my-original-bucket',
      versioned: false,
    });

    // WHEN - adding both Aspects but making LoggingBucket Aspect run first
    Aspects.of(stack).add(new AddLoggingBucketAspect(), { priority: 0 });
    Tags.of(stack).add('TestKey', 'TestValue');

    // THEN - check that Tags Aspect is applied to stack with default priority
    let aspectApplications = Aspects.of(stack).applied;
    expect(aspectApplications.length).toEqual(2);
    expect(aspectApplications[1].priority).toEqual(AspectPriority.DEFAULT);

    // THEN - both Aspects are successfully applied, new logging bucket is added with versioning enabled
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'my-new-logging-bucket-from-aspect',
      Tags: [{
        Key: 'TestKey',
        Value: 'TestValue',
      }],
    });
  });

  test('Newly created node inherits Aspect that was already invoked on its parent node.', () => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': true } });
    const root = new Stack(app, 'My-Stack');

    // GIVEN - 3 Aspects with increasing priority
    Aspects.of(root).add(new Tag('AspectA', 'Visited'), { priority: 10 });
    // This Aspect is applied after Aspect A, but creates a child of the root which should still
    // inherit Aspect A.
    Aspects.of(root).add(new AddSingletonBucketAspect(), { priority: 20 });
    Aspects.of(root).add(new Tag('AspectC', 'Visited'), { priority: 30 });

    // THEN - both Aspects A and C are invoked on the new node created by Aspect B as a child of the root.
    Template.fromStack(root).hasResourceProperties('AWS::S3::Bucket', {
      BucketName: 'my-new-logging-bucket-from-aspect',
      Tags: [{
        Key: 'AspectA',
        Value: 'Visited',
      },
      {
        Key: 'AspectC',
        Value: 'Visited',
      }],
    });
  });

  class WeirdAspect implements IAspect {
    private processed = false;
    public visit(node: IConstruct): void {
      // Check if the node is an S3 Bucket
      if (node instanceof CfnBucket && !this.processed) {
        const stack = Stack.of(node);

        // Adds a new Tag to the parent of this bucket
        Aspects.of(stack).add(new Tag('AspectB', 'Visited'), { priority: 0 });

        this.processed = true;
      }
    }
  }

  test('Error is thrown if Aspect adds an Aspect to a node with a lower priority than the last invoked Aspect of a node.', () => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': true } });
    const root = new Stack(app, 'My-Stack');
    const child = new Bucket(root, 'my-bucket', {
      bucketName: 'my-bucket',
    });

    // GIVEN - 2 Aspects where the second one applied an Aspect with a lower priority to the root:
    Aspects.of(root).add(new Tag('AspectA', 'Visited'), { priority: 10 });
    Aspects.of(child).add(new WeirdAspect(), { priority: 20 });

    expect(() => {
      app.synth();
    }).toThrow('Cannot invoke Aspect Tag with priority 0 on node My-Stack: an Aspect Tag with a lower priority (10) was already invoked on this node.');
  });

  test('Infinitely recursing Aspect is caught with error', () => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': true } });
    const root = new Stack(app, 'My-Stack');
    const child = new MyConstruct(root, 'MyConstruct');

    Aspects.of(root).add(new InfiniteAspect());

    expect(() => {
      app.synth();
    }).toThrow('We have detected a possible infinite loop while invoking Aspects.');
  });

  class InfiniteAspect implements IAspect {
    private static counter = 0;

    visit(node: IConstruct): void {
      // Adds a new resource as a child of the stack.
      if (!(node instanceof Stack)) {
        const stack = Stack.of(node);
        const uniqueId = `InfiniteResource-${InfiniteAspect.counter++}`;
        new CfnResource(stack, uniqueId, {
          type: 'AWS::CDK::Broken',
        });
      }
    }
  }

  test.each([
    { stabilization: true },
    { stabilization: false },
  ])('Error is not thrown if Aspects.applied does not exist (stabilization: $stabilization)', ({ stabilization }) => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': stabilization } });
    const root = new Stack(app, 'My-Stack');

    Aspects.of(root).add(new Tag('AspectA', 'Visited'));

    // "Monkey patching" - Override `applied` to simulate its absence
    Object.defineProperty(Aspects.prototype, 'applied', {
      value: undefined,
      configurable: true,
    });

    expect(() => {
      app.synth();
    }).not.toThrow();
  });
});
