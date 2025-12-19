import { Construct } from 'constructs';
import { UnscopedValidationError } from '../../lib/errors';
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
});
