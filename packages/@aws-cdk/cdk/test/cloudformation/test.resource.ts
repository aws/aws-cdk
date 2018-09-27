import { Test } from 'nodeunit';
import { applyRemovalPolicy, Condition, Construct, DeletionPolicy,
    FnEquals, FnNot, HashedAddressingScheme, IDependable, PolicyStatement,
    RemovalPolicy, resolve, Resource, Root, Stack } from '../../lib';

export = {
  'all resources derive from Resource, which derives from Entity'(test: Test) {
    const stack = new Stack();

    new Resource(stack, 'MyResource', {
      type: 'MyResourceType',
      properties: {
        Prop1: 'p1', Prop2: 123
      }
    });

    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        MyResource: {
          Type: "MyResourceType",
          Properties: {
            Prop1: "p1",
            Prop2: 123
          }
        }
      }
    });

    test.done();
  },

  'resources must reside within a Stack and fail upon creation if not'(test: Test) {
    const root = new Root();
    test.throws(() => new Resource(root, 'R1', { type: 'ResourceType' }));
    test.done();
  },

  'all entities have a logical ID calculated based on their full path in the tree'(test: Test) {
    const stack = new Stack(undefined, 'TestStack', { namingScheme: new HashedAddressingScheme() });
    const level1 = new Construct(stack, 'level1');
    const level2 = new Construct(level1, 'level2');
    const level3 = new Construct(level2, 'level3');
    const res1 = new Resource(level1, 'childoflevel1', { type: 'MyResourceType1' });
    const res2 = new Resource(level3, 'childoflevel3', { type: 'MyResourceType2' });

    test.equal(withoutHash(res1.logicalId), 'level1childoflevel1');
    test.equal(withoutHash(res2.logicalId), 'level1level2level3childoflevel3');

    test.done();
  },

  'resource.props can only be accessed by derived classes'(test: Test) {
    const stack = new Stack();
    const res = new Counter(stack, 'MyResource', { Count: 10 });
    res.increment();
    res.increment(2);

    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        MyResource: { Type: 'My::Counter', Properties: { Count: 13 } }
      }
    });

    test.done();
  },

  'resource attributes can be retrieved using getAtt(s) or attribute properties'(test: Test) {
    const stack = new Stack();
    const res = new Counter(stack, 'MyResource', { Count: 10 });

    new Resource(stack, 'YourResource', {
      type: 'Type',
      properties: {
        CounterName: res.getAtt('Name'),
        CounterArn: res.arn,
        CounterURL: res.url,
      }
    });

    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        MyResource: { Type: 'My::Counter', Properties: { Count: 10 } },
        YourResource: {
          Type: 'Type',
          Properties: {
            CounterName: { 'Fn::GetAtt': [ 'MyResource', 'Name' ] },
            CounterArn: { 'Fn::GetAtt': [ 'MyResource', 'Arn' ] } ,
            CounterURL: { 'Fn::GetAtt': [ 'MyResource', 'URL' ] }
          }
        }
      }
    });

    test.done();
  },

  'ARN-type resource attributes have some common functionality'(test: Test) {
    const stack = new Stack();
    const res = new Counter(stack, 'MyResource', { Count: 1 });
    new Resource(stack, 'MyResource2', {
      type: 'Type',
      properties: {
        Perm: new PolicyStatement().addResource(res.arn).addActions('counter:add', 'counter:remove')
      }
    });

    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
      MyResource: { Type: "My::Counter", Properties: { Count: 1 } },
      MyResource2: {
        Type: "Type",
        Properties: {
        Perm: {
          Effect: "Allow",
          Action: [ "counter:add", "counter:remove" ],
          Resource: {
          "Fn::GetAtt": [ "MyResource", "Arn" ]
          }
        }
        }
      }
      }
    });

    test.done();
  },

  'resource.addDependency(e) can be used to add a DependsOn on another resource'(test: Test) {
    const stack = new Stack();
    const r1 = new Counter(stack, 'Counter1', { Count: 1 });
    const r2 = new Counter(stack, 'Counter2', { Count: 1 });
    const r3 = new Resource(stack, 'Resource3', { type: 'MyResourceType' });
    r2.addDependency(r1);
    r2.addDependency(r3);

    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        Counter1: {
          Type: "My::Counter",
          Properties: { Count: 1 }
        },
        Counter2: {
          Type: "My::Counter",
          Properties: { Count: 1 },
          DependsOn: [
            "Counter1",
            "Resource3"
          ]
        },
        Resource3: { Type: "MyResourceType" }
      }
    });

    test.done();
  },

  'conditions can be attached to a resource'(test: Test) {
    const stack = new Stack();
    const r1 = new Resource(stack, 'Resource', { type: 'Type' });
    const cond = new Condition(stack, 'MyCondition', { expression: new FnNot(new FnEquals('a', 'b')) });
    r1.options.condition = cond;

    test.deepEqual(stack.toCloudFormation(), {
      Resources: { Resource: { Type: 'Type', Condition: 'MyCondition' } },
      Conditions: { MyCondition: { 'Fn::Not': [ { 'Fn::Equals': [ 'a', 'b' ] } ] } }
    });

    test.done();
  },

  'creation/update/deletion policies can be set on a resource'(test: Test) {
    const stack = new Stack();
    const r1 = new Resource(stack, 'Resource', { type: 'Type' });

    r1.options.creationPolicy = { autoScalingCreationPolicy: { minSuccessfulInstancesPercent: 10 } };
    // tslint:disable-next-line:max-line-length
    r1.options.updatePolicy = { autoScalingScheduledAction: { ignoreUnmodifiedGroupSizeProperties: false }, autoScalingReplacingUpdate: { willReplace: true } };
    r1.options.deletionPolicy = DeletionPolicy.Retain;

    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        Resource: {
          Type: 'Type',
          CreationPolicy: { AutoScalingCreationPolicy: { MinSuccessfulInstancesPercent: 10 } },
          UpdatePolicy: {
            AutoScalingScheduledAction: { IgnoreUnmodifiedGroupSizeProperties: false },
            AutoScalingReplacingUpdate: { WillReplace: true }
          },
          DeletionPolicy: 'Retain'
        }
      }
    });

    test.done();
  },

  'metadata can be set on a resource'(test: Test) {
    const stack = new Stack();
    const r1 = new Resource(stack, 'Resource', { type: 'Type' });

    r1.options.metadata = {
      MyKey: 10,
      MyValue: 99
    };

    test.deepEqual(stack.toCloudFormation(), {
      Resources: {
        Resource: {
          Type: "Type",
          Metadata: {
            MyKey: 10,
            MyValue: 99
          }
        }
      }
    });

    test.done();
  },

  'the "type" property is required when creating a resource'(test: Test) {
    const stack = new Stack();
    test.throws(() => new Resource(stack, 'Resource', { notypehere: true } as any));
    test.done();
  },

  'the "name" property is deleted when synthesizing into a CloudFormation resource'(test: Test) {
    const stack = new Stack();

    new Resource(stack, 'Bla', {
      type: 'MyResource',
      properties: {
        Prop1: 'value1',
        name: 'Bla'
      }
    });

    test.deepEqual(stack.toCloudFormation(), { Resources:
      { Bla: { Type: 'MyResource', Properties: { Prop1: 'value1' } } } });
    test.done();
  },

  'removal policy is a high level abstraction of deletion policy used by l2'(test: Test) {
    const stack = new Stack();

    const orphan = new Resource(stack, 'Orphan', { type: 'T1' });
    const forbid = new Resource(stack, 'Forbid', { type: 'T2' });
    const destroy = new Resource(stack, 'Destroy', { type: 'T3' });

    applyRemovalPolicy(orphan, RemovalPolicy.Orphan);
    applyRemovalPolicy(forbid, RemovalPolicy.Forbid);
    applyRemovalPolicy(destroy, RemovalPolicy.Destroy);

    test.deepEqual(stack.toCloudFormation(), { Resources:
      { Orphan: { Type: 'T1', DeletionPolicy: 'Retain' },
        Forbid: { Type: 'T2', DeletionPolicy: 'Retain' },
        Destroy: { Type: 'T3' } } });
    test.done();
  },

  'addDependency adds all dependencyElements of dependent constructs'(test: Test) {

    class C1 extends Construct implements IDependable {
      public readonly r1: Resource;
      public readonly r2: Resource;
      public readonly r3: Resource;

      constructor(parent: Construct, name: string) {
        super(parent, name);

        this.r1 = new Resource(this, 'R1', { type: 'T1' });
        this.r2 = new Resource(this, 'R2', { type: 'T2' });
        this.r3 = new Resource(this, 'R3', { type: 'T3' });
      }

      get dependencyElements() {
        return [ this.r1, this.r2 ];
      }
    }

    class C2 extends Construct implements IDependable {
      public readonly r1: Resource;
      public readonly r2: Resource;
      public readonly r3: Resource;

      constructor(parent: Construct, name: string) {
        super(parent, name);

        this.r1 = new Resource(this, 'R1', { type: 'T1' });
        this.r2 = new Resource(this, 'R2', { type: 'T2' });
        this.r3 = new Resource(this, 'R3', { type: 'T3' });
      }

      get dependencyElements() {
        return [ this.r3 ];
      }
    }

    // C3 returns [ c2 ] for it's dependency elements
    // this should result in 'flattening' the list of elements.
    class C3 extends Construct implements IDependable {
      private readonly c2: C2;

      constructor(parent: Construct, name: string) {
        super(parent, name);

        this.c2 = new C2(this, 'C2');
      }

      get dependencyElements() {
        return [ this.c2 ];
      }
    }

    const stack = new Stack();
    const c1 = new C1(stack, 'MyC1');
    const c2 = new C2(stack, 'MyC2');
    const c3 = new C3(stack, 'MyC3');

    const dependingResource = new Resource(stack, 'MyResource', { type: 'R' });
    dependingResource.addDependency(c1, c2);
    dependingResource.addDependency(c3);

    test.deepEqual(stack.toCloudFormation(), { Resources:
      { MyC1R1FB2A562F: { Type: 'T1' },
        MyC1R2AE2B5066: { Type: 'T2' },
        MyC1R374967D02: { Type: 'T3' },
        MyC2R13C9A618D: { Type: 'T1' },
        MyC2R25330F905: { Type: 'T2' },
        MyC2R3809EEAD6: { Type: 'T3' },
        MyC3C2R1C64551A7: { Type: 'T1' },
        MyC3C2R2F213BD26: { Type: 'T2' },
        MyC3C2R38CE6F9F7: { Type: 'T3' },
        MyResource:
         { Type: 'R',
         DependsOn:
          [ 'MyC1R1FB2A562F',
          'MyC1R2AE2B5066',
          'MyC2R3809EEAD6',
          'MyC3C2R38CE6F9F7' ] } } });
    test.done();
  },

  'resource.ref returns the {Ref} token'(test: Test) {
    const stack = new Stack();
    const r = new Resource(stack, 'MyResource', { type: 'R' });

    test.deepEqual(resolve(r.ref), { Ref: 'MyResource' });
    test.done();
  }
};

interface CounterProps {
  // tslint:disable-next-line:variable-name
  Count: number;
}

class Counter extends Resource {
  public readonly arn: string;
  public readonly url: string;

  constructor(parent: Construct, name: string, props: CounterProps) {
    super(parent, name, { type: 'My::Counter', properties: { Count: props.Count } });
    this.arn = this.getAtt('Arn').toString();
    this.url = this.getAtt('URL').toString();
  }

  public increment(by = 1) {
    this.properties.Count += by;
  }
}

function withoutHash(logId: string) {
  return logId.substr(0, logId.length - 8);
}
