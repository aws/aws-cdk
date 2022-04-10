import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { StatelessStandardAction, StatefulStrictAction } from './actions';
import { CfnFirewallPolicy, CfnFirewallPolicyProps } from './networkfirewall.generated';
import { IStatefulRuleGroup, IStatelessRuleGroup } from './rule-group';

/**
 *  Maps a priority to a stateful rule group item
 */
export interface StatefulRuleGroupList {
  /**
   * The priority of the rule group in the policy
   */
  readonly priority: number;

  /**
   * The stateful rule
   */
  readonly ruleGroup: IStatefulRuleGroup;
}

/**
 * Maps a priority to a stateless rule group item
 */
export interface StatelessRuleGroupList {
  /**
   * The priority of the rule group in the policy
   */
  readonly priority: number;

  /**
   * The stateless rule
   */
  readonly ruleGroup: IStatelessRuleGroup;
}

/**
 * Defines a Network Firewall Policy in the stack
 */
export interface IFirewallPolicy extends core.IResource {
  /**
   * The Arn of the policy.
   *
   * @attribute
   */
  readonly firewallPolicyArn: string;

  /**
   * The phyiscal name of the firewall policy.
   *
   * @attribute
   */
  readonly firewallPolicyId: string;

}

abstract class FirewallPolicyBase extends core.Resource implements IFirewallPolicy {
  /**
   * The Arn of the policy.
   *
   * @attribute
   */
  public abstract readonly firewallPolicyArn: string;

  /**
   * The phyiscal name of the firewall policy.
   *
   * @attribute
   */
  public abstract readonly firewallPolicyId: string;
}

/**
 * The Properties for defining a Firewall policy
 */
export interface FirewallPolicyProps {
  /**
   * The descriptive name of the firewall policy.
   * You can't change the name of a firewall policy after you create it.
   *
   * @default - CloudFormation-generated name
   */
  readonly firewallPolicyName?: string;

  /**
   * The actions to take on a packet if it doesn't match any of the stateless rules in the policy.
   */
  readonly statelessDefaultActions: (StatelessStandardAction | string)[];

  /**
   * The actions to take on a fragmented packet if it doesn't match any of the stateless rules in the policy.
   */
  readonly statelessFragmentDefaultActions: (StatelessStandardAction | string)[];

  /**
   * The default actions to take on a packet that doesn't match any stateful rules.
   * The stateful default action is optional, and is only valid when using the strict rule order
   *
   * @default - undefined
   */
  readonly statefulDefaultActions?: (StatefulStrictAction | string)[];

  /**
   * Additional options governing how Network Firewall handles stateful rules.
   * The stateful rule groups that you use in your policy must have stateful rule options settings that are compatible with these settings
   *
   * @default - undefined
   */
  readonly statefulEngineOptions?: CfnFirewallPolicy.StatefulEngineOptionsProperty;

  /**
   * The stateful rule groups that are used in the policy.
   *
   * @default - undefined
   */
  readonly statefulRuleGroups?: StatefulRuleGroupList[];

  /**
   * The custom action definitions that are available for use in the firewall policy's statelessDefaultActions setting.
   *
   * @default - undefined
   */
  readonly statelessCustomActions?: CfnFirewallPolicy.CustomActionProperty[];

  /**
   *References to the stateless rule groups that are used in the policy.
   *
   * @default - undefined
   */
  readonly statelessRuleGroups?: StatelessRuleGroupList[];

  /**
   * The description of the policy.
   *
   * @default - undefined
   */
  readonly description?: string;

  /**
   * Tags to be added to the firewall policy.
   *
   * @default No tags applied
   */
  readonly tags?: core.Tag[];

}

/**
 * Defines a Firewall Policy in the stack
 * @resource AWS::NetworkFirewall::FirewallPolicy
 */
export class FirewallPolicy extends FirewallPolicyBase {
  /**
   * Reference existing firewall policy name
   */
  public static fromFirewallPolicyName(scope: Construct, id:string, firewallPolicyName: string): IFirewallPolicy {
    class Import extends FirewallPolicyBase {
      public readonly firewallPolicyId = firewallPolicyName;
      public readonly firewallPolicyArn = core.Stack.of(scope).formatArn({
        service: 'network-firewall',
        resource: 'firewall-policy',
        resourceName: firewallPolicyName,
      });
    }
    return new Import(scope, id);
  }

  /**
   * Reference existing firewall policy by Arn
   */
  public static fromFirewallPolicyArn(scope: Construct, id:string, firewallPolicyArn: string): IFirewallPolicy {
    class Import extends FirewallPolicyBase {
      public readonly firewallPolicyId = core.Fn.select(1, core.Fn.split('/', firewallPolicyArn));
      public readonly firewallPolicyArn = firewallPolicyArn
    }
    return new Import(scope, id);
  }

  public readonly firewallPolicyArn: string;
  public readonly firewallPolicyId: string;

  /**
   * The Default actions for packets that don't match a stateless rule
   */
  public readonly statelessDefaultActions: string[];

  /**
   * The Default actions for fragment packets that don't match a stateless rule
   */
  public readonly statelessFragmentDefaultActions: string[];

  /**
   * The Default actions for packets that don't match a stateful rule
   */
  public readonly statefulDefaultActions: string[];


  /**
   * The stateless rule groups in this policy
   */
  public readonly statelessRuleGroups: StatelessRuleGroupList[];

  /**
   * The stateful rule groups in this policy
   */
  public readonly statefulRuleGroups: StatefulRuleGroupList[];

  constructor(scope:Construct, id:string, props: FirewallPolicyProps) {
    super(scope, id, {
      physicalName: props.firewallPolicyName,
    });

    this.statelessDefaultActions = props.statelessDefaultActions || [];
    this.statelessFragmentDefaultActions = props.statelessFragmentDefaultActions || [];
    this.statefulDefaultActions = props.statefulDefaultActions || [];

    this.statelessRuleGroups = props.statelessRuleGroups || [];
    this.statefulRuleGroups = props.statefulRuleGroups || [];
    // Adding Validations

    /**
     * Validate policyId
     */
    if (props.firewallPolicyName !== undefined &&
	  !/^[_a-zA-Z]+$/.test(props.firewallPolicyName)) {
      throw new Error('policyId must be non-empty and contain only letters and underscores, ' +
		  `got: '${props.firewallPolicyName}'`);
    }

    /**
     * Validating Stateless Default Actions
     */
    if (props.statelessDefaultActions !== undefined) {
      // Ensure only one standard action is provided.
      if (this.validateOnlyOne(StatelessStandardAction, props.statelessDefaultActions)) {
        this.statelessDefaultActions = props.statelessDefaultActions;
      } else {
        throw new Error('Only one standard action can be provided for the StatelessDefaultAction, all other actions must be custom');
      }
    }

    /**
     * Validating Stateless Fragement Default Actions
     */
    if (props.statelessFragmentDefaultActions !== undefined) {
      // Ensure only one standard action is provided.
      if (this.validateOnlyOne(StatelessStandardAction, props.statelessFragmentDefaultActions)) {
        this.statelessFragmentDefaultActions = props.statelessFragmentDefaultActions;
      } else {
        throw new Error('Only one standard action can be provided for the StatelessFragementDefaultAction, all other actions must be custom');
      }
    }

    /**
     * Validating Stateful Strict Default Actions
     */
    if (props.statefulDefaultActions !== undefined) {
      // Ensure only one standard action is provided.
      if (this.validateOnlyOne(StatefulStrictAction, props.statefulDefaultActions)) {
        this.statefulDefaultActions = props.statefulDefaultActions;
      } else {
        throw new Error('Only one strict action can be provided for the StatefulDefaultAction, all other actions must be custom');
      }
    }

    /**
     * validate unique stateless group priorities
     */
    let statelessRuleGroupReferences:CfnFirewallPolicy.StatelessRuleGroupReferenceProperty[] = [];
    if (props.statelessRuleGroups !== undefined) {
      if (!this.validateUniquePriority(props.statelessRuleGroups)) {
        throw new Error('Priority must be unique, recieved duplicate priority on stateless group');
      }
      statelessRuleGroupReferences = this.buildRuleGroupReferences(props.statelessRuleGroups);
    }

    /**
     * validate unique stateful group priorities
     */
    let statefulRuleGroupReferences:CfnFirewallPolicy.StatefulRuleGroupReferenceProperty[] = [];
    if (props.statefulRuleGroups !== undefined) {
      if (!this.validateUniquePriority(props.statefulRuleGroups)) {
        throw new Error('Priority must be unique, recieved duplicate priority on stateful group');
      }
      statefulRuleGroupReferences = this.buildRuleGroupReferences(props.statefulRuleGroups);
    }

    // Auto define stateless default actions?
    //const statelessDefaultActions = props.statelessDefaultActions || [StatelessStandardAction.DROP];

    // Auto define stateless fragement default actions?
    //const statelessFragmentDefaultActions = props.statelessFragmentDefaultActions || [StatelessStandardAction.DROP];

    // Auto define stateful default actions?
    // Only valid when using the strict order rule
    //const statefulDefaultActions = props.statefulDefaultActions || [statefulStrictAction.ALERT_ESTABLISHED]

    // Auto define stateless rule group?
    //const statelessRuleGroup = props.statelessRuleGroups || [new StatelessRuleGroup(priority=10,...)];
    // Auto define stateful rule group?
    //const statefulRuleGroup = props.statefulRuleGroups || [new StatefulRuleGroup5Tuple(priority=10,...)];


    const resourcePolicyProperty:CfnFirewallPolicy.FirewallPolicyProperty = {
      statelessDefaultActions: props.statelessDefaultActions,
      statelessFragmentDefaultActions: props.statelessFragmentDefaultActions,
      // The properties below are optional.
      statefulDefaultActions: props.statefulDefaultActions,
      statefulEngineOptions: props.statefulEngineOptions,
      statefulRuleGroupReferences: statefulRuleGroupReferences,
      statelessCustomActions: props.statelessCustomActions,
      statelessRuleGroupReferences: statelessRuleGroupReferences,
    };

    const resourceProps:CfnFirewallPolicyProps = {
      firewallPolicy: resourcePolicyProperty,
      firewallPolicyName: props.firewallPolicyName || id,
      description: props.description,
      tags: props.tags || [],
    };

    const resource:CfnFirewallPolicy = new CfnFirewallPolicy(this, props.firewallPolicyName || id, resourceProps);

    this.firewallPolicyId = this.getResourceNameAttribute(resource.ref);

    this.firewallPolicyArn = this.getResourceArnAttribute(resource.attrFirewallPolicyArn, {
      service: 'NetworkFirewall',
      resource: 'FirewallPolicy',
      resourceName: this.firewallPolicyId,
    });
  }


  /**
   * Converts a Stateful(less)RuleGroupList to a Stateful(less)RuleGroupReferenceProperty
   */
  private buildRuleGroupReferences(ruleGroups:(StatefulRuleGroupList|StatelessRuleGroupList)[]) {
    let ruleGroupReferences:CfnFirewallPolicy.StatelessRuleGroupReferenceProperty[]|CfnFirewallPolicy.StatefulRuleGroupReferenceProperty = [];
    let ruleGroup:StatefulRuleGroupList|StatelessRuleGroupList;
    for (ruleGroup of ruleGroups) {
      ruleGroupReferences.push({
        priority: ruleGroup.priority,
        resourceArn: ruleGroup.ruleGroup.ruleGroupArn,
      });
    }
    return ruleGroupReferences;
  }

  /**
   * To validate a set of rule groups to ensure they have unqiue priorities
   */
  private validateUniquePriority(ruleGroups:any):boolean {
    let priorities:number[] = [];
    let tempRuleGroup:StatefulRuleGroupList;
    for (tempRuleGroup of ruleGroups) {
      if (priorities.includes(tempRuleGroup.priority)) {
        return false;
      }
      priorities.push(tempRuleGroup.priority);
    }
    return true;
  }

  /**
   * Validates that only one occurance of the enumeration is found in the values.
   * This is for verifying only one standard default action is used in a list.
   */
  private validateOnlyOne(enumeration:any, values:string[]):boolean {
    let oneFound:boolean = false;
    let value:string;
    for (value of values) {
      if (Object.values<string>(enumeration).includes(value)) {
        if (oneFound) {
          return false;
        }
        oneFound = true;
      }
    }
    return true;
  }
}
