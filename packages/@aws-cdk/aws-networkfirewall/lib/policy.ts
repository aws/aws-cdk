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

  constructor(scope:Construct, id:string, props: FirewallPolicyProps) {
    super(scope, id, {
      physicalName: props.firewallPolicyName,
    });

    // Adding Validations

    /**
     * Validate policyId
     */
    if (props.firewallPolicyName !== undefined &&
				!/^[_a-zA-Z]+$/.test(props.firewallPolicyName)) {
      throw new Error('policyId must be non-empty and contain only letters and underscores, ' +
				`got: '${props.firewallPolicyName}'`);
    }

    //TODO: Verify default actions only have one standard action

    /**
     * Validating Stateless Default Actions
     */
    // Ensure only one standard action is provided.
    let standard_action_provided:boolean=false;
    let action:string;
    if (props.statelessDefaultActions !== undefined) {
      for (action of props.statelessDefaultActions) {
        if (Object.values<string>(StatelessStandardAction).includes(action)) {
          if (standard_action_provided) {
            throw new Error('Only one standard action can be provided for the StatelessDefaultAction, all other actions must be custom');
          }
          standard_action_provided=true;
        }
      }
    }

    /**
     * Validating Stateless Fragement Default Actions
     */
    // Ensure only one standard action is provided.
    standard_action_provided=false;
    if (props.statelessFragmentDefaultActions !== undefined) {
      for (action of props.statelessFragmentDefaultActions) {
        if (Object.values<string>(StatelessStandardAction).includes(action)) {
          if (standard_action_provided) {
            throw new Error('Only one standard action can be provided for the StatelessFragementDefaultAction, all other actions must be custom');
          }
          standard_action_provided=true;
        }
      }
    }

    /**
     * Validating Stateful Strict Default Actions
     */
    standard_action_provided=false;
    if (props.statefulDefaultActions !== undefined) {
      // Ensure only one standard action is provided.
      for (action of props.statefulDefaultActions) {
        if (Object.values<string>(StatefulStrictAction).includes(action)) {
          if (standard_action_provided) {
            throw new Error('Only one strict action can be provided for the StatefulDefaultAction, all other actions must be custom');
          }
          standard_action_provided=true;
        }
      }
    }


    //TODO: Auto define stateless default actions?
    //const statelessDefaultActions = props.statelessDefaultActions || [StatelessStandardAction.DROP];

    //TODO: Auto define stateless fragement default actions?
    //const statelessFragmentDefaultActions = props.statelessFragmentDefaultActions || [StatelessStandardAction.DROP];

    //TODO: Auto define stateful default actions?
    // Only valid when using the strict order rule
    //const statefulDefaultActions = props.statefulDefaultActions || [statefulStrictAction.ALERT_ESTABLISHED]

    //TODO: Auto define stateless rule group?
    //const statelessRuleGroup = props.statelessRuleGroups || [new StatelessRuleGroup(priority=10,...)];
    //TODO: Auto define stateful rule group?
    //const statefulRuleGroup = props.statefulRuleGroups || [new StatefulRuleGroup5Tuple(priority=10,...)];

    // for props.statefulRuleGroup, get the refs
    const statefulRuleGroupReferences:CfnFirewallPolicy.StatefulRuleGroupReferenceProperty[] = [];
    var statefulRuleGroup:StatefulRuleGroupList;
    // track used priorities to ensure there are no duplicates
    let statefulRuleGroupPriorities:number[] = [];
    if (props.statefulRuleGroups !== undefined) {
      for (statefulRuleGroup of props.statefulRuleGroups) {
        // To ensure the priorities don't overlap, we'll check them into a list.
        if (statefulRuleGroupPriorities.includes(statefulRuleGroup.priority)) {
          throw new Error('Priority must be unique, '+
					`got stateful group duplicate priority: '${statefulRuleGroup.priority}'`);
        }
        statefulRuleGroupPriorities.push(statefulRuleGroup.priority);
        statefulRuleGroupReferences.push({
          priority: statefulRuleGroup.priority,
          resourceArn: statefulRuleGroup.ruleGroup.ruleGroupArn,
        });
      }
    }


    // for props.statelessRuleGroup, get the refs
    const statelessRuleGroupReferences:CfnFirewallPolicy.StatelessRuleGroupReferenceProperty[] = [];
    var statelessRuleGroup:StatelessRuleGroupList;
    // track used priorities to ensure there are no duplicates
    let statelessRuleGroupPriorities:number[] = [];
    if (props.statelessRuleGroups !== undefined) {
      for (statelessRuleGroup of props.statelessRuleGroups) {
        // To ensure the priorities don't overlap, we'll check them into a list.
        if (statelessRuleGroupPriorities.includes(statelessRuleGroup.priority)) {
          throw new Error('Priority must be unique, '+
					`got stateless group duplicate priority: '${statelessRuleGroup.priority}'`);
        }
        statelessRuleGroupPriorities.push(statelessRuleGroup.priority);
        statelessRuleGroupReferences.push({
          priority: statelessRuleGroup.priority,
          resourceArn: statelessRuleGroup.ruleGroup.ruleGroupArn,
        });
      }
    }

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
      firewallPolicyName: this.physicalName,
      //TODO description
      //TODO tags
    };

    const resource:CfnFirewallPolicy = new CfnFirewallPolicy(this, this.physicalName, resourceProps);

    this.firewallPolicyArn = resource.attrFirewallPolicyArn;
    this.firewallPolicyId = resource.attrFirewallPolicyId;
  }
}
