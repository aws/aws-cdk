import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { Annotations, ContextProvider, IResource, Lazy, Resource, Token } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { IListenerAction } from './listener-action';
import { mapTagMapToCxschema } from './util';
import { CfnListener } from '../elasticloadbalancingv2.generated';

/**
 * Options for listener lookup
 */
export interface BaseListenerLookupOptions {
  /**
   * Filter listeners by associated load balancer arn
   * @default - does not filter by load balancer arn
   */
  readonly loadBalancerArn?: string;

  /**
   * Filter listeners by associated load balancer tags
   * @default - does not filter by load balancer tags
   */
  readonly loadBalancerTags?: Record<string, string>;

  /**
   * Filter listeners by listener port
   * @default - does not filter by listener port
   */
  readonly listenerPort?: number;
}

/**
 * Options for querying the load balancer listener context provider
 * @internal
 */
export interface ListenerQueryContextProviderOptions {
  /**
   * User's provided options
   */
  readonly userOptions: BaseListenerLookupOptions;

  /**
   * Type of load balancer expected
   */
  readonly loadBalancerType: cxschema.LoadBalancerType;

  /**
   * ARN of the listener to look up
   * @default - does not filter by listener arn
   */
  readonly listenerArn?: string;

  /**
   * Optional protocol of the listener to look up
   */
  readonly listenerProtocol?: cxschema.LoadBalancerListenerProtocol;
}

/**
 * Base interface for listeners
 */
export interface IListener extends IResource {
  /**
   * ARN of the listener
   * @attribute
   */
  readonly listenerArn: string;
}

/**
 * Base class for listeners
 */
export abstract class BaseListener extends Resource implements IListener {
  /**
   * Queries the load balancer listener context provider for load balancer
   * listener info.
   * @internal
   */
  protected static _queryContextProvider(scope: Construct, options: ListenerQueryContextProviderOptions) {
    if (Token.isUnresolved(options.userOptions.loadBalancerArn)
      || Object.values(options.userOptions.loadBalancerTags ?? {}).some(Token.isUnresolved)
      || Token.isUnresolved(options.userOptions.listenerPort)) {
      throw new Error('All arguments to look up a load balancer listener must be concrete (no Tokens)');
    }

    let cxschemaTags: cxschema.Tag[] | undefined;
    if (options.userOptions.loadBalancerTags) {
      cxschemaTags = mapTagMapToCxschema(options.userOptions.loadBalancerTags);
    }

    const props: cxapi.LoadBalancerListenerContextResponse = ContextProvider.getValue(scope, {
      provider: cxschema.ContextProvider.LOAD_BALANCER_LISTENER_PROVIDER,
      props: {
        listenerArn: options.listenerArn,
        listenerPort: options.userOptions.listenerPort,
        listenerProtocol: options.listenerProtocol,
        loadBalancerArn: options.userOptions.loadBalancerArn,
        loadBalancerTags: cxschemaTags,
        loadBalancerType: options.loadBalancerType,
      } as cxschema.LoadBalancerListenerContextQuery,
      dummyValue: {
        listenerArn: `arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/${options.loadBalancerType}/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2`,
        listenerPort: 80,
        securityGroupIds: ['sg-123456789012'],
      } as cxapi.LoadBalancerListenerContextResponse,
    }).value;

    return props;
  }
  /**
   * @attribute
   */
  public readonly listenerArn: string;

  private defaultAction?: IListenerAction;

  constructor(scope: Construct, id: string, additionalProps: any) {
    super(scope, id);

    const resource = new CfnListener(this, 'Resource', {
      ...additionalProps,
      defaultActions: Lazy.any({ produce: () => this.defaultAction?.renderActions() ?? [] }),
    });

    this.listenerArn = resource.ref;
    this.node.addValidation({ validate: () => this.validateListener() });
  }

  /**
   * Validate this listener
   */
  protected validateListener(): string[] {
    if (!this.defaultAction) {
      return ['Listener needs at least one default action or target group (call addTargetGroups or addAction)'];
    }
    return [];
  }

  /**
   * Configure the default action
   *
   * @internal
   */
  protected _setDefaultAction(action: IListenerAction) {
    // It might make sense to 'throw' here.
    //
    // However, programs may already exist out there which configured an action twice,
    // in which case the second action accidentally overwrite the initial action, and in some
    // way ended up with a program that did what the author intended. If we were to add throw now,
    // the previously working program would be broken.
    //
    // Instead, signal this through a warning.
    // @deprecate: upon the next major version bump, replace this with a `throw`
    if (this.defaultAction) {
      Annotations.of(this).addWarning('A default Action already existed on this Listener and was replaced. Configure exactly one default Action.');
    }

    this.defaultAction = action;
  }
}
