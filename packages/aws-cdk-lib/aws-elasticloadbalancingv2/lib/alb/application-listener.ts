import { Construct } from 'constructs';
import { ListenerAction } from './application-listener-action';
import { ApplicationListenerCertificate } from './application-listener-certificate';
import { ApplicationListenerRule, FixedResponse, RedirectResponse } from './application-listener-rule';
import { IApplicationLoadBalancer } from './application-load-balancer';
import { ApplicationTargetGroup, IApplicationLoadBalancerTarget, IApplicationTargetGroup } from './application-target-group';
import { ListenerCondition } from './conditions';
import { ITrustStore } from './trust-store';
import * as ec2 from '../../../aws-ec2';
import * as cxschema from '../../../cloud-assembly-schema';
import { Duration, FeatureFlags, Lazy, Resource, Token } from '../../../core';
import { ValidationError } from '../../../core/lib/errors';
import { addConstructMetadata, MethodMetadata } from '../../../core/lib/metadata-resource';
import * as cxapi from '../../../cx-api';
import { BaseListener, BaseListenerLookupOptions, IListener } from '../shared/base-listener';
import { HealthCheck } from '../shared/base-target-group';
import { ApplicationProtocol, ApplicationProtocolVersion, TargetGroupLoadBalancingAlgorithmType, IpAddressType, SslPolicy } from '../shared/enums';
import { IListenerCertificate, ListenerCertificate } from '../shared/listener-certificate';
import { determineProtocolAndPort } from '../shared/util';

/**
 * Basic properties for an ApplicationListener
 */
export interface BaseApplicationListenerProps {
  /**
   * The protocol to use
   *
   * @default - Determined from port if known.
   */
  readonly protocol?: ApplicationProtocol;

  /**
   * The port on which the listener listens for requests.
   *
   * @default - Determined from protocol if known.
   */
  readonly port?: number;

  /**
   * The certificates to use on this listener
   *
   * @default - No certificates.
   * @deprecated Use the `certificates` property instead
   */
  readonly certificateArns?: string[];

  /**
   * Certificate list of ACM cert ARNs. You must provide exactly one certificate if the listener protocol is HTTPS or TLS.
   *
   * @default - No certificates.
   */
  readonly certificates?: IListenerCertificate[];

  /**
   * The security policy that defines which ciphers and protocols are supported.
   *
   * @default - The current predefined security policy.
   */
  readonly sslPolicy?: SslPolicy;

  /**
   * Default target groups to load balance to
   *
   * All target groups will be load balanced to with equal weight and without
   * stickiness. For a more complex configuration than that, use
   * either `defaultAction` or `addAction()`.
   *
   * Cannot be specified together with `defaultAction`.
   *
   * @default - None.
   */
  readonly defaultTargetGroups?: IApplicationTargetGroup[];

  /**
   * Default action to take for requests to this listener
   *
   * This allows full control of the default action of the load balancer,
   * including Action chaining, fixed responses and redirect responses.
   *
   * See the `ListenerAction` class for all options.
   *
   * Cannot be specified together with `defaultTargetGroups`.
   *
   * @default - None.
   */
  readonly defaultAction?: ListenerAction;

  /**
   * Allow anyone to connect to the load balancer on the listener port
   *
   * If this is specified, the load balancer will be opened up to anyone who can reach it.
   * For internal load balancers this is anyone in the same VPC. For public load
   * balancers, this is anyone on the internet.
   *
   * If you want to be more selective about who can access this load
   * balancer, set this to `false` and use the listener's `connections`
   * object to selectively grant access to the load balancer on the listener port.
   *
   * @default true
   */
  readonly open?: boolean;

  /**
   * The mutual authentication configuration information
   *
   * @default - No mutual authentication configuration
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/mutual-authentication.html
   */
  readonly mutualAuthentication?: MutualAuthentication;
}

/**
 * The mutual authentication configuration information
 *
 */
export interface MutualAuthentication {
  /**
   * The client certificate handling method
   *
   * @default MutualAuthenticationMode.OFF
   */
  readonly mutualAuthenticationMode?: MutualAuthenticationMode;

  /**
   * The trust store
   *
   * Cannot be used with MutualAuthenticationMode.OFF or MutualAuthenticationMode.PASS_THROUGH
   *
   * @default - no trust store
   */
  readonly trustStore?: ITrustStore;

  /**
   * Indicates whether expired client certificates are ignored
   *
   * Cannot be used with MutualAuthenticationMode.OFF or MutualAuthenticationMode.PASS_THROUGH
   *
   * @default false
   */
  readonly ignoreClientCertificateExpiry?: boolean;

  /**
   * Indicates whether trust store CA names are advertised
   *
   * @default false
   */
  readonly advertiseTrustStoreCaNames?: boolean;
}

/**
 * The client certificate handling method
 */
export enum MutualAuthenticationMode {
  /**
   * Off
   */
  OFF = 'off',

  /**
   * Application Load Balancer sends the whole client certificate chain to the target using HTTP headers
   */
  PASS_THROUGH = 'passthrough',

  /**
   * Application Load Balancer performs X.509 client certificate authentication for clients when a load balancer negotiates TLS connections
   */
  VERIFY = 'verify',
}

/**
 * Properties for defining a standalone ApplicationListener
 */
export interface ApplicationListenerProps extends BaseApplicationListenerProps {
  /**
   * The load balancer to attach this listener to
   */
  readonly loadBalancer: IApplicationLoadBalancer;
}

/**
 * Options for ApplicationListener lookup
 */
export interface ApplicationListenerLookupOptions extends BaseListenerLookupOptions {
  /**
   * ARN of the listener to look up
   * @default - does not filter by listener arn
   */
  readonly listenerArn?: string;

  /**
   * Filter listeners by listener protocol
   * @default - does not filter by listener protocol
   */
  readonly listenerProtocol?: ApplicationProtocol;
}

/**
 * Define an ApplicationListener
 *
 * @resource AWS::ElasticLoadBalancingV2::Listener
 */
export class ApplicationListener extends BaseListener implements IApplicationListener {
  /**
   * Look up an ApplicationListener.
   */
  public static fromLookup(scope: Construct, id: string, options: ApplicationListenerLookupOptions): IApplicationListener {
    if (Token.isUnresolved(options.listenerArn)) {
      throw new ValidationError('All arguments to look up a load balancer listener must be concrete (no Tokens)', scope);
    }

    let listenerProtocol: cxschema.LoadBalancerListenerProtocol | undefined;
    switch (options.listenerProtocol) {
      case ApplicationProtocol.HTTP: listenerProtocol = cxschema.LoadBalancerListenerProtocol.HTTP; break;
      case ApplicationProtocol.HTTPS: listenerProtocol = cxschema.LoadBalancerListenerProtocol.HTTPS; break;
    }

    const props = BaseListener._queryContextProvider(scope, {
      userOptions: options,
      loadBalancerType: cxschema.LoadBalancerType.APPLICATION,
      listenerArn: options.listenerArn,
      listenerProtocol,
    });

    return new LookedUpApplicationListener(scope, id, props);
  }

  /**
   * Import an existing listener
   */
  public static fromApplicationListenerAttributes(scope: Construct, id: string, attrs: ApplicationListenerAttributes): IApplicationListener {
    return new ImportedApplicationListener(scope, id, attrs);
  }

  /**
   * Manage connections to this ApplicationListener
   */
  public readonly connections: ec2.Connections;

  /**
   * Load balancer this listener is associated with
   */
  public readonly loadBalancer: IApplicationLoadBalancer;

  /**
   * The port of the listener.
   */
  public readonly port: number;

  /**
   * ARNs of certificates added to this listener
   */
  private readonly certificateArns: string[];

  /**
   * Listener protocol for this listener.
   */
  private readonly protocol: ApplicationProtocol;

  constructor(scope: Construct, id: string, props: ApplicationListenerProps) {
    const [protocol, port] = determineProtocolAndPort(props.protocol, props.port);
    if (protocol === undefined || port === undefined) {
      throw new ValidationError('At least one of \'port\' or \'protocol\' is required', scope);
    }

    validateMutualAuthentication(scope, props.mutualAuthentication);

    let advertiseTrustStoreCaNames: string | undefined;
    if (props.mutualAuthentication?.advertiseTrustStoreCaNames !== undefined) {
      advertiseTrustStoreCaNames = props.mutualAuthentication.advertiseTrustStoreCaNames ? 'on' : 'off';
    }

    super(scope, id, {
      loadBalancerArn: props.loadBalancer.loadBalancerArn,
      certificates: Lazy.any({ produce: () => this.certificateArns.map(certificateArn => ({ certificateArn })) }, { omitEmptyArray: true }),
      protocol,
      port,
      sslPolicy: props.sslPolicy,
      mutualAuthentication: props.mutualAuthentication ? {
        advertiseTrustStoreCaNames,
        ignoreClientCertificateExpiry: props.mutualAuthentication?.ignoreClientCertificateExpiry,
        mode: props.mutualAuthentication?.mutualAuthenticationMode,
        trustStoreArn: props.mutualAuthentication?.trustStore?.trustStoreArn,
      } : undefined,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.loadBalancer = props.loadBalancer;
    this.protocol = protocol;
    this.port = port;
    this.certificateArns = [];

    // Attach certificates
    if (props.certificateArns && props.certificateArns.length > 0) {
      this.addCertificateArns('ListenerCertificate', props.certificateArns);
    }
    if (props.certificates && props.certificates.length > 0) {
      this.addCertificates('DefaultCertificates', props.certificates);
    }

    // This listener edits the securitygroup of the load balancer,
    // but adds its own default port.
    this.connections = new ec2.Connections({
      securityGroups: props.loadBalancer.connections.securityGroups,
      defaultPort: ec2.Port.tcp(port),
    });

    if (props.defaultAction && props.defaultTargetGroups) {
      throw new ValidationError('Specify at most one of \'defaultAction\' and \'defaultTargetGroups\'', this);
    }

    if (props.defaultAction) {
      this.setDefaultAction(props.defaultAction);
    }

    if (props.defaultTargetGroups) {
      this.setDefaultAction(ListenerAction.forward(props.defaultTargetGroups));
    }

    if (props.open !== false) {
      this.connections.allowDefaultPortFrom(ec2.Peer.anyIpv4(), `Allow from anyone on port ${port}`);
      if (this.loadBalancer.ipAddressType === IpAddressType.DUAL_STACK ||
        (this.loadBalancer.ipAddressType === IpAddressType.DUAL_STACK_WITHOUT_PUBLIC_IPV4 &&
          FeatureFlags.of(this).isEnabled(cxapi.ALB_DUALSTACK_WITHOUT_PUBLIC_IPV4_SECURITY_GROUP_RULES_DEFAULT))) {
        this.connections.allowDefaultPortFrom(ec2.Peer.anyIpv6(), `Allow from anyone on port ${port}`);
      }
    }
  }

  /**
   * Add one or more certificates to this listener.
   *
   * After the first certificate, this creates ApplicationListenerCertificates
   * resources since cloudformation requires the certificates array on the
   * listener resource to have a length of 1.
   *
   * @deprecated Use `addCertificates` instead.
   */
  @MethodMetadata()
  public addCertificateArns(id: string, arns: string[]): void {
    this.addCertificates(id, arns.map(ListenerCertificate.fromArn));
  }

  /**
   * Add one or more certificates to this listener.
   *
   * After the first certificate, this creates ApplicationListenerCertificates
   * resources since cloudformation requires the certificates array on the
   * listener resource to have a length of 1.
   */
  @MethodMetadata()
  public addCertificates(id: string, certificates: IListenerCertificate[]): void {
    const additionalCerts = [...certificates];

    if (this.certificateArns.length === 0 && additionalCerts.length > 0) {
      const first = additionalCerts.splice(0, 1)[0];
      this.certificateArns.push(first.certificateArn);
    }

    // Only one certificate can be specified per resource, even though
    // `certificates` is of type Array
    for (let i = 0; i < additionalCerts.length; i++) {
      new ApplicationListenerCertificate(this, `${id}${i + 1}`, {
        listener: this,
        certificates: [additionalCerts[i]],
      });
    }
  }

  /**
   * Perform the given default action on incoming requests
   *
   * This allows full control of the default action of the load balancer,
   * including Action chaining, fixed responses and redirect responses. See
   * the `ListenerAction` class for all options.
   *
   * It's possible to add routing conditions to the Action added in this way.
   * At least one Action must be added without conditions (which becomes the
   * default Action).
   */
  @MethodMetadata()
  public addAction(id: string, props: AddApplicationActionProps): void {
    checkAddRuleProps(this, props);

    if (props.priority !== undefined) {
      // New rule
      //
      // TargetGroup.registerListener is called inside ApplicationListenerRule.
      new ApplicationListenerRule(this, id + 'Rule', {
        listener: this,
        priority: props.priority,
        ...props,
      });
    } else {
      // New default target with these targetgroups
      this.setDefaultAction(props.action);
    }
  }

  /**
   * Load balance incoming requests to the given target groups.
   *
   * All target groups will be load balanced to with equal weight and without
   * stickiness. For a more complex configuration than that, use `addAction()`.
   *
   * It's possible to add routing conditions to the TargetGroups added in this
   * way. At least one TargetGroup must be added without conditions (which will
   * become the default Action for this listener).
   */
  @MethodMetadata()
  public addTargetGroups(id: string, props: AddApplicationTargetGroupsProps): void {
    checkAddRuleProps(this, props);

    if (props.priority !== undefined) {
      // New rule
      //
      // TargetGroup.registerListener is called inside ApplicationListenerRule.
      new ApplicationListenerRule(this, id + 'Rule', {
        listener: this,
        priority: props.priority,
        ...props,
      });
    } else {
      // New default target with these targetgroups
      this.setDefaultAction(ListenerAction.forward(props.targetGroups));
    }
  }

  /**
   * Load balance incoming requests to the given load balancing targets.
   *
   * This method implicitly creates an ApplicationTargetGroup for the targets
   * involved, and a 'forward' action to route traffic to the given TargetGroup.
   *
   * If you want more control over the precise setup, create the TargetGroup
   * and use `addAction` yourself.
   *
   * It's possible to add conditions to the targets added in this way. At least
   * one set of targets must be added without conditions.
   *
   * @returns The newly created target group
   */
  @MethodMetadata()
  public addTargets(id: string, props: AddApplicationTargetsProps): ApplicationTargetGroup {
    if (!this.loadBalancer.vpc) {
      // eslint-disable-next-line max-len
      throw new ValidationError('Can only call addTargets() when using a constructed Load Balancer or an imported Load Balancer with specified vpc; construct a new TargetGroup and use addTargetGroup', this);
    }

    const group = new ApplicationTargetGroup(this, id + 'Group', {
      vpc: this.loadBalancer.vpc,
      ...props,
    });

    this.addTargetGroups(id, {
      targetGroups: [group],
      ...props,
    });

    return group;
  }

  /**
   * Add a fixed response
   *
   * @deprecated Use `addAction()` instead
   */
  @MethodMetadata()
  public addFixedResponse(id: string, props: AddFixedResponseProps) {
    checkAddRuleProps(this, props);

    const fixedResponse: FixedResponse = {
      statusCode: props.statusCode,
      contentType: props.contentType,
      messageBody: props.messageBody,
    };

    /**
     * NOTE - Copy/pasted from `application-listener-rule.ts#validateFixedResponse`.
     * This was previously a deprecated, exported function, which caused issues with jsii's strip-deprecated functionality.
     * Inlining the duplication functionality in v2 only (for now).
     */
    if (fixedResponse.statusCode && !/^(2|4|5)\d\d$/.test(fixedResponse.statusCode)) {
      throw new ValidationError('`statusCode` must be 2XX, 4XX or 5XX.', this);
    }

    if (fixedResponse.messageBody && fixedResponse.messageBody.length > 1024) {
      throw new ValidationError('`messageBody` cannot have more than 1024 characters.', this);
    }

    if (props.priority) {
      new ApplicationListenerRule(this, id + 'Rule', {
        listener: this,
        priority: props.priority,
        fixedResponse,
        ...props,
      });
    } else {
      this.setDefaultAction(ListenerAction.fixedResponse(Token.asNumber(props.statusCode), {
        contentType: props.contentType,
        messageBody: props.messageBody,
      }));
    }
  }

  /**
   * Add a redirect response
   *
   * @deprecated Use `addAction()` instead
   */
  @MethodMetadata()
  public addRedirectResponse(id: string, props: AddRedirectResponseProps) {
    checkAddRuleProps(this, props);
    const redirectResponse = {
      host: props.host,
      path: props.path,
      port: props.port,
      protocol: props.protocol,
      query: props.query,
      statusCode: props.statusCode,
    };

    /**
     * NOTE - Copy/pasted from `application-listener-rule.ts#validateRedirectResponse`.
     * This was previously a deprecated, exported function, which caused issues with jsii's strip-deprecated functionality.
     * Inlining the duplication functionality in v2 only (for now).
     */
    if (redirectResponse.protocol && !/^(HTTPS?|#\{protocol\})$/i.test(redirectResponse.protocol)) {
      throw new ValidationError('`protocol` must be HTTP, HTTPS, or #{protocol}.', this);
    }

    if (!redirectResponse.statusCode || !/^HTTP_30[12]$/.test(redirectResponse.statusCode)) {
      throw new ValidationError('`statusCode` must be HTTP_301 or HTTP_302.', this);
    }

    if (props.priority) {
      new ApplicationListenerRule(this, id + 'Rule', {
        listener: this,
        priority: props.priority,
        redirectResponse,
        ...props,
      });
    } else {
      this.setDefaultAction(ListenerAction.redirect({
        host: props.host,
        path: props.path,
        port: props.port,
        protocol: props.protocol,
        query: props.query,
        permanent: props.statusCode === 'HTTP_301',
      }));
    }
  }

  /**
   * Register that a connectable that has been added to this load balancer.
   *
   * Don't call this directly. It is called by ApplicationTargetGroup.
   */
  @MethodMetadata()
  public registerConnectable(connectable: ec2.IConnectable, portRange: ec2.Port): void {
    connectable.connections.allowFrom(this.loadBalancer, portRange, 'Load balancer to target');
  }

  /**
   * Validate this listener.
   */
  protected validateListener(): string[] {
    const errors = super.validateListener();
    if (this.protocol === ApplicationProtocol.HTTPS && this.certificateArns.length === 0) {
      errors.push('HTTPS Listener needs at least one certificate (call addCertificates)');
    }
    return errors;
  }

  /**
   * Wrapper for _setDefaultAction which does a type-safe bind
   */
  private setDefaultAction(action: ListenerAction) {
    action.bind(this, this);
    this._setDefaultAction(action);
  }
}

/**
 * Properties to reference an existing listener
 */
export interface IApplicationListener extends IListener, ec2.IConnectable {
  /**
   * Add one or more certificates to this listener.
   * @deprecated use `addCertificates()`
   */
  addCertificateArns(id: string, arns: string[]): void;

  /**
   * Add one or more certificates to this listener.
   */
  addCertificates(id: string, certificates: IListenerCertificate[]): void;

  /**
   * Load balance incoming requests to the given target groups.
   *
   * It's possible to add conditions to the TargetGroups added in this way.
   * At least one TargetGroup must be added without conditions.
   */
  addTargetGroups(id: string, props: AddApplicationTargetGroupsProps): void;

  /**
   * Load balance incoming requests to the given load balancing targets.
   *
   * This method implicitly creates an ApplicationTargetGroup for the targets
   * involved.
   *
   * It's possible to add conditions to the targets added in this way. At least
   * one set of targets must be added without conditions.
   *
   * @returns The newly created target group
   */
  addTargets(id: string, props: AddApplicationTargetsProps): ApplicationTargetGroup;

  /**
   * Register that a connectable that has been added to this load balancer.
   *
   * Don't call this directly. It is called by ApplicationTargetGroup.
   */
  registerConnectable(connectable: ec2.IConnectable, portRange: ec2.Port): void;

  /**
   * Perform the given action on incoming requests
   *
   * This allows full control of the default action of the load balancer,
   * including Action chaining, fixed responses and redirect responses. See
   * the `ListenerAction` class for all options.
   *
   * It's possible to add routing conditions to the Action added in this way.
   *
   * It is not possible to add a default action to an imported IApplicationListener.
   * In order to add actions to an imported IApplicationListener a `priority`
   * must be provided.
   */
  addAction(id: string, props: AddApplicationActionProps): void;
}

/**
 * Properties to reference an existing listener
 */
export interface ApplicationListenerAttributes {
  /**
   * ARN of the listener
   */
  readonly listenerArn: string;

  /**
   * Security group of the load balancer this listener is associated with
   */
  readonly securityGroup: ec2.ISecurityGroup;

  /**
   * The default port on which this listener is listening
   */
  readonly defaultPort?: number;

  /**
   * Whether the imported security group allows all outbound traffic or not when
   * imported using `securityGroupId`
   *
   * Unless set to `false`, no egress rules will be added to the security group.
   *
   * @default true
   *
   * @deprecated use `securityGroup` instead
   */
  readonly securityGroupAllowsAllOutbound?: boolean;
}

abstract class ExternalApplicationListener extends Resource implements IApplicationListener {
  /**
   * Connections object.
   */
  public abstract readonly connections: ec2.Connections;

  /**
   * ARN of the listener
   */
  public abstract readonly listenerArn: string;

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  /**
   * Register that a connectable that has been added to this load balancer.
   *
   * Don't call this directly. It is called by ApplicationTargetGroup.
   */
  public registerConnectable(connectable: ec2.IConnectable, portRange: ec2.Port): void {
    this.connections.allowTo(connectable, portRange, 'Load balancer to target');
  }

  /**
   * Add one or more certificates to this listener.
   * @deprecated use `addCertificates()`
   */
  public addCertificateArns(id: string, arns: string[]): void {
    this.addCertificates(id, arns.map(ListenerCertificate.fromArn));
  }

  /**
   * Add one or more certificates to this listener.
   */
  public addCertificates(id: string, certificates: IListenerCertificate[]): void {
    new ApplicationListenerCertificate(this, id, {
      listener: this,
      certificates,
    });
  }

  /**
   * Load balance incoming requests to the given target groups.
   *
   * It's possible to add conditions to the TargetGroups added in this way.
   * At least one TargetGroup must be added without conditions.
   */
  public addTargetGroups(id: string, props: AddApplicationTargetGroupsProps): void {
    checkAddRuleProps(this, props);

    if (props.priority !== undefined) {
      // New rule
      new ApplicationListenerRule(this, id, {
        listener: this,
        priority: props.priority,
        ...props,
      });
    } else {
      throw new ValidationError('Cannot add default Target Groups to imported ApplicationListener', this);
    }
  }

  /**
   * Load balance incoming requests to the given load balancing targets.
   *
   * This method implicitly creates an ApplicationTargetGroup for the targets
   * involved.
   *
   * It's possible to add conditions to the targets added in this way. At least
   * one set of targets must be added without conditions.
   *
   * @returns The newly created target group
   */
  public addTargets(_id: string, _props: AddApplicationTargetsProps): ApplicationTargetGroup {
    // eslint-disable-next-line max-len
    throw new ValidationError('Can only call addTargets() when using a constructed ApplicationListener; construct a new TargetGroup and use addTargetGroup.', this);
  }

  /**
   * Perform the given action on incoming requests
   *
   * This allows full control of the default action of the load balancer,
   * including Action chaining, fixed responses and redirect responses. See
   * the `ListenerAction` class for all options.
   *
   * It's possible to add routing conditions to the Action added in this way.
   *
   * It is not possible to add a default action to an imported IApplicationListener.
   * In order to add actions to an imported IApplicationListener a `priority`
   * must be provided.
   *
   * If you previously deployed a `ListenerRule` using the `addTargetGroups()` method
   * and need to migrate to using the more feature rich `addAction()`
   * method, then you will need to set the `removeRuleSuffixFromLogicalId: true`
   * property here to avoid having CloudFormation attempt to replace your resource.
   */
  public addAction(id: string, props: AddApplicationActionProps): void {
    checkAddRuleProps(this, props);

    if (props.priority !== undefined) {
      const ruleId = props.removeSuffix ? id : id + 'Rule';
      // New rule
      //
      // TargetGroup.registerListener is called inside ApplicationListenerRule.
      new ApplicationListenerRule(this, ruleId, {
        listener: this,
        priority: props.priority,
        ...props,
      });
    } else {
      throw new ValidationError('priority must be set for actions added to an imported listener', this);
    }
  }
}

/**
 * An imported application listener.
 */
class ImportedApplicationListener extends ExternalApplicationListener {
  public readonly listenerArn: string;
  public readonly connections: ec2.Connections;

  constructor(scope: Construct, id: string, props: ApplicationListenerAttributes) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.listenerArn = props.listenerArn;
    const defaultPort = props.defaultPort !== undefined ? ec2.Port.tcp(props.defaultPort) : undefined;

    this.connections = new ec2.Connections({
      securityGroups: [props.securityGroup],
      defaultPort,
    });
  }
}

class LookedUpApplicationListener extends ExternalApplicationListener {
  public readonly listenerArn: string;
  public readonly connections: ec2.Connections;

  constructor(scope: Construct, id: string, props: cxapi.LoadBalancerListenerContextResponse) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.listenerArn = props.listenerArn;
    this.connections = new ec2.Connections({
      defaultPort: ec2.Port.tcp(props.listenerPort),
    });

    for (const securityGroupId of props.securityGroupIds) {
      const securityGroup = ec2.SecurityGroup.fromLookupById(this, `SecurityGroup-${securityGroupId}`, securityGroupId);
      this.connections.addSecurityGroup(securityGroup);
    }
  }
}

/**
 * Properties for adding a conditional load balancing rule
 */
export interface AddRuleProps {
  /**
   * Priority of this target group
   *
   * The rule with the lowest priority will be used for every request.
   * If priority is not given, these target groups will be added as
   * defaults, and must not have conditions.
   *
   * Priorities must be unique.
   *
   * @default Target groups are used as defaults
   */
  readonly priority?: number;

  /**
   * Rule applies if matches the conditions.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html
   *
   * @default - No conditions.
   */
  readonly conditions?: ListenerCondition[];

  /**
   * Rule applies if the requested host matches the indicated host
   *
   * May contain up to three '*' wildcards.
   *
   * Requires that priority is set.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#host-conditions
   *
   * @default No host condition
   * @deprecated Use `conditions` instead.
   */
  readonly hostHeader?: string;

  /**
   * Rule applies if the requested path matches the given path pattern
   *
   * May contain up to three '*' wildcards.
   *
   * Requires that priority is set.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
   * @default No path condition
   * @deprecated Use `conditions` instead.
   */
  readonly pathPattern?: string;

  /**
   * Rule applies if the requested path matches any of the given patterns.
   *
   * May contain up to three '*' wildcards.
   *
   * Requires that priority is set.
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#path-conditions
   * @default - No path condition.
   * @deprecated Use `conditions` instead.
   */
  readonly pathPatterns?: string[];
}

/**
 * Properties for adding a new target group to a listener
 */
export interface AddApplicationTargetGroupsProps extends AddRuleProps {
  /**
   * Target groups to forward requests to
   */
  readonly targetGroups: IApplicationTargetGroup[];
}

/**
 * Properties for adding a new action to a listener
 */
export interface AddApplicationActionProps extends AddRuleProps {
  /**
   * Action to perform
   */
  readonly action: ListenerAction;
  /**
   * `ListenerRule`s have a `Rule` suffix on their logicalId by default. This allows you to remove that suffix.
   *
   * Legacy behavior of the `addTargetGroups()` convenience method did not include the `Rule` suffix on the logicalId of the generated `ListenerRule`.
   * At some point, increasing complexity of requirements can require users to switch from the `addTargetGroups()` method
   * to the `addAction()` method.
   * When migrating `ListenerRule`s deployed by a legacy version of `addTargetGroups()`,
   * you will need to enable this flag to avoid changing the logicalId of your resource.
   * Otherwise Cfn will attempt to replace the `ListenerRule` and fail.
   *
   * @default - use standard logicalId with the `Rule` suffix
   */
  readonly removeSuffix?: boolean;
}

/**
 * Properties for adding new targets to a listener
 */
export interface AddApplicationTargetsProps extends AddRuleProps {
  /**
   * The protocol to use
   *
   * @default Determined from port if known
   */
  readonly protocol?: ApplicationProtocol;

  /**
   * The protocol version to use
   *
   * @default ApplicationProtocolVersion.HTTP1
   */
  readonly protocolVersion?: ApplicationProtocolVersion;

  /**
   * The port on which the listener listens for requests.
   *
   * @default Determined from protocol if known
   */
  readonly port?: number;

  /**
   * The time period during which the load balancer sends a newly registered
   * target a linearly increasing share of the traffic to the target group.
   *
   * The range is 30-900 seconds (15 minutes).
   *
   * @default 0
   */
  readonly slowStart?: Duration;

  /**
   * The stickiness cookie expiration period.
   *
   * Setting this value enables load balancer stickiness.
   *
   * After this period, the cookie is considered stale. The minimum value is
   * 1 second and the maximum value is 7 days (604800 seconds).
   *
   * @default Stickiness disabled
   */
  readonly stickinessCookieDuration?: Duration;

  /**
   * The name of an application-based stickiness cookie.
   *
   * Names that start with the following prefixes are not allowed: AWSALB, AWSALBAPP,
   * and AWSALBTG; they're reserved for use by the load balancer.
   *
   * Note: `stickinessCookieName` parameter depends on the presence of `stickinessCookieDuration` parameter.
   * If `stickinessCookieDuration` is not set, `stickinessCookieName` will be omitted.
   *
   * @default - If `stickinessCookieDuration` is set, a load-balancer generated cookie is used. Otherwise, no stickiness is defined.
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/sticky-sessions.html
   */
  readonly stickinessCookieName?: string;

  /**
   * The targets to add to this target group.
   *
   * Can be `Instance`, `IPAddress`, or any self-registering load balancing
   * target. All target must be of the same type.
   */
  readonly targets?: IApplicationLoadBalancerTarget[];

  /**
   * The name of the target group.
   *
   * This name must be unique per region per account, can have a maximum of
   * 32 characters, must contain only alphanumeric characters or hyphens, and
   * must not begin or end with a hyphen.
   *
   * @default Automatically generated
   */
  readonly targetGroupName?: string;

  /**
   * The amount of time for Elastic Load Balancing to wait before deregistering a target.
   *
   * The range is 0-3600 seconds.
   *
   * @default Duration.minutes(5)
   */
  readonly deregistrationDelay?: Duration;

  /**
   * Health check configuration
   *
   * @default - The default value for each property in this configuration varies depending on the target.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticloadbalancingv2-targetgroup.html#aws-resource-elasticloadbalancingv2-targetgroup-properties
   */
  readonly healthCheck?: HealthCheck;

  /**
   * The load balancing algorithm to select targets for routing requests.
   *
   * @default round_robin.
   */
  readonly loadBalancingAlgorithmType?: TargetGroupLoadBalancingAlgorithmType;

  /**
   * Indicates whether anomaly mitigation is enabled.
   *
   * Only available when `loadBalancingAlgorithmType` is `TargetGroupLoadBalancingAlgorithmType.WEIGHTED_RANDOM`
   *
   * @default false
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html#automatic-target-weights
   */
  readonly enableAnomalyMitigation?: boolean;
}

/**
 * Properties for adding a fixed response to a listener
 *
 * @deprecated Use `ApplicationListener.addAction` instead.
 */
export interface AddFixedResponseProps extends AddRuleProps, FixedResponse {
}

/**
 * Properties for adding a redirect response to a listener
 *
 * @deprecated Use `ApplicationListener.addAction` instead.
 */
export interface AddRedirectResponseProps extends AddRuleProps, RedirectResponse {
}

function checkAddRuleProps(scope: Construct, props: AddRuleProps) {
  const conditionsCount = props.conditions?.length || 0;
  const hasAnyConditions = conditionsCount !== 0 ||
    props.hostHeader !== undefined || props.pathPattern !== undefined || props.pathPatterns !== undefined;
  const hasPriority = props.priority !== undefined;
  if (hasAnyConditions !== hasPriority) {
    throw new ValidationError('Setting \'conditions\', \'pathPattern\' or \'hostHeader\' also requires \'priority\', and vice versa', scope);
  }
}

function validateMutualAuthentication(scope: Construct, mutualAuthentication?: MutualAuthentication): void {
  if (!mutualAuthentication) {
    return;
  }

  const currentMode = mutualAuthentication.mutualAuthenticationMode;

  if (currentMode === MutualAuthenticationMode.VERIFY) {
    if (!mutualAuthentication.trustStore) {
      throw new ValidationError(`You must set 'trustStore' when 'mode' is '${MutualAuthenticationMode.VERIFY}'`, scope);
    }
  }

  if (currentMode === MutualAuthenticationMode.OFF || currentMode === MutualAuthenticationMode.PASS_THROUGH) {
    if (mutualAuthentication.trustStore) {
      throw new ValidationError(`You cannot set 'trustStore' when 'mode' is '${MutualAuthenticationMode.OFF}' or '${MutualAuthenticationMode.PASS_THROUGH}'`, scope);
    }

    if (mutualAuthentication.ignoreClientCertificateExpiry !== undefined) {
      throw new ValidationError(`You cannot set 'ignoreClientCertificateExpiry' when 'mode' is '${MutualAuthenticationMode.OFF}' or '${MutualAuthenticationMode.PASS_THROUGH}'`, scope);
    }

    if (mutualAuthentication.advertiseTrustStoreCaNames !== undefined) {
      throw new ValidationError(`You cannot set 'advertiseTrustStoreCaNames' when 'mode' is '${MutualAuthenticationMode.OFF}' or '${MutualAuthenticationMode.PASS_THROUGH}'`, scope);
    }
  }
}
