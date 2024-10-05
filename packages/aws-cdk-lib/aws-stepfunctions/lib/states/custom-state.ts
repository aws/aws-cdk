import { Construct } from 'constructs';
import { Chain } from '..';
import { State } from './state';
import { Annotations } from '../../../core/';
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

    if (this.hasMultipleRetrySources(state)) {
      this.addMultipleRetrySourcesWarning();
    }

    if (this.hasMultipleCatchSources(state)) {
      this.addMultipleCatchSourcesWarning();
    }

    // Retriers and Catchers can be specified directly in the stateJson or indirectly to the construct with addRetry() and addCatch().
    // renderRetryCatch() only renders the indirectly supplied Retriers and Catchers, so we need to manually merge in those directly in the stateJson
    if (Array.isArray(this.stateJson.Retry)) {
      state.Retry = Array.isArray(state.Retry) ? [...state.Retry, ...this.stateJson.Retry] : [...this.stateJson.Retry];
    }

    if (Array.isArray(this.stateJson.Catch)) {
      state.Catch = Array.isArray(state.Catch) ? [...state.Catch, ...this.stateJson.Catch] : [...this.stateJson.Catch];
    }

    return state;
  }

  private hasMultipleRetrySources(state: any): boolean {
    if (!Array.isArray(state.Retry)) {
      return false;
    }

    if (!Array.isArray(this.stateJson.Retry)) {
      return false;
    }

    return state.Retry.length > 0 && this.stateJson.Retry.length > 0;
  }

  private hasMultipleCatchSources(state: any): boolean {
    if (!Array.isArray(state.Catch)) {
      return false;
    }

    if (!Array.isArray(this.stateJson.Catch)) {
      return false;
    }

    return state.Catch.length > 0 && this.stateJson.Catch.length > 0;
  }

  private addMultipleRetrySourcesWarning(): void {
    Annotations.of(this).addWarningV2('@aws-cdk/aws-stepfunctions:multipleRetrySources', [
      'CustomState constructs can configure state retries using the stateJson property or by using the addRetry() function.',
      'When retries are configured using both of these, the state definition\'s Retry field is generated ',
      'by first rendering retries from addRetry(), then rendering retries from the stateJson.',
    ].join('\n'));
  }

  private addMultipleCatchSourcesWarning(): void {
    Annotations.of(this).addWarningV2('@aws-cdk/aws-stepfunctions:multipleCatchSources', [
      'CustomState constructs can configure state catchers using the stateJson property or by using the addCatch() function.',
      'When catchers are configured using both of these, the state definition\'s Catch field is generated ',
      'by first rendering catchers from addCatch(), then rendering catchers from the stateJson.',
    ].join('\n'));
  }
}
