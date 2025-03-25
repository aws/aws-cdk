import { warn } from 'console';
import { Construct, IConstruct, Node } from 'constructs';

/**
 * This symbol is needed to identify PropertyInjectors.
 */
const PROPERTY_INJECTORS_SYMBOL = Symbol.for('@aws-cdk/core.PropertyInjectors');

/**
 * This defines the values needed for Injection.
 */
export interface InjectionContext {
  /**
   * scope from the  constructor
   */
  readonly scope: Construct;

  /**
   * id from the Construct constructor
   */
  readonly id: string;
}

/**
 * This interface define an inject function that operates on a Construct's Property.
 * The Construct must have a constructUniqueId to uniquely identify itself.
 */
export interface IPropertyInjector {
  /**
   * The unique Id of the Construct class.
   */
  readonly constructUniqueId: string;

  /**
   * The injector to be applied to the constructor properties of the Construct.
   */
  inject(originalProps: any, context: InjectionContext): any;
}

/**
 * This is a collection of ProjectInjectors assigned to this scope.
 * It is keyed by constructUniqueId.  There can be only one ProjectInjector for a constructUniqueId.
 */
export class PropertyInjectors {
  /**
   * Return whether the given object is a PropertyInjectors.
   *
   * We do attribute detection since we can't reliably use 'instanceof'.
   */
  public static isPropertyInjectors(x: any): x is PropertyInjectors {
    return x !== null && typeof(x) === 'object' && PROPERTY_INJECTORS_SYMBOL in x;
  }

  /**
   * Returns the `PropertyInjectors` object associated with a construct scope.
   * @param scope The scope for which these PropertyInjectors will apply.
   */
  public static of(scope: IConstruct): PropertyInjectors {
    let propInjectors = (scope as any)[PROPERTY_INJECTORS_SYMBOL];
    if (!propInjectors) {
      propInjectors = new PropertyInjectors(scope);

      Object.defineProperty(scope, PROPERTY_INJECTORS_SYMBOL, {
        value: propInjectors,
        configurable: true,
        enumerable: true,
      });
    }
    return propInjectors;
  }

  private readonly _scope: IConstruct;
  private readonly _injectors: Map<string, IPropertyInjector>;

  private constructor(scope: IConstruct) {
    this._injectors = new Map<string, IPropertyInjector>();
    this._scope = scope;
  }

  /**
   * Add a list of  IPropertyInjectors to this collection of PropertyInjectors.
   * @param propsInjectors - a list of IPropertyInjector
   */
  public add(...propsInjectors: IPropertyInjector[]) {
    for (const pi of propsInjectors) {
      if (this._injectors.has(pi.constructUniqueId)) {
        warn(`WARN: Overwriting injector for ${pi.constructUniqueId}`);
      }
      this._injectors.set(pi.constructUniqueId, pi);
    }
  }

  /**
   * Get the PropertyInjector that is registered to the Construct's uniqueId.
   * @param uniqueId - the construct uniqueId
   * @returns - the IPropertyInjector for that construct uniqueId
   */
  public for(uniqueId: string): IPropertyInjector | undefined {
    return this._injectors.get(uniqueId);
  }

  /**
   * Returns the scope attached to Injectors.
   * @returns the scope
   */
  public scope() {
    return this._scope;
  }

  /**
   * This returns a list of the Constructs that are supporting by this PropertyInjectors.
   * @returns a list of string showing the supported Constructs.
   */
  public supportedClasses(): string[] {
    return Array.from(this._injectors.keys());
  }
}

/**
 * This is called by the constructor to find and apply the PropertyInjector for that Construct.
 * @param uniqueId - uniqueId of the Construct
 * @param originalProps - original constructor properties
 * @param context - context of the injection
 * @returns a new props with default values.
 */
export function applyInjectors(uniqueId: string, originalProps: any, context: InjectionContext): any {
  // find the PropertyInjectors from scope
  let injectors;
  try {
    injectors = findInjectorsFromConstruct(context.scope, uniqueId);
  } catch (err) {
    // this happens when no PropertyInjector is found in the scope tree
    return originalProps;
  }

  // Find the injector for the Construct and apply it.
  const propsInjector = injectors.for(uniqueId);
  if (propsInjector) {
    // Any errors that inject throws will be surfaced.
    return propsInjector.inject(originalProps, {
      scope: context.scope,
      id: context.id,
    });
  } else {
    warn(`no injector found for ${uniqueId} at ${context.scope}`);
  }

  return originalProps;
}

/**
 * This function finds the PropertyInjectors in the scope by walking up the scope tree.
 * Borrowed logic from Stack.of.
 */
function findInjectorsFromConstruct(scope: IConstruct, uniqueId: string): PropertyInjectors {
  // c is really a Construct
  const result = _lookup(scope);
  const injectors = _getInjectorsFromConstruct(result) as unknown as PropertyInjectors;

  const propsInjector = injectors.for(uniqueId);
  if (!propsInjector) {
    const parent = Node.of(scope).scope;
    if (parent) {
      return findInjectorsFromConstruct(parent, uniqueId);
    }
  }
  return injectors;

  function _getInjectorsFromConstruct(c: any): any {
    type ObjKey = keyof typeof c;
    const k = PROPERTY_INJECTORS_SYMBOL as unknown as ObjKey;
    return c[k];
  }

  function _lookup(c: Construct): PropertyInjectors {
    if (PropertyInjectors.isPropertyInjectors(c)) {
      return c;
    }

    const _scope = Node.of(c).scope;
    if (!_scope) {
      throw new Error(`${scope.constructor?.name ?? 'Construct'} at '${Node.of(scope).path}'. no PropertyInjectors found`);
    }

    return _lookup(_scope);
  }
}

// Class Decorator fails JSII.  See https://github.com/aws/aws-cdk/pull/33213
// Decorator References:
//    https://www.typescriptlang.org/docs/handbook/decorators.html#class-decorators
//    https://stackoverflow.com/questions/66077874/how-to-obtain-constructor-arguments-inside-a-decorator

type Constructor = { new (...args: any[]): {} };

/**
 * This decorator applies property injection before calling the Construct's constructor.
 * @param constructor constructor of the Construct
 * @returns an instance of the class with Property Injection applied.
 */
export function propertyInjectionDecorator<T extends Constructor>(constructor: T) {
  return class extends constructor {
    constructor(...args: any[]) {
      const scope = args[0];
      const id = args[1];
      let props = args[2];

      // eslint-disable-next-line dot-notation
      const uniqueId = (constructor as any)['PROPERTY_INJECTION_ID'] as string;
      props = applyInjectors(uniqueId, props, {
        scope,
        id,
      });

      super(scope, id, props);
    }
  };
}
