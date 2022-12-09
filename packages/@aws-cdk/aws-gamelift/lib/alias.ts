import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IFleet } from './fleet-base';
import { IGameSessionQueueDestination } from './game-session-queue';
import { CfnAlias } from './gamelift.generated';

/**
 * Represents a Gamelift Alias for a Gamelift fleet destination.
 */
export interface IAlias extends cdk.IResource, IGameSessionQueueDestination {

  /**
     * The Identifier of the alias.
     *
     * @attribute
     */
  readonly aliasId: string;

  /**
   * The ARN of the alias.
   *
   * @attribute
   */
  readonly aliasArn: string;
}

/**
 * Options for `gamelift.Alias`.
 */
export interface AliasOptions {
  /**
     * Description for the alias
     *
     * @default No description
     */
  readonly description?: string;
}

/**
 * A full specification of an alias that can be used to import it fluently into the CDK application.
 */
export interface AliasAttributes {
  /**
       * The ARN of the alias
       *
       * At least one of `aliasArn` and `aliasId` must be provided.
       *
       * @default derived from `aliasId`.
       */
  readonly aliasArn?: string;

  /**
     * The identifier of the alias
     *
     * At least one of `aliasId` and `aliasArn`  must be provided.
     *
     * @default derived from `aliasArn`.
     */
  readonly aliasId?: string;
}

/**
 * Properties for a new Fleet alias
 */
export interface AliasProps {
  /**
     * Name of this alias
     */
  readonly aliasName: string;

  /**
     * A human-readable description of the alias
     *
     * @default no description
     */
  readonly description?: string;

  /**
   * A fleet that the alias points to.
   * If specified, the alias resolves to one specific fleet.
   *
   * At least one of `fleet` and `terminalMessage` must be provided.
   *
   * @default no fleet that the alias points to.
   */
  readonly fleet?: IFleet;

  /**
   * The message text to be used with a terminal routing strategy.
   *
   * At least one of `fleet` and `terminalMessage` must be provided.
   *
   * @default no terminal message
   */
  readonly terminalMessage?: string;
}

/**
 * Base class for new and imported GameLift Alias.
 */
export abstract class AliasBase extends cdk.Resource implements IAlias {
  /**
 * The Identifier of the alias.
 */
  public abstract readonly aliasId: string;
  /**
   * The ARN of the alias
   */
  public abstract readonly aliasArn: string;
  /**
   * The ARN to put into the destination field of a game session queue
   */
  public get resourceArnForDestination() {
    return this.aliasArn;
  }
}

/**
 * A Amazon GameLift alias is used to abstract a fleet designation.
 * Fleet designations tell GameLift where to search for available resources when creating new game sessions for players.
 * Use aliases instead of specific fleet IDs to seamlessly switch player traffic from one fleet to another by changing the alias's target location.
 *
 * Aliases are useful in games that don't use queues.
 * Switching fleets in a queue is a simple matter of creating a new fleet, adding it to the queue, and removing the old fleet, none of which is visible to players.
 * In contrast, game clients that don't use queues must specify which fleet to use when communicating with the GameLift service.
 * Without aliases, a fleet switch requires updates to your game code and possibly distribution of an updated game clients to players.
 *
 * When updating the fleet-id an alias points to, there is a transition period of up to 2 minutes where game sessions on the alias may end up on the old fleet.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/developerguide/aliases-creating.html
 *
 * @resource AWS::GameLift::Alias
 */
export class Alias extends AliasBase {

  /**
   * Import an existing alias from its identifier.
   */
  static fromAliasId(scope: Construct, id: string, aliasId: string): IAlias {
    return this.fromAliasAttributes(scope, id, { aliasId: aliasId });
  }

  /**
   * Import an existing alias from its ARN.
   */
  static fromAliasArn(scope: Construct, id: string, aliasArn: string): IAlias {
    return this.fromAliasAttributes(scope, id, { aliasArn: aliasArn });
  }

  /**
   * Import an existing alias from its attributes.
   */
  static fromAliasAttributes(scope: Construct, id: string, attrs: AliasAttributes): IAlias {
    if (!attrs.aliasId && !attrs.aliasArn) {
      throw new Error('Either aliasId or aliasArn must be provided in AliasAttributes');
    }
    const aliasId = attrs.aliasId ??
      cdk.Stack.of(scope).splitArn(attrs.aliasArn!, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName;

    if (!aliasId) {
      throw new Error(`No alias identifier found in ARN: '${attrs.aliasArn}'`);
    }

    const aliasArn = attrs.aliasArn ?? cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'alias',
      resourceName: attrs.aliasId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
    class Import extends AliasBase {
      public readonly aliasId = aliasId!;
      public readonly aliasArn = aliasArn;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: aliasArn,
        });
      }
    }
    return new Import(scope, id);
  }

  /**
   * The Identifier of the alias.
   */
  public readonly aliasId: string;

  /**
    * The ARN of the alias.
    */
  public readonly aliasArn: string;

  /**
   * A fleet that the alias points to.
   */
  public readonly fleet?: IFleet;

  constructor(scope: Construct, id: string, props: AliasProps) {
    super(scope, id, {
      physicalName: props.aliasName,
    });

    if (!cdk.Token.isUnresolved(props.aliasName)) {
      if (props.aliasName.length > 1024) {
        throw new Error(`Alias name can not be longer than 1024 characters but has ${props.aliasName.length} characters.`);
      }
    }

    if (props.description && !cdk.Token.isUnresolved(props.description)) {
      if (props.description.length > 1024) {
        throw new Error(`Alias description can not be longer than 1024 characters but has ${props.description.length} characters.`);
      }
    }

    if (!props.terminalMessage && !props.fleet) {
      throw new Error('Either a terminal message or a fleet must be binded to this Alias.');
    }

    if (props.terminalMessage && props.fleet) {
      throw new Error('Either a terminal message or a fleet must be binded to this Alias, not both.');
    }

    const resource = new CfnAlias(this, 'Resource', {
      name: props.aliasName,
      description: props.description,
      routingStrategy: this.parseRoutingStrategy(props),
    });

    this.aliasId = this.getResourceNameAttribute(resource.ref);
    this.aliasArn = cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'alias',
      resourceName: this.aliasId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  private parseRoutingStrategy(props: AliasProps): CfnAlias.RoutingStrategyProperty {
    if (props.fleet ) {
      return {
        fleetId: props.fleet.fleetId,
        type: 'SIMPLE',
      };
    }
    return {
      message: props.terminalMessage,
      type: 'TERMINAL',
    };
  }
}

