import { Construct, IConstruct, Node, RootConstruct } from 'constructs';
import type { IEnvironmentAware, ResourceEnvironment } from '../environment';
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

  constructor(message: string, messageKind: 'full' | 'source' = 'full') {
    super(null as any, undefined as any);

    this.errorMessage = messageKind === 'full'
      ? message
      : `Objects returned by ${message} cannot be used in this API: they are not real constructs and do not have a construct tree 'node'`;

    // Use Object.defineProperty to override 'node' property instead of a getter
    // to avoid TS2611 error (property vs accessor conflict with base class)
    Object.defineProperty(this, 'node', {
      value: new Node(this, new RootConstruct(), 'DetachedConstruct'),
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

/**
 * A resource construct that is not attached to the construct tree.
 *
 * This server as a base class for objects that need to implement
 * `IConstruct`/`IEnvironmentAware` but can't because they have no way of
 * finding the construct tree at the moment they are instantiated.
 *
 * All default accessors that have to do with the construct and construct
 * environments will an error.
 *
 * The usability of these constructs is limited, and so the use of this base
 * class should only be used as a last resort.
 */
export abstract class DetachedResource extends DetachedConstruct implements IEnvironmentAware {
  constructor(private readonly source: string) {
    super(source, 'source');
  }

  public get env(): ResourceEnvironment {
    throw new UnscopedValidationError(`Objects returned by ${this.source} cannot be used in this API: they are not real constructs and do not have an 'env'`);
  }
}
