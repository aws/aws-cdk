import type { IConstruct } from 'constructs';
import { Construct } from 'constructs';
import type { IAspect, IPostProcessor, IResolvable, IResolveContext } from '../../../core';
import {
  Annotations, AspectPriority, Aspects, DefaultTokenResolver,
  Mixin, Reference, Stack, Stage, Token, Tokenization, UnscopedValidationError, ValidationError,
} from '../../../core';
import { md5hash } from '../../../core/lib/helpers-internal';
import { currentAspectVisitation } from '../../../core/lib/private/aspect-visitation';
import { CloudFormationLang } from '../../../core/lib/private/cloudformation-lang';
import { iterateDfsPreorderStopAtStage } from '../../../core/lib/private/construct-iteration';
import { lit } from '../../../core/lib/private/literal-string';
import { CfnRecordSet, CfnRecordSetProtection } from '../route53.generated';

/**
 * Options for protecting Route 53 record sets from changes.
 */
export interface RecordSetProtectionProps {
  /**
   * The message Route 53 includes in the error when it blocks a change.
   *
   * CloudFormation replaces the protection if you change this comment.
   * @default - no comment
   */
  readonly comment?: string;
}

/**
 * Protects all records with the target's name and type in its hosted zone.
 *
 * Apply the mixin to a record, to a scope containing records, or from an Aspect.
 * Set the hosted zone ID, name, and type on every target before applying it.
 * Scope-wide application throws if any selected record specifies only a hosted zone name.
 *
 * CloudFormation creates matching records in the same template before enabling
 * their shared protection. Use the same CloudFormation condition for those records.
 * An untargeted record that specifies only a hosted zone name triggers a warning
 * if its name and type match. Set its zone ID so CDK can order records in the same template.
 * For records in other templates, including nested stacks, deploy those records
 * first and manage the protection in one stack.
 * An application can supply a missing comment. If several applications supply
 * comments for the same protection, the comments must agree.
 *
 * You can create new records and their protection together. For existing records,
 * add protection in a deployment that leaves the records unchanged so CloudFormation
 * can roll back. To change the group later, remove every application that protects it,
 * including any on a common scope, and deploy before editing the records.
 */
export class RecordSetProtection extends Mixin {
  constructor(private readonly props: RecordSetProtectionProps = {}) {
    super();
    const comment = props.comment;
    if (comment !== undefined && !Token.isUnresolved(comment) && Array.from(comment).length > 256) {
      throw new UnscopedValidationError(lit`RecordSetProtectionCommentTooLong`, `protection comment must be at most 256 characters, got ${JSON.stringify(comment)}`);
    }
  }

  public supports(construct: IConstruct): construct is CfnRecordSet {
    return CfnRecordSet.isCfnRecordSet(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) return;
    if (construct.hostedZoneId === undefined) {
      throw new ValidationError(lit`RecordSetProtectionRequiresHostedZoneId`, 'set hostedZoneId on the record to enable record set protection', construct);
    }

    ProtectionGroups.of(Stack.of(construct)).register(construct, construct.hostedZoneId, construct.name, construct.type, this.props.comment);
  }
}

const PROTECTION_GROUPS = Symbol.for('@aws-cdk/aws-route53.RecordSetProtectionGroups');
const PROTECTION_IDENTITY = Symbol.for('@aws-cdk/aws-route53.RecordSetProtectionIdentity');
const LINK_RECORDS = Symbol.for('@aws-cdk/aws-route53.LinkProtectedRecords');
const PROTECTION_OWNERS = Symbol.for('@aws-cdk/aws-route53.RecordSetProtectionOwners');

type ManagedProtection = CfnRecordSetProtection & { [PROTECTION_IDENTITY]: any[] };

/** Wait until synthesis to group records whose names or zone IDs are lazy. */
class ProtectionGroups implements IAspect {
  public static of(stack: Stack): ProtectionGroups {
    const owner = stack as Stack & { [PROTECTION_GROUPS]?: ProtectionGroups };
    const groups = owner[PROTECTION_GROUPS] ??= new ProtectionGroups(stack);
    const visits = currentAspectVisitation(stack);
    if (visits) {
      // The stack may already have been visited. Bind now and install the aspect for future syntheses.
      groups.visit(stack);
      if (!groups.installed && !visits.includes(groups.install)) visits.push(groups.install);
    } else {
      groups.install();
    }
    return groups;
  }

  private readonly pending: Array<(scope: Construct) => void> = [];
  private scope?: Construct;
  private installed = false;

  private constructor(private readonly stack: Stack) {}

  private readonly install = () => {
    if (this.installed) return;
    Aspects.of(this.stack).add(this, { priority: AspectPriority.MUTATING });
    this.installed = true;
  };

  public visit(node: IConstruct): void {
    if (node !== this.stack) return;
    if (!this.scope) {
      const id = 'Route53RecordSetProtections';
      if (this.stack.node.tryFindChild(id)) {
        throw new ValidationError(lit`RecordSetProtectionScopeIdInUse`, `rename the construct with ID ${id} to allow RecordSetProtection to use its reserved stack scope`, this.stack);
      }
      this.scope = new Construct(this.stack, id);
      for (const bind of this.pending) bind(this.scope);
      this.pending.length = 0;
    }

    // All stacks in this assembly must finish applying aspects before matching records.
    const visits = currentAspectVisitation(this.stack)! as Array<() => void> & { [LINK_RECORDS]?: boolean };
    if (!visits[LINK_RECORDS]) {
      visits[LINK_RECORDS] = true;
      // A test can synthesize a single stack instead of its enclosing stage.
      const root = this.stack.node.scopes.find(scope => currentAspectVisitation(scope) === visits)!;
      visits.push(() => linkMatchingRecords(root));
    }
  }

  public register(record: CfnRecordSet, zone: string, name: string, type: string, comment?: string): void {
    const bind = (scope: Construct) => {
      const identity = recordIdentity(record, zone, name, type);
      const key = expressionKey(identity);
      // This hash and its normalized input are part of the protection's CloudFormation logical ID.
      const id = md5hash(key);
      let protection = scope.node.tryFindChild(id) as CfnRecordSetProtection | undefined;
      if (!protection) {
        protection = new CfnRecordSetProtection(scope, id, {
          hostedZoneId: typeof identity[0] === 'string' ? identity[0] : zone,
          recordName: typeof identity[1] === 'string' ? identity[1] : name,
          recordType: type,
          comment,
        });
        Object.defineProperty(protection, PROTECTION_IDENTITY, { value: identity });
      } else if (comment !== undefined) {
        if (protection.comment !== undefined &&
          expressionKey(resolveForGrouping(record, protection.comment)) !== expressionKey(resolveForGrouping(record, comment))) {
          throw new ValidationError(lit`ConflictingRecordSetProtectionComment`, `use the same protection comment for all records sharing ${record.name} and type ${record.type}`, record);
        }
        protection.comment = comment;
      }
      record.node.addValidation({
        validate: () => record.hostedZoneId !== undefined
          && expressionKey(recordIdentity(record, record.hostedZoneId, record.name, record.type)) === key ? [] : [
            'record identity changed after protection was applied, set the hosted zone, name and type before applying RecordSetProtection',
          ],
      });
    };
    if (this.scope) {
      bind(this.scope);
    } else {
      this.pending.push(bind);
    }
  }
}

/** Compare records across templates without confusing stack-local references or changing logical IDs. */
function comparableExpression(value: any, stack: Stack): any {
  if (Array.isArray(value)) return value.map(item => comparableExpression(item, stack));
  if (value === null || typeof value !== 'object') return value;
  if (value.localReferencePath !== undefined) {
    return { referencePath: stack.node.path + value.localReferencePath, attribute: value.attribute };
  }
  if (value.referencePath !== undefined) return value;
  if (value['Fn::Join']) return { 'Fn::Join': comparableExpression(value['Fn::Join'], stack) };
  if (value['Fn::ImportValue'] !== undefined && !Token.isUnresolved(stack.account) && !Token.isUnresolved(stack.region)) {
    return { account: stack.account, region: stack.region, importValue: comparableExpression(value['Fn::ImportValue'], stack) };
  }
  // Other intrinsics may refer to stack parameters, mappings, or deployment-time values.
  return { stack: stack.node.path, expression: value };
}

function linkMatchingRecords(assembly: IConstruct): void {
  const protections = new Map<string, ManagedProtection>();
  const protectedNames = new Set<string>();
  const records: CfnRecordSet[] = [];
  const root = assembly.node.root as IConstruct & { [PROTECTION_OWNERS]?: Map<string, ManagedProtection> };
  const owners = root[PROTECTION_OWNERS] ??= new Map();
  for (const node of iterateDfsPreorderStopAtStage(assembly)) {
    if (CfnRecordSet.isCfnRecordSet(node)) {
      records.push(node);
    } else if (PROTECTION_IDENTITY in node) {
      const protection = node as ManagedProtection;
      const stack = Stack.of(protection);
      const identity = comparableExpression(protection[PROTECTION_IDENTITY], stack);
      const key = expressionKey(identity);
      const previous = owners.get(key);
      const existing = protections.get(key) ?? (previous && Stage.of(previous) !== assembly ? previous : undefined);
      if (existing && existing !== protection) {
        throw new ValidationError(lit`DuplicateRecordSetProtection`,
          `protect this record group in only one stack: ${existing.node.path} and ${protection.node.path} both manage it`, protection);
      }
      protections.set(key, protection);
      protectedNames.add(expressionKey(identity.slice(1)));
    }
  }

  const members = new Map<ManagedProtection, CfnRecordSet[]>();
  for (const record of records) {
    const stack = Stack.of(record);
    const identity = comparableExpression(recordIdentity(record, record.hostedZoneId, record.name, record.type), stack);
    if (record.hostedZoneId === undefined) {
      if (record.hostedZoneName !== undefined && protectedNames.has(expressionKey(identity.slice(1)))) {
        Annotations.of(record).addWarningV2('@aws-cdk/aws-route53:recordSetProtectionHostedZoneName',
          'a protected record has the same name and type. Set hostedZoneId so CDK can check whether this record must be deployed before the protection');
      }
      continue;
    }
    const protection = protections.get(expressionKey(identity));
    if (!protection) continue;
    if (Stack.of(protection) !== stack) {
      Annotations.of(record).addWarningV2('@aws-cdk/aws-route53:recordSetProtectionCrossStack',
        `deploy this record before enabling protection in ${Stack.of(protection).node.path}, or place the records in the same stack so CDK can order them`);
      continue;
    }
    const group = members.get(protection);
    if (group) group.push(record);
    else members.set(protection, [record]);
  }
  for (const [protection, group] of members) {
    const first = group[0];
    const different = group.find(record => record.cfnOptions.condition !== first.cfnOptions.condition);
    if (different) {
      throw new ValidationError(lit`RecordSetProtectionConditionMismatch`,
        `use the same CloudFormation condition for ${first.node.path} and ${different.node.path} so their shared protection is created whenever the records exist`, different);
    }
    protection.cfnOptions.condition ??= first.cfnOptions.condition;
    for (const record of group) protection.addResourceDependency(record);
  }

  // Other stages synthesize separately. Publish ownership only after this assembly has been checked.
  for (const [key, protection] of owners) {
    if (Stage.of(protection) === assembly && !protections.has(key)) owners.delete(key);
  }
  for (const [key, protection] of protections) owners.set(key, protection);
}

function recordIdentity(scope: IConstruct, zone: string | undefined, name: string, type: string): any[] {
  const resolvedZone = zone === undefined ? undefined : resolveForGrouping(scope, zone);
  const resolvedName = resolveForGrouping(scope, name);
  return [
    typeof resolvedZone === 'string' ? resolvedZone.replace(/^\/hostedzone\//, '') : resolvedZone,
    typeof resolvedName === 'string' ? resolvedName.toLowerCase().replace(/\.?$/, '.') : resolvedName,
    resolveForGrouping(scope, type),
  ];
}

// Identify the source of a reference even if an aspect overrides its logical ID
// or CloudFormation later renders it as a cross-stack import.
class GroupingResolver extends DefaultTokenResolver {
  public override resolveToken(token: IResolvable, context: IResolveContext, postProcessor: IPostProcessor): any {
    if (Reference.isReference(token)) {
      const stack = Stack.of(context.scope);
      if (Stack.of(token.target) === stack) {
        const path = token.target.node.path.slice(stack.node.path.length);
        return { localReferencePath: path, attribute: token.displayName };
      }
      return { referencePath: token.target.node.path, attribute: token.displayName };
    }
    return super.resolveToken(token, context, postProcessor);
  }
}

const groupingResolver = new GroupingResolver({ join: CloudFormationLang.concat });

function resolveForGrouping(scope: IConstruct, value: string): any {
  // CloudFormation renders resource properties in the consuming stack's scope.
  return Tokenization.resolve(value, { scope: Stack.of(scope), resolver: groupingResolver });
}

function expressionKey(expression: any): string {
  return JSON.stringify(expression, (_, value) => {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      return Object.fromEntries(Object.keys(value).sort().map(key => [key, value[key]]));
    }
    return value;
  });
}
