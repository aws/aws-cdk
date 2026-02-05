import type { IConstruct } from 'constructs';
import { Construct } from 'constructs';
import { CfnResource, Stack } from '../../core';
import * as iam from '../lib';

describe('ResourceWithPolicies', () => {
  let stack: Stack;

  beforeEach(() => {
    stack = new Stack();
  });

  describe('decorator registration and lookup with overrides', () => {
    test('returns decorator from immediate parent', () => {
      const parent = new TestConstruct(stack, 'Parent');
      const decorator = new MockDecorator('parent');
      iam.ResourceWithPolicies.register(parent, 'AWS::Test::Resource', decorator);

      const resource = new CfnResource(parent, 'Resource', { type: 'AWS::Test::Resource' });
      const result = iam.ResourceWithPolicies.of(resource);

      expect(result).toBeDefined();
      expect((result as any).decoratorId).toBe('parent');
    });

    test('child decorator overrides parent decorator for same type', () => {
      const parent = new TestConstruct(stack, 'Parent');
      const child = new TestConstruct(parent, 'Child');

      const parentDecorator = new MockDecorator('parent');
      const childDecorator = new MockDecorator('child');

      iam.ResourceWithPolicies.register(parent, 'AWS::Test::Resource', parentDecorator);
      iam.ResourceWithPolicies.register(child, 'AWS::Test::Resource', childDecorator);

      const resource = new CfnResource(child, 'Resource', { type: 'AWS::Test::Resource' });
      const result = iam.ResourceWithPolicies.of(resource);

      expect((result as any).decoratorId).toBe('child');
    });

    test('grandchild decorator overrides parent and grandparent', () => {
      const grandparent = new TestConstruct(stack, 'Grandparent');
      const parent = new TestConstruct(grandparent, 'Parent');
      const child = new TestConstruct(parent, 'Child');

      iam.ResourceWithPolicies.register(grandparent, 'AWS::Test::Resource', new MockDecorator('grandparent'));
      iam.ResourceWithPolicies.register(parent, 'AWS::Test::Resource', new MockDecorator('parent'));
      iam.ResourceWithPolicies.register(child, 'AWS::Test::Resource', new MockDecorator('child'));

      const resource = new CfnResource(child, 'Resource', { type: 'AWS::Test::Resource' });
      const result = iam.ResourceWithPolicies.of(resource);

      expect((result as any).decoratorId).toBe('child');
    });

    test('uses parent decorator when child has different type', () => {
      const parent = new TestConstruct(stack, 'Parent');
      const child = new TestConstruct(parent, 'Child');

      iam.ResourceWithPolicies.register(parent, 'AWS::Test::ResourceA', new MockDecorator('parentA'));
      iam.ResourceWithPolicies.register(child, 'AWS::Test::ResourceB', new MockDecorator('childB'));

      const resource = new CfnResource(child, 'Resource', { type: 'AWS::Test::ResourceA' });
      const result = iam.ResourceWithPolicies.of(resource);

      expect((result as any).decoratorId).toBe('parentA');
    });

    test('multiple resource types with selective overrides', () => {
      //   Parent (S3, SQS)
      //      |
      //    Child (S3 override)
      //     / \
      //   S3  SQS (resources)
      const parent = new TestConstruct(stack, 'Parent');
      const child = new TestConstruct(parent, 'Child');

      iam.ResourceWithPolicies.register(parent, 'AWS::S3::Bucket', new MockDecorator('parent-s3'));
      iam.ResourceWithPolicies.register(parent, 'AWS::SQS::Queue', new MockDecorator('parent-sqs'));
      iam.ResourceWithPolicies.register(child, 'AWS::S3::Bucket', new MockDecorator('child-s3'));

      const s3Resource = new CfnResource(child, 'S3', { type: 'AWS::S3::Bucket' });
      const sqsResource = new CfnResource(child, 'SQS', { type: 'AWS::SQS::Queue' });

      expect((iam.ResourceWithPolicies.of(s3Resource) as any).decoratorId).toBe('child-s3');
      expect((iam.ResourceWithPolicies.of(sqsResource) as any).decoratorId).toBe('parent-sqs');
    });

    test('deep hierarchy with mixed overrides', () => {
      // L1 (Type1, Type2)
      //  |
      // L2 - R3:Type1
      //  |
      // L3 (Type1 override)
      //  |
      // L4
      //  |
      // L5 (Type2 override)
      //  |
      // R1:Type1, R2:Type2
      const l1 = new TestConstruct(stack, 'L1');
      const l2 = new TestConstruct(l1, 'L2');
      const l3 = new TestConstruct(l2, 'L3');
      const l4 = new TestConstruct(l3, 'L4');
      const l5 = new TestConstruct(l4, 'L5');

      iam.ResourceWithPolicies.register(l1, 'Type1', new MockDecorator('l1-type1'));
      iam.ResourceWithPolicies.register(l1, 'Type2', new MockDecorator('l1-type2'));
      iam.ResourceWithPolicies.register(l3, 'Type1', new MockDecorator('l3-type1'));
      iam.ResourceWithPolicies.register(l5, 'Type2', new MockDecorator('l5-type2'));

      const r1 = new CfnResource(l5, 'R1', { type: 'Type1' });
      const r2 = new CfnResource(l5, 'R2', { type: 'Type2' });
      const r3 = new CfnResource(l2, 'R3', { type: 'Type1' });

      expect((iam.ResourceWithPolicies.of(r1) as any).decoratorId).toBe('l3-type1');
      expect((iam.ResourceWithPolicies.of(r2) as any).decoratorId).toBe('l5-type2');
      expect((iam.ResourceWithPolicies.of(r3) as any).decoratorId).toBe('l1-type1');
    });

    test('sibling branches do not interfere', () => {
      const parent = new TestConstruct(stack, 'Parent');
      const branch1 = new TestConstruct(parent, 'Branch1');
      const branch2 = new TestConstruct(parent, 'Branch2');

      iam.ResourceWithPolicies.register(parent, 'AWS::Test::Resource', new MockDecorator('parent'));
      iam.ResourceWithPolicies.register(branch1, 'AWS::Test::Resource', new MockDecorator('branch1'));

      const r1 = new CfnResource(branch1, 'R1', { type: 'AWS::Test::Resource' });
      const r2 = new CfnResource(branch2, 'R2', { type: 'AWS::Test::Resource' });

      expect((iam.ResourceWithPolicies.of(r1) as any).decoratorId).toBe('branch1');
      expect((iam.ResourceWithPolicies.of(r2) as any).decoratorId).toBe('parent');
    });

    test('caches result for same resource', () => {
      const parent = new TestConstruct(stack, 'Parent');
      const decorator = new MockDecorator('parent');
      iam.ResourceWithPolicies.register(parent, 'AWS::Test::Resource', decorator);

      const resource = new CfnResource(parent, 'Resource', { type: 'AWS::Test::Resource' });
      const result1 = iam.ResourceWithPolicies.of(resource);
      const result2 = iam.ResourceWithPolicies.of(resource);

      expect(result1).toBe(result2);
    });

    test('complex tree with multiple types and overrides at different levels', () => {
      //        Root (T1, T2, T3)
      //        /   \
      //       A     B
      //    (T1,T2) (T2)
      //      / \     \
      //     A1  A2   B1
      //    (T1)      (T3)
      const root = new TestConstruct(stack, 'Root');
      const a = new TestConstruct(root, 'A');
      const b = new TestConstruct(root, 'B');
      const a1 = new TestConstruct(a, 'A1');
      const a2 = new TestConstruct(a, 'A2');
      const b1 = new TestConstruct(b, 'B1');

      iam.ResourceWithPolicies.register(root, 'T1', new MockDecorator('root-t1'));
      iam.ResourceWithPolicies.register(root, 'T2', new MockDecorator('root-t2'));
      iam.ResourceWithPolicies.register(root, 'T3', new MockDecorator('root-t3'));
      iam.ResourceWithPolicies.register(a, 'T1', new MockDecorator('a-t1'));
      iam.ResourceWithPolicies.register(a, 'T2', new MockDecorator('a-t2'));
      iam.ResourceWithPolicies.register(b, 'T2', new MockDecorator('b-t2'));
      iam.ResourceWithPolicies.register(a1, 'T1', new MockDecorator('a1-t1'));
      iam.ResourceWithPolicies.register(b1, 'T3', new MockDecorator('b1-t3'));

      const tests = [
        { parent: a1, type: 'T1', expected: 'a1-t1' },
        { parent: a1, type: 'T2', expected: 'a-t2' },
        { parent: a1, type: 'T3', expected: 'root-t3' },
        { parent: a2, type: 'T1', expected: 'a-t1' },
        { parent: a2, type: 'T2', expected: 'a-t2' },
        { parent: b1, type: 'T1', expected: 'root-t1' },
        { parent: b1, type: 'T2', expected: 'b-t2' },
        { parent: b1, type: 'T3', expected: 'b1-t3' },
      ];

      tests.forEach(({ parent, type, expected }, idx) => {
        const resource = new CfnResource(parent, `R${idx}`, { type });
        const result = iam.ResourceWithPolicies.of(resource);
        expect((result as any).decoratorId).toBe(expected);
      });
    });

    test('override at resource level takes precedence', () => {
      const parent = new TestConstruct(stack, 'Parent');
      const child = new TestConstruct(parent, 'Child');

      iam.ResourceWithPolicies.register(parent, 'AWS::Test::Resource', new MockDecorator('parent'));
      iam.ResourceWithPolicies.register(child, 'AWS::Test::Resource', new MockDecorator('child'));

      const resource = new CfnResource(child, 'Resource', { type: 'AWS::Test::Resource' });
      iam.ResourceWithPolicies.register(resource, 'AWS::Test::Resource', new MockDecorator('resource'));

      const result = iam.ResourceWithPolicies.of(resource);
      expect((result as any).decoratorId).toBe('resource');
    });

    test('multiple overrides in linear chain', () => {
      const nodes: IConstruct[] = [stack];
      for (let i = 0; i < 10; i++) {
        nodes.push(new TestConstruct(nodes[i], `Node${i}`));
      }

      iam.ResourceWithPolicies.register(nodes[0], 'T', new MockDecorator('n0'));
      iam.ResourceWithPolicies.register(nodes[3], 'T', new MockDecorator('n3'));
      iam.ResourceWithPolicies.register(nodes[7], 'T', new MockDecorator('n7'));
      iam.ResourceWithPolicies.register(nodes[10], 'T', new MockDecorator('n10'));

      const r1 = new CfnResource(nodes[2], 'R1', { type: 'T' });
      const r2 = new CfnResource(nodes[5], 'R2', { type: 'T' });
      const r3 = new CfnResource(nodes[9], 'R3', { type: 'T' });
      const r4 = new CfnResource(nodes[10], 'R4', { type: 'T' });

      expect((iam.ResourceWithPolicies.of(r1) as any).decoratorId).toBe('n0');
      expect((iam.ResourceWithPolicies.of(r2) as any).decoratorId).toBe('n3');
      expect((iam.ResourceWithPolicies.of(r3) as any).decoratorId).toBe('n7');
      expect((iam.ResourceWithPolicies.of(r4) as any).decoratorId).toBe('n10');
    });
  });
});

class TestConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
  }
}

class MockDecorator implements iam.ResourcePolicyDecorator {
  constructor(private readonly id: string) {}

  decorate(_resource: Construct): iam.IResourceWithPolicyV2 {
    return {
      env: { account: '123456789012', region: 'us-east-1' },
      addToResourcePolicy: () => ({ statementAdded: true }),
      decoratorId: this.id,
    } as any;
  }
}
