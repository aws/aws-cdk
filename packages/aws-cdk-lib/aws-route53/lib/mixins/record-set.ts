import type { IConstruct } from 'constructs';
import { Construct } from 'constructs';
import type { IAspect, IPostProcessor, IResolvable, IResolveContext } from '../../../core';
import {
  AspectPriority, Aspects, DefaultTokenResolver,
  Mixin, Reference, Stack, Token, Tokenization, UnscopedValidationError, ValidationError,
} from '../../../core';
import { md5hash } from '../../../core/lib/helpers-internal';
import { currentAspectVisitation } from '../../../core/lib/private/aspect-visitation';
import { CloudFormationLang } from '../../../core/lib/private/cloudformation-lang';
import { iterateTemplateCfnResources } from '../../../core/lib/private/construct-iteration';
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
 * Apply the mixin to a record or a common scope before synthesis.
 * Set the hosted zone ID, name, and type before applying it. A record that
 * specifies only a hosted zone name cannot be protected with this mixin.
 *
 * Records with the same zone ID, name, and type in a stack share one protection.
 * CloudFormation creates all matching records in the stack before enabling protection.
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

/** Wait until synthesis to group records whose names or zone IDs are lazy. */
class ProtectionGroups implements IAspect {
  public static of(stack: Stack): ProtectionGroups {
    const aspects = Aspects.of(stack);
    const existing = aspects.all.find((aspect): aspect is ProtectionGroups => PROTECTION_GROUPS in aspect);
    if (existing) return existing;

    if (currentAspectVisitation(stack)) {
      throw new ValidationError(lit`RecordSetProtectionAppliedDuringAspect`, 'apply RecordSetProtection to at least one record in the stack before synthesis, outside of an Aspect', stack);
    }
    const groups = new ProtectionGroups(stack);
    aspects.add(groups, { priority: AspectPriority.MUTATING });
    return groups;
  }

  public readonly [PROTECTION_GROUPS] = true;
  private readonly pending: Array<(scope: Construct) => void> = [];
  private scope?: Construct;

  private constructor(private readonly stack: Stack) {}

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

    // A later aspect may add a record or change an untargeted sibling's name.
    currentAspectVisitation(this.stack)!.push(() => this.linkMatchingRecords());
  }

  private linkMatchingRecords(): void {
    const members = new Map<CfnRecordSetProtection, CfnRecordSet[]>();
    for (const child of this.stack.node.children) {
      for (const record of iterateTemplateCfnResources(child)) {
        if (!CfnRecordSet.isCfnRecordSet(record) || record.hostedZoneId === undefined) continue;
        const key = expressionKey(recordIdentity(record, record.hostedZoneId, record.name, record.type));
        const protection = this.scope!.node.tryFindChild(md5hash(key)) as CfnRecordSetProtection | undefined;
        if (!protection) continue;

        const group = members.get(protection);
        if (group) {
          group.push(record);
        } else {
          members.set(protection, [record]);
        }
      }
    }

    for (const [protection, records] of members) {
      const first = records[0];
      const different = records.find(record => record.cfnOptions.condition !== first.cfnOptions.condition);
      if (different) {
        throw new ValidationError(lit`RecordSetProtectionConditionMismatch`,
          `use the same CloudFormation condition for ${first.node.path} and ${different.node.path} so their shared protection is created whenever the records exist`, different);
      }
      protection.cfnOptions.condition ??= first.cfnOptions.condition;
      for (const record of records) protection.addResourceDependency(record);
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

function recordIdentity(scope: IConstruct, zone: string, name: string, type: string): any[] {
  const resolvedZone = resolveForGrouping(scope, zone);
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
