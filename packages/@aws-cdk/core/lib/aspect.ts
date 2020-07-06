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

export class Aspects {
  public static of(construct: IConstruct): Aspects {
    let aspects = (construct as any)[ASPECTS_SYMBOL];
    if (!aspects) {
      aspects = Object.defineProperty(construct, ASPECTS_SYMBOL, {
        value: new Aspects(construct),
        configurable: false,
        enumerable: false,
      });
    }
    return aspects;
  }

  private readonly _aspects = new Array<IAspect>();

  private constructor(_construct: IConstruct) { }

  public apply(aspect: IAspect) {
    this._aspects.push(aspect);
  }

  public get aspects(): IAspect[] {
    return  [ ...this._aspects ];
  }
}