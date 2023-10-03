import { Construct } from 'constructs';
import { State } from './state';
import { Chain } from '..';
import { IChainable, INextable } from '../types';

/**
 * Properties for defining a custom state definition
 */
export interface CustomStateProps {
  /**
   * Amazon States Language (JSON-based) definition of the state
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html
   */
  readonly stateJson: { [key: string]: any };
}

/**
 * State defined by supplying Amazon States Language (ASL) in the state machine.
 *
 */
export class CustomState extends State implements IChainable, INextable {
  public readonly endStates: INextable[];

  /**
   * Amazon States Language (JSON-based) definition of the state
   */
  private readonly stateJson: { [key: string]: any};

  constructor(scope: Construct, id: string, props: CustomStateProps) {
    super(scope, id, {});

    this.endStates = [this];
    this.stateJson = props.stateJson;
  }

  /**
   * Continue normal execution with the given state
   */
  public next(next: IChainable): Chain {
    super.makeNext(next.startState);
    return Chain.sequence(this, next);
  }

  /**
   * Returns the Amazon States Language object for this state
   */
  public toStateJson(): object {
    return {
      ...this.renderNextEnd(),
      ...this.stateJson,
    };
  }
}
