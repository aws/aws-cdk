import type { IConstruct } from 'constructs';
import { Construct } from 'constructs';
import type { IAspect, IPostProcessor, IResolvable, IResolveContext } from '../../../core';
import {
  AspectPriority, Aspects, DefaultTokenResolver,
  Mixin, Reference, Stack, Token, Tokenization, UnscopedValidationError, ValidationError,
} from '../../../core';
import { md5hash } from '../../../core/lib/helpers-internal';
import { CloudFormationLang } from '../../../core/lib/private/cloudformation-lang';
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
 * Apply the mixin to each record in a routing group, or to their common scope.
 * Set the hosted zone ID, name, and type before applying it. A record that
 * specifies only a hosted zone name cannot be protected with this mixin.
 *
 * Records with the same zone ID, name, and type in a stack share one protection.
 * An application can supply a missing comment. If several applications supply
 * comments for the same protection, the comments must agree.
 *
 * To change or remove a protected record, remove its protection in a separate deployment first.
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

    const groups = new ProtectionGroups(stack);
    aspects.add(groups, { priority: AspectPriority.MUTATING });
    return groups;
  }

  public readonly [PROTECTION_GROUPS] = true;
  private readonly pending: Array<(scope: Construct) => void> = [];
  private scope?: Construct;

  private constructor(private readonly stack: Stack) {}

  public visit(node: IConstruct): void {
    if (node !== this.stack || this.scope) return;
    // The app may already use this construct ID. Allocate our scope after the app is built.
    const prefix = 'Route53RecordSetProtections';
    let id = prefix;
    for (let suffix = 2; this.stack.node.tryFindChild(id); suffix++) id = prefix + suffix;
    this.scope = new Construct(this.stack, id);
    for (const bind of this.pending) bind(this.scope);
    this.pending.length = 0;
  }

  public register(record: CfnRecordSet, zone: string, name: string, type: string, comment?: string): void {
    const bind = (scope: Construct) => {
      const identity = recordIdentity(record, zone, name, type);
      const key = expressionKey(identity);
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
      protection.addResourceDependency(record);
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

// Before cross-stack references are prepared, two producers can render the same Ref.
class GroupingResolver extends DefaultTokenResolver {
  public override resolveToken(token: IResolvable, context: IResolveContext, postProcessor: IPostProcessor): any {
    if (Reference.isReference(token) && Stack.of(token.target) !== Stack.of(context.scope)) {
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
