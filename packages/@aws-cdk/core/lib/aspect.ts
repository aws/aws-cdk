import { IConstruct } from 'constructs';

/**
 * Represents an Aspect
 */
export interface IAspect {
  /**
   * All aspects can visit an IConstruct
   */
  visit(node: IConstruct): void;
}

const ASPECTS_SYMBOL = Symbol('cdk-aspects');

/**
 * Aspects can be applied to CDK tree scopes and can operate on the tree before
 * synthesis.
 */
export class Aspects {

  /**
   * Returns the `Aspects` object associated with a construct scope.
   * @param scope The scope for which these aspects will apply.
   */
  public static of(scope: IConstruct): Aspects {
    const aspects = (scope as any)[ASPECTS_SYMBOL];
    if (aspects) {
      return aspects;
    }

    Object.defineProperty(scope, ASPECTS_SYMBOL, {
      value: new Aspects(scope),
      configurable: false,
      enumerable: false,
    });

    return this.of(scope);
  }

  private readonly _aspects = new Array<IAspect>();

  private constructor(_construct: IConstruct) { }

  /**
   * Adds an aspect to be applied on this scope before synthesis.
   * @param aspect The aspect to apply.
   */
  public add(aspect: IAspect) {
    this._aspects.push(aspect);
  }

  /**
   * The list of aspects which were directly applied on this scope.
   */
  public get aspects(): IAspect[] {
    return  [ ...this._aspects ];
  }
}