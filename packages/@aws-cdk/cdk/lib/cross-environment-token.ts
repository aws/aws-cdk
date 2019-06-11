import { ArnComponents } from './arn';
import { IResource } from './resource';
import { Stack } from './stack';
import { IResolveContext, Token } from './token';

/**
 * A Token that represents a reference that spans accounts and/or regions,
 * and so requires the resources to have physical names.
 * You should never need to interact with these directly,
 * instead use the {@link ResourceIdentifiers} class.
 * This class is private to the @aws-cdk/cdk package.
 */
export abstract class CrossEnvironmentToken extends Token {
  private readonly resource: IResource;

  /**
   * @param regularValue the value used when this is referenced NOT from a cross account and/or region Stack
   * @param crossEnvironmentValue the value used when this is referenced from a cross account and/or region Stack
   * @param resource the scope this reference is mastered in. Used to determine the owning Stack
   * @param displayName a short name to be used in Token display
   */
  protected constructor(private readonly regularValue: string, private readonly crossEnvironmentValue: any,
                        resource: IResource, displayName: string) {
    super(undefined, displayName);

    this.resource = resource;
  }

  public resolve(context: IResolveContext): any {
    const consumingStack = Stack.of(context.scope);
    const owningStack = Stack.of(this.resource);

    if (consumingStack.env.account !== owningStack.env.account ||
        consumingStack.env.region !== owningStack.env.region) {
      this.resource.physicalName._resolveCrossEnvironment(this.resource);
      return this.crossEnvironmentValue;
    } else {
      return this.regularValue;
    }
  }
}

export class CrossEnvironmentPhysicalArnToken extends CrossEnvironmentToken {
  constructor(regularValue: string, arnComponents: ArnComponents, resource: IResource, displayName: string = 'Arn') {
    super(regularValue, Stack.of(resource).formatArn(arnComponents), resource, displayName);
  }
}

export class CrossEnvironmentPhysicalNameToken extends CrossEnvironmentToken {
  constructor(regularValue: string, resource: IResource, displayName: string = 'Ref') {
    super(regularValue, resource.physicalName.value, resource, displayName);
  }
}
