import { IResolvable, IResolveContext } from '../resolvable';
import { Resource } from '../resource';
import { Stack } from '../stack';
import { captureStackTrace } from '../stack-trace';

/**
 * A Token that represents a reference that spans accounts and/or regions,
 * and so requires the resources to have physical names.
 * You should never need to interact with these directly,
 * instead use the `resource.crossEnvironmentTokens` method.
 */
export class CrossEnvironmentAttribute implements IResolvable {
  public readonly creationStack: string[];

  /**
   * @param regularValue the value used when this is referenced NOT from a cross account and/or region Stack
   * @param crossEnvironmentValue the value used when this is referenced from a cross account and/or region Stack
   * @param resource the scope this reference is mastered in. Used to determine the owning Stack
   * @param displayName a short name to be used in Token display
   */
  constructor(
    private readonly regularValue: string,
    private readonly crossEnvironmentValue: string,
    private readonly resource: Resource) {
    this.creationStack = captureStackTrace();
  }

  public resolve(context: IResolveContext): any {
    const consumingStack = Stack.of(context.scope);
    const owningStack = Stack.of(this.resource);

    if (consumingStack.environment !== owningStack.environment) {
      this.resource._enableCrossEnvironment();
      return this.crossEnvironmentValue;
    } else {
      return this.regularValue;
    }
  }
}
