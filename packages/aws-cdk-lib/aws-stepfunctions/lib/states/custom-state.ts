import { Construct } from 'constructs';
import { State } from './state';
import { Chain } from '..';
import { CatchProps, IChainable, INextable } from '../types';

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
   * Add a recovery handler for this state
   *
   * When a particular error occurs, execution will continue at the error
   * handler instead of failing the state machine execution.
   */
  public addCatch(handler: IChainable, props: CatchProps = {}): CustomState {
    super._addCatch(handler.startState, props);
    return this;
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
