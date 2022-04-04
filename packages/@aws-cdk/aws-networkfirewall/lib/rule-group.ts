import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnRuleGroup, CfnRuleGroupProps } from './networkfirewall.generated';
import { StatelessRule, Stateful5TupleRule, StatefulDomainListRule } from './rule';

//import { StatelessStandardAction, StatefulStandardAction } from './actions';

/**
 * The Possible Rule Group Types
 */
enum RuleGroupType {
  /**
	 * For Stateless Rule Group Types
	 */
  STATELESS = 'STATELESS',

  /**
	 * For Stateful Rule Group Types
	 */
  STATEFUL = 'STATEFUL',
}

/**
 * Defines a Stateless rule Group in the stack
 */
export interface IStatelessRuleGroup extends core.IResource {
  /**
	 * The Arn of the rule group
	 *
	 * @attribute
	 */
  readonly ruleGroupArn: string;

  /**
	 * the physical name of the rule group
	 *
	 * @attribute
	 */
  readonly ruleGroupId: string;
}

/**
 * The Base class for Stateless Rule Groups
 */
abstract class StatelessRuleGroupBase extends core.Resource implements IStatelessRuleGroup {
  public abstract readonly ruleGroupArn: string;
  public abstract readonly ruleGroupId: string;
}

/**
 * The properties for defining a Stateless Rule Group
 */
export interface StatelessRuleGroupProps {
  /**
	 * The descriptive name of the stateless rule group
	 *
	 * @default - CloudFormation-generated name
	 */
  readonly ruleGroupName?: string;
  /**
	 * The maximum operating resources that this rule group can use.
	 *
	 * @default - Capacity is Calculated from rule requirements.
	 */
  readonly capacity?: number;

  /**
	 * The rule group rules
	 *
	 * @default = undefined
	 */
  readonly rules?: StatelessRule[];

  /**
	 * An optional Non-standard action to use
	 *
	 * @default - undefined
	 */
  readonly customActions?: CfnRuleGroup.CustomActionProperty[];

  /**
	 * Settings that are available for use in the rules
	 *
	 * @default - undefined
	 */
  readonly variables?: CfnRuleGroup.RuleVariablesProperty;
}

/**
 * A Stateless Rule group that holds Stateless Rules
 * @resource AWS::NetworkFirewall::RuleGroup
 */
export class StatelessRuleGroup extends StatelessRuleGroupBase {
  /**
   * Refernce existing Rule Group by Name
   */
  public static fromStatelessRuleGroupName(scope: Construct, id: string, statelessRuleGroupName: string): IStatelessRuleGroup {
    class Import extends StatelessRuleGroupBase {
      public readonly ruleGroupId = statelessRuleGroupName;
      public readonly ruleGroupArn = core.Stack.of(scope).formatArn({
        service: 'network-firewall',
        resource: 'stateful-rulegroup',
        resourceName: statelessRuleGroupName,
      });
    }
    return new Import(scope, id);
  }

  /**
   * Reference existing Rule Group by Arn
   */
  public static fromStatelessRuleGroupArn(scope: Construct, id: string, statelessRuleGroupArn: string): IStatelessRuleGroup {
    class Import extends StatelessRuleGroupBase {
      public readonly ruleGroupId = core.Fn.select(1, core.Fn.split('/', statelessRuleGroupArn));
      public readonly ruleGroupArn = statelessRuleGroupArn;
    }
    return new Import(scope, id);
  }

  public readonly ruleGroupId: string;
  public readonly ruleGroupArn: string;
  private rules:StatelessRule[];

  constructor(scope: Construct, id:string, props?: StatelessRuleGroupProps) {
    if (props === undefined) {props = {};}
    super(scope, id, {
      physicalName: props.ruleGroupName,
    });

    // Adding Validations

    /**
     * Validate ruleGroupId
     */
    if (props.ruleGroupName !== undefined &&
				!/^[_a-zA-Z]+$/.test(props.ruleGroupName)) {
      throw new Error('ruleGroupName must be non-empty and contain only letters and underscores, ' +
				`got: '${props.ruleGroupName}'`);
    }

    /**
     * Validate Rule priority
     */
    if (props.rules !== undefined) {
      this.verifyUniquePriority();
    }
    this.rules = props.rules||[];
    /**
     * Validating Capacity
     */
    const capacity:number = props.capacity || this.calculateCapacity(props.rules);
    if (!Number.isInteger(capacity)) {
      throw new Error('capacity must be an integer value, '+
				`got: '${capacity}'`);
    }
    if (capacity < 0 || capacity > 30000) {
      throw new Error('capacity must be a positive value less than 30,000, '+
				`got: '${capacity}'`);
    }

    const statelessRules:CfnRuleGroup.StatelessRuleProperty[] = [];
    if (props.rules !== undefined) {
      let rule:StatelessRule;
      for (rule of props.rules) {
        statelessRules.push(rule.resource);
      }
    }

    const statelessRulesAndCustomActions:CfnRuleGroup.StatelessRulesAndCustomActionsProperty={
      statelessRules: statelessRules,
      customActions: props.customActions,
    };

    const resourceRulesSource:CfnRuleGroup.RulesSourceProperty = {
      statelessRulesAndCustomActions: statelessRulesAndCustomActions,
    };

    //const resourceVariables:CfnRuleGroup.RuleVariablesProperty = props.variables;

    const resourceRuleGroupProperty:CfnRuleGroup.RuleGroupProperty={
      rulesSource: resourceRulesSource,
      ruleVariables: props.variables,
    };

    const resourceProps:CfnRuleGroupProps={
      capacity: capacity,
      ruleGroupName: this.physicalName,
      type: RuleGroupType.STATELESS,
      ruleGroup: resourceRuleGroupProperty,
      //description
      //tags
    };
    const resource:CfnRuleGroup = new CfnRuleGroup(this, this.physicalName, resourceProps);
    this.ruleGroupId = resource.attrRuleGroupId;
    this.ruleGroupArn = resource.attrRuleGroupArn;
  }

  /**
   * Calculates the expected capacity required for all applied stateful rules.
   */
  public calculateCapacity(rules: StatelessRule[]|undefined): number {
    let total:number = 0;
    var statelessRule: StatelessRule;
    if (rules !== undefined) {
      for (statelessRule of rules) {
        total += statelessRule.calculateCapacity();
      }
    }
    return total;
  }

  /**
   * Ensure all rules have unique priority values
   */
  private verifyUniquePriority() {
    let priorities:number[] = [];
    let rule:StatelessRule;
    for (rule of this.rules) {
      if (priorities.includes(rule.priority)) {
        throw new Error('Priority must be unique, '+
          `got duplicate priority: ${rule.priority}`);
      }
      priorities.push(rule.priority);
    }
  }
}

//
//  Define Stateful Rule Groups
//

/**
 * The Interface that represents a Stateful Rule Group
 */
export interface IStatefulRuleGroup extends core.IResource {
  /**
   * The Arn of the rule group
   *
   * @attribute
   */
  readonly ruleGroupArn: string;

  /**
   * the physical name of the rule group
   *
   * @attribute
   */
  readonly ruleGroupId: string;
}

/**
 * Indicates how to manage the order of the rule evaluation for the rule group.
 */
export enum StatefulRuleOptions {
  /**
   * This is the default action
   * Stateful rules are provided to the rule engine as Suricata compatible strings, and Suricata evaluates them based on certain settings
   */
  DEFAULT_ACTION_ORDER='DEFAULT_ACTION_ORDER',

  /**
   * With strict ordering, the rule groups are evaluated by order of priority, starting from the lowest number, and the rules in each rule group are processed in the order in which they're defined.
   */
  STRICT_ORDER='STRICT_ORDER'
}

/**
 * Properties for defining a Stateful Rule Group
 */
interface StatefulRuleGroupProps {
  /**
   * The descriptive name of the stateful rule group
   *
   * @default - CloudFormation-generated name
   */
  readonly ruleGroupName?: string;
  /**
   * The maximum operating resources that this rule group can use.
   * Estimate a stateful rule group's capacity as the number of rules that you expect to have in it during its lifetime.
   * You can't change this setting after you create the rule group
   * @default - 200
   */
  readonly capacity?: number;

  /**
   * Settings that are available for use in the rules
   *
   * @default - undefined
   */
  readonly variables?: CfnRuleGroup.RuleVariablesProperty;
}

/**
 * Defines a Stateful Rule Group in the stack
 */
abstract class StatefulRuleGroup extends core.Resource implements IStatefulRuleGroup {

  /**
   * Reference existing Rule Group
   */
  public static fromRuleGroupArn(scope: Construct, id: string, ruleGroupArn: string): IStatefulRuleGroup {
    class Import extends StatelessRuleGroupBase {
      public readonly ruleGroupId = core.Fn.select(1, core.Fn.split('/', ruleGroupArn));
      public readonly ruleGroupArn = ruleGroupArn;
    }
    return new Import(scope, id);
  }

  public abstract readonly ruleGroupArn: string;
  public abstract readonly ruleGroupId: string;

  constructor(scope:Construct, id:string, props?:StatefulRuleGroupProps) {
    if (props === undefined) {props = {};}
    super(scope, id, {
      physicalName: props.ruleGroupName,
    });

    /**
     * Validating Capacity
     */
    // default capacity to 200
    const capacity:number = props.capacity || 200;
    if (!Number.isInteger(capacity)) {
      throw new Error('capacity must be an integer value, '+
				`got: '${capacity}'`);
    }
    if (capacity < 0 || capacity > 30000) {
      throw new Error('capacity must be a positive value less than 30,000, '+
				`got: '${capacity}'`);
    }
  }
}

/**
 * Properties for defining a Stateful Suricata Rule Group
 *
 * @resource AWS::NetworkFIrewall::RuleGroup
 */
export interface StatefulRuleGroupSuricataProps extends StatefulRuleGroupProps {
  /**
   * The suricata rules
   *
   * @default - undefined
   */
  readonly rules?: string;


  /**
   * Settings that are available for use in the rules
   *
   * @default - undefined
   */
  readonly ruleVariables?: CfnRuleGroup.RuleVariablesProperty;

  /**
   * Rule Order
   *
   * @default - DEFAULT_RULE_ACTION_ORDER
   */
  readonly ruleOrder?: StatefulRuleOptions;

}

/**
 * A Stateful Rule group that holds 5Tuple Rules
 *
 * @resource AWS::NetworkFirewall::RuleGroup
 */
export class StatefulRuleGroupSuricata extends StatefulRuleGroup {

  public readonly ruleGroupArn: string;
  public readonly ruleGroupId: string;

  constructor(scope:Construct, id:string, props?:StatefulRuleGroupSuricataProps) {
    if (props === undefined) {props = {};}
    super(scope, id, props);

    let rules:string = '';
    if (props.rules !== undefined) {
      rules = props.rules;
    }

    const resourceSourceProperty:CfnRuleGroup.RulesSourceProperty = {
      rulesString: rules,
    };

    const resourceRuleOptions:CfnRuleGroup.StatefulRuleOptionsProperty = {
      ruleOrder: props.ruleOrder || StatefulRuleOptions.DEFAULT_ACTION_ORDER,
    };
    const resourceRuleGroupProperty:CfnRuleGroup.RuleGroupProperty = {
      rulesSource: resourceSourceProperty,
      ruleVariables: props.ruleVariables || {},
      statefulRuleOptions: resourceRuleOptions,
    };
    const resourceProps:CfnRuleGroupProps={
      capacity: props.capacity || 100,
      ruleGroupName: this.physicalName,
      type: RuleGroupType.STATEFUL,
      ruleGroup: resourceRuleGroupProperty,
      //description
      //tags
    };

    const resource:CfnRuleGroup = new CfnRuleGroup(this, this.physicalName, resourceProps);
    this.ruleGroupId = resource.attrRuleGroupId;
    this.ruleGroupArn = resource.attrRuleGroupArn;
  }

}

/**
 * Properties for defining a Stateful 5 Tuple Rule Group
 *
 * @resource AWS::NetworkFIrewall::RuleGroup
 */
export interface StatefulRuleGroup5TupleProps extends StatefulRuleGroupProps {
  /**
   * The rule group rules
   *
   * @default = undefined
   */
  readonly rules?: Stateful5TupleRule[];
}

/**
 * A Stateful Rule group that holds 5Tuple Rules
 * @resource AWS::NetworkFirewall::RuleGroup
 */
export class StatefulRuleGroup5Tuple extends StatefulRuleGroup {

  public readonly ruleGroupArn: string;
  public readonly ruleGroupId: string;

  constructor(scope:Construct, id:string, props?:StatefulRuleGroup5TupleProps) {
    if (props === undefined) {props = {};}
    super(scope, id, props);

    const resourceSourceProperty:CfnRuleGroup.RulesSourceProperty={};

    const resourceRuleGroupProperty:CfnRuleGroup.RuleGroupProperty = {

      rulesSource: resourceSourceProperty,
    };

    const resourceProps:CfnRuleGroupProps={
      capacity: props.capacity || 100,
      ruleGroupName: this.physicalName,
      type: RuleGroupType.STATEFUL,
      ruleGroup: resourceRuleGroupProperty,
      //description
      //tags
    };

    const resource:CfnRuleGroup = new CfnRuleGroup(this, this.physicalName, resourceProps);
    this.ruleGroupId = resource.attrRuleGroupId;
    this.ruleGroupArn = resource.attrRuleGroupArn;
  }
}

/**
 * Defines a Stateful Domain List Rule group in the stack
 *
 * @resource AWS::NetworkFIrewall::RuleGroup
 */
export interface StatefulRuleGroupDomainListProps extends StatefulRuleGroupProps {
  /**
   * The Domain List rule
   * @default - undefined
   */
  readonly rule?: StatefulDomainListRule;

  /**
   * Indicates how to manage the order of the rule evaluation for the rule group
   *
   * @default - Default Action Order
   */
  readonly ruleOrder?: StatefulRuleOptions;
}

/**
 * A Stateful Rule group that holds Domain List Rules
 * @resource AWS::NetworkFirewall::RuleGroup
 */
export class StatefulRuleGroupDomainList extends StatefulRuleGroup {

  public readonly ruleGroupArn: string;
  public readonly ruleGroupId: string;

  constructor(scope:Construct, id:string, props?:StatefulRuleGroupDomainListProps) {
    if (props === undefined) {props = {};}
    super(scope, id, props);

    const resourceSourceProperty:CfnRuleGroup.RulesSourceProperty=(props.rule !== undefined)?
      { rulesSourceList: props.rule.resource }:{};

    const resourceRuleOptions:CfnRuleGroup.StatefulRuleOptionsProperty = {
      ruleOrder: props.ruleOrder || StatefulRuleOptions.DEFAULT_ACTION_ORDER,
    };

    const resourceRuleGroupProperty:CfnRuleGroup.RuleGroupProperty = {
      rulesSource: resourceSourceProperty,
      //ruleVariables: ,
      statefulRuleOptions: resourceRuleOptions,
    };

    const resourceProps:CfnRuleGroupProps={
      capacity: props.capacity || 100,
      ruleGroupName: this.physicalName,
      type: RuleGroupType.STATEFUL,
      ruleGroup: resourceRuleGroupProperty,
      //description
      //tags
    };

    const resource:CfnRuleGroup = new CfnRuleGroup(this, this.physicalName, resourceProps);
    this.ruleGroupId = resource.attrRuleGroupId;
    this.ruleGroupArn = resource.attrRuleGroupArn;
  }
}
