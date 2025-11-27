import { Construct, IConstruct } from 'constructs';
import type { ResourceEnvironment } from '../environment';
import { UnscopedValidationError } from '../errors';

const CONSTRUCT_SYM = Symbol.for('constructs.Construct');

/**
 * Base class for detached constructs that throw UnscopedValidationError
 * when accessing node, env, or with() methods.
 *
 * This is used by legacy APIs like ManagedPolicy.fromAwsManagedPolicyName() and
 * CloudFront policy imports that return construct-like objects without requiring
 * a scope parameter. These APIs predate modern CDK patterns and cannot be changed
 * without breaking existing customer code.
 *
 * DO NOT USE for new code. New APIs should require a scope parameter.
 *
 * @internal
 */
export abstract class DetachedConstruct extends Construct implements IConstruct {
  private readonly errorMessage: string;

  constructor(errorMessage: string) {
    super(null as any, undefined as any);

    this.errorMessage = errorMessage;

    // Use Object.defineProperty to override 'node' property instead of a getter
    // to avoid TS2611 error (property vs accessor conflict with base class)
    Object.defineProperty(this, 'node', {
      get() { throw new UnscopedValidationError(errorMessage); },
    });

    // Despite extending Construct, DetachedConstruct doesn't work like one.
    // So we try to not pretend that this is a construct as much as possible.
    Object.defineProperty(this, CONSTRUCT_SYM, {
      value: false,
      enumerable: false,
      writable: false,
    });
  }

  public get env(): ResourceEnvironment {
    throw new UnscopedValidationError(this.errorMessage);
  }
}
