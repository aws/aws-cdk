import type { IConstruct } from 'constructs';
import { Mixin, Stack, Token, TokenComparison, UnscopedValidationError, ValidationError } from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';
import type { IRecordSetRef } from '../../../interfaces/generated/aws-route53-interfaces.generated';
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

  /**
   * Other records that CloudFormation must create before enabling protection.
   *
   * Include records that share the target's hosted zone, name, and type, such as
   * the other weighted records for an endpoint. One protection covers them all,
   * regardless of their set identifiers.
   * @default - CloudFormation waits only for the target record
   */
  readonly additionalRecords?: IRecordSetRef[];
}

/**
 * Protects all records with the target's name and type in its hosted zone.
 *
 * Set the hosted zone, name, and type on each record, then apply the mixin once
 * per group. If you apply it to another record with the same zone, name, and
 * type in the same stack, the existing protection also depends on that record.
 *
 * To change a protected record, remove its protection in a separate deployment first.
 */
export class RecordSetProtection extends Mixin {
  private static readonly protections = new WeakMap<Stack, Map<string, CfnRecordSetProtection>>();

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

    const siblings = (this.props.additionalRecords ?? []).map(sibling => siblingDependency(construct, sibling));
    const stack = Stack.of(construct);
    let protections = RecordSetProtection.protections.get(stack);
    if (!protections) {
      protections = new Map();
      RecordSetProtection.protections.set(stack, protections);
    }

    // The records share a lookup key. The first record's construct path determines the protection's logical ID.
    const identity = recordIdentity(construct);
    let protection = protections.get(identity);
    if (!protection) {
      protection = new CfnRecordSetProtection(construct, 'Protection', {
        hostedZoneId: construct.hostedZoneId,
        recordName: construct.name,
        recordType: construct.type,
        comment: this.props.comment,
      });
      protections.set(identity, protection);
    } else if (this.props.comment !== undefined) {
      if (protection.comment !== undefined && this.props.comment !== protection.comment) {
        throw new ValidationError(lit`ConflictingRecordSetProtectionComment`, `use the same protection comment for all records sharing ${construct.name} and type ${construct.type}`, construct);
      }
      protection.comment = this.props.comment;
    }

    for (const record of [construct, ...siblings]) {
      if (CfnRecordSet.isCfnRecordSet(record)) {
        const initialIdentity = recordIdentity(record);
        record.node.addValidation({
          validate: () => recordIdentity(record) === initialIdentity ? [] : [
            'record identity changed after protection was applied, set the hosted zone, name and type before applying RecordSetProtection',
          ],
        });
        protection.addResourceDependency(record);
      } else {
        protection.node.addDependency(record);
      }
    }
  }
}

function recordIdentity(record: CfnRecordSet): string {
  return JSON.stringify([
    record.hostedZoneId === undefined ? undefined : zoneId(record.hostedZoneId),
    record.hostedZoneName === undefined ? undefined : dnsName(record.hostedZoneName),
    dnsName(record.name),
    record.type,
  ]);
}

function siblingDependency(target: CfnRecordSet, ref: IRecordSetRef): IConstruct {
  const resource = CfnRecordSet.isCfnRecordSet(ref) ? ref : ref.node.defaultChild;
  const record = CfnRecordSet.isCfnRecordSet(resource) ? resource : undefined;
  const name = record?.name ?? ref.recordSetRef.recordSetName;
  const type = record?.type ?? ref.recordSetRef.type;
  if (Token.compareStrings(dnsName(target.name), dnsName(name)) === TokenComparison.DIFFERENT
    || Token.compareStrings(target.type, type) === TokenComparison.DIFFERENT
    || (target.hostedZoneId !== undefined && record?.hostedZoneId !== undefined
      && Token.compareStrings(zoneId(target.hostedZoneId), zoneId(record.hostedZoneId)) === TokenComparison.DIFFERENT)) {
    throw new ValidationError(lit`RecordSetProtectionSiblingMismatch`, `additional record ${ref.node.path} must share the protected record's hosted zone, name and type`, target);
  }
  return record ?? ref;
}

function dnsName(name: string): string {
  return Token.isUnresolved(name) ? name : name.toLowerCase().replace(/\.$/, '');
}

function zoneId(id: string): string {
  return id.replace(/^\/hostedzone\//, '');
}
