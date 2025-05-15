import { Construct, IConstruct } from 'constructs';
import { PROPERTY_INJECTORS_SYMBOL } from './prop-injectors-helpers';

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
   * Return whether the given object has a PropertyInjectors property.
   *
   * We do attribute detection since we can't reliably use 'instanceof'.
   */
  public static hasPropertyInjectors(x: any): x is PropertyInjectors {
    return x !== null && typeof(x) === 'object' && PROPERTY_INJECTORS_SYMBOL in x;
  }

  /**
   * Returns the `PropertyInjectors` object associated with a construct scope.
   * If `PropertyInjectors` object doesn't exist on this scope, then it creates one and attaches it to scope.
   * @param scope The scope for which these PropertyInjectors will apply.
   */
  public static of(scope: IConstruct): PropertyInjectors {
    let propInjectors = (scope as any)[PROPERTY_INJECTORS_SYMBOL];
    if (!propInjectors) {
      propInjectors = new PropertyInjectors(scope);

      Object.defineProperty(scope, PROPERTY_INJECTORS_SYMBOL, {
        value: propInjectors,
        configurable: false,
        enumerable: false,
      });
    }
    return propInjectors;
  }

  /**
   * The scope attached to Injectors.
   */
  public readonly scope: IConstruct;

  private readonly _injectors: Map<string, IPropertyInjector>;

  private constructor(scope: IConstruct) {
    this._injectors = new Map<string, IPropertyInjector>();
    this.scope = scope;
  }

  /**
   * Add a list of  IPropertyInjectors to this collection of PropertyInjectors.
   * @param propsInjectors - a list of IPropertyInjector
   */
  public add(...propsInjectors: IPropertyInjector[]) {
    for (const pi of propsInjectors) {
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
   * This returns a list of the Constructs that are supporting by this PropertyInjectors.
   * @returns a list of string showing the supported Constructs.
   */
  public supportedClasses(): string[] {
    return Array.from(this._injectors.keys());
  }
}
