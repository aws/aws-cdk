import { Construct, IConstruct } from 'constructs';
import { Template } from '../../assertions';
import { Bucket, CfnBucket } from '../../aws-s3';
import * as cxschema from '../../cloud-assembly-schema';
import { App, CfnResource, Stack, Tag, Tags } from '../lib';
import { IAspect, Aspects, AspectPriority, _aspectTreeRevisionReader } from '../lib/aspect';
import { MissingRemovalPolicies, RemovalPolicies } from '../lib/removal-policies';
import { RemovalPolicy } from '../lib/removal-policy';

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

  test('Adding the same aspect twice to the same construct only adds 1', () => {
    // GIVEN
    const app = new App();
    const root = new MyConstruct(app, 'MyConstruct');

    // WHEN
    const asp = new VisitOnce();
    Aspects.of(root).add(asp);
    Aspects.of(root).add(asp);

    // THEN
    expect(Aspects.of(root).all.length).toEqual(1);
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
    expect(child.node.metadata).toEqual([]);
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

    // THEN - check that Tags Aspect is applied to stack with mutating priority
    let aspectApplications = Aspects.of(stack).applied;
    expect(aspectApplications.length).toEqual(2);
    expect(aspectApplications[1].priority).toEqual(AspectPriority.MUTATING);

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
    }).toThrow('an Aspect Tag with a lower priority');
  });

  test('Infinitely recursing Aspect is caught with error', () => {
    const app = new App({ context: { '@aws-cdk/core:aspectStabilization': true } });
    const root = new Stack(app, 'My-Stack');
    new MyConstruct(root, 'MyConstruct');

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
    const appliedGetter = jest.spyOn(Aspects.prototype, 'applied', 'get').mockReturnValue(undefined as any);

    expect(() => {
      app.synth();
    }).not.toThrow();

    appliedGetter.mockRestore();
  });

  test('RemovalPolicy: higher priority wins', () => {
    const app = new App();
    const stack = new Stack(app, 'My-Stack');
    new Bucket(stack, 'my-bucket', {
      removalPolicy: RemovalPolicy.RETAIN,
    });

    RemovalPolicies.of(stack).apply(RemovalPolicy.DESTROY, {
      priority: 100,
    });

    RemovalPolicies.of(stack).apply(RemovalPolicy.RETAIN, {
      priority: 200,
    });

    Template.fromStack(stack).hasResource('AWS::S3::Bucket', {
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    });
  });

  test('RemovalPolicy: last one wins when priorities are equal', () => {
    const app = new App();
    const stack = new Stack(app, 'My-Stack');
    new Bucket(stack, 'my-bucket', {
      removalPolicy: RemovalPolicy.RETAIN,
    });

    RemovalPolicies.of(stack).apply(RemovalPolicy.DESTROY, {
      priority: 100,
    });

    RemovalPolicies.of(stack).apply(RemovalPolicy.RETAIN, {
      priority: 100,
    });

    Template.fromStack(stack).hasResource('AWS::S3::Bucket', {
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    });
  });

  test('MissingRemovalPolicy: default removal policy is respected', () => {
    const app = new App();
    const stack = new Stack(app, 'My-Stack');
    new Bucket(stack, 'my-bucket', {
      removalPolicy: RemovalPolicy.RETAIN,
    });

    MissingRemovalPolicies.of(stack).apply(RemovalPolicy.DESTROY, {
      priority: 100,
    });

    Template.fromStack(stack).hasResource('AWS::S3::Bucket', {
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    });
  });

  test('RemovalPolicy: multiple aspects in chain', () => {
    const app = new App();
    const stack = new Stack(app, 'My-Stack');
    new Bucket(stack, 'my-bucket', {
      removalPolicy: RemovalPolicy.RETAIN,
    });

    RemovalPolicies.of(stack).apply(RemovalPolicy.DESTROY, {
      priority: 100,
    });

    RemovalPolicies.of(stack).apply(RemovalPolicy.RETAIN, {
      priority: 200,
    });

    RemovalPolicies.of(stack).apply(RemovalPolicy.SNAPSHOT, {
      priority: 300,
    });

    Template.fromStack(stack).hasResource('AWS::S3::Bucket', {
      UpdateReplacePolicy: 'Snapshot',
      DeletionPolicy: 'Snapshot',
    });
  });

  test('RemovalPolicy: different resource type', () => {
    const app = new App();
    const stack = new Stack(app, 'My-Stack');
    new CfnResource(stack, 'my-resource', {
      type: 'AWS::EC2::Instance',
      properties: {
        ImageId: 'ami-1234567890abcdef0',
        InstanceType: 't2.micro',
      },
    }).applyRemovalPolicy(RemovalPolicy.DESTROY);

    RemovalPolicies.of(stack).apply(RemovalPolicy.RETAIN, {
      priority: 100,
    });

    Template.fromStack(stack).hasResource('AWS::EC2::Instance', {
      Properties: {
        ImageId: 'ami-1234567890abcdef0',
        InstanceType: 't2.micro',
      },
      UpdateReplacePolicy: 'Retain',
      DeletionPolicy: 'Retain',
    });
  });

  test.each([
    'on self',
    'on parent',
  ] as const)('aspect can insert another aspect %s in between other ones', (addWhere) => {
    // Test that between two pre-existing aspects with LOW and HIGH priorities,
    // the LOW aspect can add one in the middle, when stabilization is enabled.
    //
    // With stabilization (Aspects V2), we are stricter about the ordering and we would
    // throw if something doesn't work.

    // GIVEN
    const app = new App();
    const root = new MyConstruct(app, 'Root');
    const aspectTarget = new MyConstruct(root, 'MyConstruct');

    // WHEN
    // - Aspect with prio 100 adds an Aspect with prio 500
    // - An Aspect with prio 700 also exists
    // We should execute all and in the right order.
    const executed = new Array<string>();

    class TestAspect implements IAspect {
      constructor(private readonly name: string, private readonly block?: () => void) {
      }

      visit(node: IConstruct): void {
        // Only do something for the target node
        if (node.node.path === 'Root/MyConstruct') {
          executed.push(this.name);
          this.block?.();
        }
      }
    }

    Aspects.of(aspectTarget).add(new TestAspect('one', () => {
      // We either add the new aspect on ourselves, or on an ancestor.
      //
      // In either case, it should execute next, before the 700 executes.
      const addHere = addWhere === 'on self' ? aspectTarget : root;

      Aspects.of(addHere).add(new TestAspect('two'), { priority: 500 });
    }), { priority: 100 });
    Aspects.of(aspectTarget).add(new TestAspect('three'), { priority: 700 });

    // THEN: should not throw and execute in the right order
    app.synth({ aspectStabilization: true });

    expect(executed).toEqual(['one', 'two', 'three']);
  });

  test('changing an aspect\'s priority invalidates the aspect tree', () => {
    const app = new App();
    const ctr = new MyConstruct(app, 'Root');

    // GIVEN
    const aspect = new MyAspect();
    Aspects.of(ctr).add(aspect);
    const currentRevision = _aspectTreeRevisionReader(ctr);
    const initialRevision = currentRevision();

    // WHEN
    Aspects.of(ctr).applied[0].priority = 500;

    // THEN
    expect(currentRevision()).not.toEqual(initialRevision);
  });
});
