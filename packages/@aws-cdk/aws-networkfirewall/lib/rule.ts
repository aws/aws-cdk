import { StatefulStandardAction, StatelessStandardAction } from './actions';
import { CfnRuleGroup } from './networkfirewall.generated';
import { castAddressProperty } from './private/rules-common';

/**
 * The interface that represents the values of a StatelessRule
 */
export interface IStatelessRule{}

/**
 * The base class of Stateless Rules
 */
abstract class StatelessRuleBase implements IStatelessRule {}

/**
 * Properties for defining a stateless rule
 */
export interface StatelessRuleProps {
  /**
   * Rule Actions
   *
   * The actions to take on a packet that matches one of the stateless rule definition's match attributes.
   */
  readonly actions: (StatelessStandardAction|string)[];

  /**
   * The destination port to inspect for.
   * You can specify an individual port, for example 1994 and you can specify a port range, for example 1990:1994.
   * To match with any port, specify ANY.
   *
   * @default - ANY
   */
  readonly destinationPorts?: CfnRuleGroup.PortRangeProperty[];

  /**
   * Specify an array of IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
   *
   * @default - ANY
   */
  readonly destinations?: string[];

  /**
   * The protocols to inspect for, specified using each protocol's assigned internet protocol number (IANA).
   *
   * @default - ANY
   */
  readonly protocols?: number[];

  /**
   * The source ports to inspect for.
   *
   * @default - ANY
   */
  readonly sourcePorts?: CfnRuleGroup.PortRangeProperty[];

  /**
   * Specify an array of IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
   *
   * @default - ANY
   */
  readonly sources?: string[];

  /**
   * TCP flags and masks to inspect packets for.
   *
   * @default - undefined
   */
  readonly tcpFlags?: CfnRuleGroup.TCPFlagFieldProperty[];
}

/**
 * Defines a Network Firewall Stateless Rule
 */
export class StatelessRule extends StatelessRuleBase {
  private readonly destinations: string[];
  private readonly destinationPorts: CfnRuleGroup.PortRangeProperty[];
  private readonly sources: string[];
  private readonly sourcePorts: CfnRuleGroup.PortRangeProperty[];
  private readonly protocols: number[];

  /**
   * The L1 Stateless Rule Property
   * @attribute
   */
  public resource: CfnRuleGroup.RuleDefinitionProperty;
  constructor( props: StatelessRuleProps) {
    super();

    // Adding Validations

    /**
     * Validating Actions
     */
    // Ensure only one standard action is provided.
    let standard_action_provided:boolean=false;
    let action:string;
    for (action of props.actions) {
      if (Object.values<string>(StatelessStandardAction).includes(action)) {
        if (standard_action_provided) {
          throw new Error('Only one standard action can be provided, all other actions must be custom');
        }
        standard_action_provided=true;
      }
    }

    /**
     * Saving to object for furture capacity calculations.
     * Capacity can't be calculated yes since props can be updated
     */
    this.destinations = props.destinations || [];
    this.destinationPorts = props.destinationPorts || [];
    this.sources = props.sources || [];
    this.sourcePorts = props.sourcePorts || [];
    this.protocols = props.protocols || [];

    const destinations:CfnRuleGroup.AddressProperty[] = castAddressProperty(props.destinations);

    const sources:CfnRuleGroup.AddressProperty[] = castAddressProperty(props.sources);

    const ruleMatchAttributes:CfnRuleGroup.MatchAttributesProperty = {
      destinationPorts: props.destinationPorts,
      destinations: destinations,
      sourcePorts: props.sourcePorts,
      sources: sources,
      protocols: props.protocols,
      tcpFlags: props.tcpFlags,
    };

    const ruleDefinition:CfnRuleGroup.RuleDefinitionProperty = {
      actions: props.actions,
      matchAttributes: ruleMatchAttributes,
    };

    this.resource = ruleDefinition;
  }

  /**
   * Calculate the address capacity requirements by number of address ranges.
   */
  private calculateAddressCapacity(locations:string[]|undefined):number {
    var capacity:number = 0;
    var cidrs:string;
    if (locations !== undefined) {
      for (cidrs of locations) {
        capacity += cidrs.split(',').length;
      }
    }
    // always return at least 1, for an undefined set meaning "ANY"
    return capacity || 1;
  }

  /**
   * Calculate Rule Capacity Reqirements.
   * https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-group-managing.html#nwfw-rule-group-capacity
   */
  public calculateCapacity():number {
    let capacity:number = 1;

    capacity *= this.calculateAddressCapacity(this.destinations);
    capacity *= this.destinationPorts.length || 1;
    capacity *= this.calculateAddressCapacity(this.sources);
    capacity *= this.sourcePorts.length || 1;
    capacity *= this.protocols.length || 1;
    return capacity;
  }
}

/**
 * The direction of traffic flow to inspect.
 */
export enum Stateful5TupleDirection {
  /**
   * Inspection matches bidirectional traffic, both from the source to the destination and from the destination to the source.
   */
  ANY = 'ANY',

  /**
   * Inspection only matches traffic going from the source to the destination.
   */
  FORWARD = 'FORWARD',
}

/**
 * The interface that represents the shared values of the StatefulRules
 */
export interface IStatefulRule {}

/**
 * The properties for defining a generic Stateful Rule
 */
export interface StatefulRuleBaseProps {}

/**
 * The shared base class of stateful rules.
 */
export abstract class StatefulRuleBase implements IStatefulRule {}

/**
 * Properties for defining a 5 Tuple rule
 */
export interface Stateful5TupleRuleProps extends StatefulRuleBaseProps {
  /**
   * The action to perform when a rule is matched.
   */
  readonly action: StatefulStandardAction|string;

  /**
   * The destination port to inspect for.
   * You can specify an individual port, for example 1994 and you can specify a port range, for example 1990:1994 .
   * To match with any port, specify ANY
   *
   * @default - ANY
   */
  readonly destinationPort?: string;

  /**
   * Specify an array of IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
   *
   * @default = ANY
   */
  readonly destination?: string;

  /**
   * The protocol to inspect for.
   * To specify all, you can use IP , because all traffic on AWS and on the internet is IP.
   *
   * @default - IP
   */
  readonly protocol?: string;

  /**
   * The source IP address or address range to inspect for, in CIDR notation.
   * To match with any address, specify ANY.
   *
   * @default - ANY
   */
  readonly sourcePort?: string;

  /**
   * Specify an array of IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation.
   *
   * @default = ANY
   */
  readonly source?: string;

  /**
   * Additional settings for a stateful rule, provided as keywords and setttings.
   *
   * @default - undefined
   */
  readonly ruleOptions?: CfnRuleGroup.RuleOptionProperty[];


  /**
   * The direction of traffic flow to inspect.
   * If set to ANY, the inspection matches bidirectional traffic, both from the source to the destination and from the destination to the source.
   * If set to FORWARD , the inspection only matches traffic going from the source to the destination.
   *
   * @default - ANY
   */
  readonly direction?: Stateful5TupleDirection | string;
}

/**
 * Generates a Stateful Rule from a 5 Tuple
 */
export class Stateful5TupleRule extends StatefulRuleBase {
  /**
   * The L1 Stateful Rule Property
   * @attribute
   */
  public resource:CfnRuleGroup.StatefulRuleProperty;

  constructor(props:Stateful5TupleRuleProps) {
    super();
    const protocol:string = props.protocol || 'IP';
    const destination:string = props.destination || 'ANY';
    const destinationPort:string = props.destinationPort || 'ANY';
    const source:string = props.source || 'ANY';
    const sourcePort:string = props.sourcePort || 'ANY';
    const direction:string = props.direction || Stateful5TupleDirection.ANY;

    const resourceHeader:CfnRuleGroup.HeaderProperty = {
      destination: destination,
      destinationPort: destinationPort,
      source: source,
      sourcePort: sourcePort,
      protocol: protocol,
      direction: direction,
    };

    const resourceOptions:CfnRuleGroup.RuleOptionProperty[] = props.ruleOptions || [];

    const resource:CfnRuleGroup.StatefulRuleProperty = {
      action: props.action,
      header: resourceHeader,
      ruleOptions: resourceOptions,
    };
    this.resource = resource;
  }
}

/**
 * The type of domain list to generate
 */
export enum StatefulDomainListType{
  /**
   * Deny domain(s) through
   */
  DENYLIST='DENYLIST',

  /**
   * Allow domain(s) through
   */
  ALLOWLIST='ALLOWLIST',
}

/**
 * The types of targets to inspect for.
 *  You can inspect HTTP or HTTPS protocols, or both.
 */
export enum StatefulDomainListTargetType{
  /**
   * Target HTTPS traffic
   * For HTTPS traffic, Network Firewall uses the Server Name Indication (SNI) extension in the TLS handshake to determine the hostname, or domain name, that the client is trying to connect to
   */
  TLS_SNI='TLS_SNI',

  /**
   * Target HTTP traffic
   */
  HTTP_HOST='HTTP_HOST',
}

/**
 * The properties for defining a Stateful Domain List Rule
 */
export interface StatefulDomainListRuleProps extends StatefulRuleBaseProps {
  /**
   * Whether you want to allow or deny access to the domains in your target list.
   */
  readonly type: StatefulDomainListType | string;

  /**
   * The domains that you want to inspect for in your traffic flows.
   */
  readonly targets: string[];

  /**
   * The types of targets to inspect for.
   */
  readonly targetTypes: (StatefulDomainListTargetType | string)[];
}

/**
 * Generates a Statful Rule from a Domain List
 */
export class StatefulDomainListRule extends StatefulRuleBase {
  /**
   * The L1 Stateful Rule Property
   * @attribute
   */
  public resource:CfnRuleGroup.RulesSourceListProperty;
  constructor(props:StatefulDomainListRuleProps) {
    super();
    const resource:CfnRuleGroup.RulesSourceListProperty = {
      generatedRulesType: props.type,
      targets: props.targets,
      targetTypes: props.targetTypes,
    };

    this.resource = resource;
  }
}
