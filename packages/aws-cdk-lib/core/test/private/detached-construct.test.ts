import { Construct } from 'constructs';
import { ENABLE_ADDITIONAL_METADATA_COLLECTION } from '../../../cx-api/lib/features';
import { JSII_RUNTIME_SYMBOL } from '../../lib/constants';
import { UnscopedValidationError } from '../../lib/errors';
import { addMetadata } from '../../lib/metadata-resource';
import { MetadataType } from '../../lib/metadata-type';
import { DetachedConstruct } from '../../lib/private/detached-construct';

class TestDetachedConstruct extends DetachedConstruct {
  constructor(message: string) {
    super(message);
  }
}

describe('DetachedConstruct', () => {
  test('throws UnscopedValidationError when accessing node', () => {
    const construct = new TestDetachedConstruct('test error message');

    expect(() => construct.node).toThrow(UnscopedValidationError);
    expect(() => construct.node).toThrow('test error message');
  });

  test('throws UnscopedValidationError when accessing env', () => {
    const construct = new TestDetachedConstruct('test error message');

    expect(() => construct.env).toThrow(UnscopedValidationError);
    expect(() => construct.env).toThrow('test error message');
  });

  test('returns false for Construct.isConstruct', () => {
    const construct = new TestDetachedConstruct('test error message');

    expect(Construct.isConstruct(construct)).toBe(false);
  });

  test('addMetadata will not throw when encountering a detached construct in props', () => {
    class TestConstruct extends Construct {
      // we pretend to be a aws-iam.Role for this test
      static readonly [JSII_RUNTIME_SYMBOL] = {
        fqn: 'aws-cdk-lib.aws-iam.Role',
      };

      constructor() {
        super(null as any, '');

        // enable metadata collection
        this.node.setContext(ENABLE_ADDITIONAL_METADATA_COLLECTION, true);
      }
    }

    const underTest = new TestConstruct();
    expect(() => {
      addMetadata(underTest, MetadataType.CONSTRUCT, {
        managedPolicies: [new TestDetachedConstruct('test error message')],
      });
    }).not.toThrow();
  });

  test('detached construct will not throw when enumerated', () => {
    // WHEN & THEN
    const underTest = new TestDetachedConstruct('test error message');
    expect(() => {
      // this mimics access patterns used by some popular userland libraries like lodash
      for (const key of Object.keys(underTest)) {
        void((underTest as any)[key]);
      }
    }).not.toThrow();
  });
});
