import * as chalk from 'chalk';
import { RuleJson, SecurityGroupRule } from './security-group-rule';
import { PropertyChange, ResourceChange } from '../diff/types';
import { DiffableCollection } from '../diffable';
import { renderIntrinsics } from '../render-intrinsics';
import { deepRemoveUndefined, dropIfEmpty, makeComparator } from '../util';

export interface SecurityGroupChangesProps {
  ingressRulePropertyChanges: PropertyChange[];
  ingressRuleResourceChanges: ResourceChange[];
  egressRuleResourceChanges: ResourceChange[];
  egressRulePropertyChanges: PropertyChange[];
}

/**
 * Changes to IAM statements
 */
export class SecurityGroupChanges {
  public readonly ingress = new DiffableCollection<SecurityGroupRule>();
  public readonly egress = new DiffableCollection<SecurityGroupRule>();

  constructor(props: SecurityGroupChangesProps) {
    // Group rules
    for (const ingressProp of props.ingressRulePropertyChanges) {
      this.ingress.addOld(...this.readInlineRules(ingressProp.oldValue, ingressProp.resourceLogicalId));
      this.ingress.addNew(...this.readInlineRules(ingressProp.newValue, ingressProp.resourceLogicalId));
    }
    for (const egressProp of props.egressRulePropertyChanges) {
      this.egress.addOld(...this.readInlineRules(egressProp.oldValue, egressProp.resourceLogicalId));
      this.egress.addNew(...this.readInlineRules(egressProp.newValue, egressProp.resourceLogicalId));
    }

    // Rule resources
    for (const ingressRes of props.ingressRuleResourceChanges) {
      this.ingress.addOld(...this.readRuleResource(ingressRes.oldProperties));
      this.ingress.addNew(...this.readRuleResource(ingressRes.newProperties));
    }
    for (const egressRes of props.egressRuleResourceChanges) {
      this.egress.addOld(...this.readRuleResource(egressRes.oldProperties));
      this.egress.addNew(...this.readRuleResource(egressRes.newProperties));
    }

    this.ingress.calculateDiff();
    this.egress.calculateDiff();
  }

  public get hasChanges() {
    return this.ingress.hasChanges || this.egress.hasChanges;
  }

  /**
   * Return a summary table of changes
   */
  public summarize(): string[][] {
    const ret: string[][] = [];

    const header = ['', 'Group', 'Dir', 'Protocol', 'Peer'];

    const inWord = 'In';
    const outWord = 'Out';

    // Render a single rule to the table (curried function so we can map it across rules easily--thank you JavaScript!)
    const renderRule = (plusMin: string, inOut: string) => (rule: SecurityGroupRule) => [
      plusMin,
      rule.groupId,
      inOut,
      rule.describeProtocol(),
      rule.describePeer(),
    ].map(s => plusMin === '+' ? chalk.green(s) : chalk.red(s));

    // First generate all lines, sort later
    ret.push(...this.ingress.additions.map(renderRule('+', inWord)));
    ret.push(...this.egress.additions.map(renderRule('+', outWord)));
    ret.push(...this.ingress.removals.map(renderRule('-', inWord)));
    ret.push(...this.egress.removals.map(renderRule('-', outWord)));

    // Sort by group name then ingress/egress (ingress first)
    ret.sort(makeComparator((row: string[]) => [row[1], row[2].indexOf(inWord) > -1 ? 0 : 1]));

    ret.splice(0, 0, header);

    return ret;
  }

  public toJson(): SecurityGroupChangesJson {
    return deepRemoveUndefined({
      ingressRuleAdditions: dropIfEmpty(this.ingress.additions.map(s => s.toJson())),
      ingressRuleRemovals: dropIfEmpty(this.ingress.removals.map(s => s.toJson())),
      egressRuleAdditions: dropIfEmpty(this.egress.additions.map(s => s.toJson())),
      egressRuleRemovals: dropIfEmpty(this.egress.removals.map(s => s.toJson())),
    });
  }

  public get rulesAdded(): boolean {
    return this.ingress.hasAdditions
        || this.egress.hasAdditions;
  }

  private readInlineRules(rules: any, logicalId: string): SecurityGroupRule[] {
    if (!rules) { return []; }

    // UnCloudFormation so the parser works in an easier domain

    const ref = '${' + logicalId + '.GroupId}';
    return rules.map((r: any) => new SecurityGroupRule(renderIntrinsics(r), ref));
  }

  private readRuleResource(resource: any): SecurityGroupRule[] {
    if (!resource) { return []; }

    // UnCloudFormation so the parser works in an easier domain

    return [new SecurityGroupRule(renderIntrinsics(resource))];
  }
}

export interface SecurityGroupChangesJson {
  ingressRuleAdditions?: RuleJson[];
  ingressRuleRemovals?: RuleJson[];
  egressRuleAdditions?: RuleJson[];
  egressRuleRemovals?: RuleJson[];
}
