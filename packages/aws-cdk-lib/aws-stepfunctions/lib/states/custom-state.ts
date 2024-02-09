import { Construct } from 'constructs';
import { State } from './state';
import { Chain } from '..';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';

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
  private readonly stateJson: { [key: string]: any };

  constructor(scope: Construct, id: string, props: CustomStateProps) {
    super(scope, id, {});

    this.endStates = [this];
    this.stateJson = props.stateJson;
  }

  /**
   * Add retry configuration for this state
   *
   * This controls if and how the execution will be retried if a particular
   * error occurs.
   */
  public addRetry(props: RetryProps = {}): CustomState {
    super._addRetry(props);
    return this;
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
    const state = {
      ...this.renderNextEnd(),
      ...this.stateJson,
      ...this.renderRetryCatch(),
    };

    // merge the Retry filed defined in the stateJson into the state
    if (Array.isArray(this.stateJson.Retry)) {
      state.Retry = [...state.Retry, ...this.stateJson.Retry];
    }

    return state;
  }
}
