import type { Construct } from 'constructs';
import { Token, UnscopedValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * Creates a field index policy for CloudWatch Logs log groups.
 */
export class FieldIndexPolicy {
  private readonly fieldIndexPolicyProps: FieldIndexPolicyProps;

  constructor(props: FieldIndexPolicyProps) {
    if (props.fields.length > 20) {
      throw new UnscopedValidationError(lit`MaximumFieldsIndexedGroup`, 'A maximum of 20 fields can be indexed per log group');
    }
    for (const field of props.fields) {
      // Skip tokenized values - their resolved length is unknown at synth time.
      if (Token.isUnresolved(field)) {
        continue;
      }
      if (field.length > 100) {
        throw new UnscopedValidationError(lit`FieldIndexNameTooLong`, `field index name ${JSON.stringify(field)} has ${field.length} characters, but field index names can include a maximum of 100 characters`);
      }
    }
    this.fieldIndexPolicyProps = props;
  }

  /**
   * @internal
   */
  public _bind(_scope: Construct) {
    return { Fields: this.fieldIndexPolicyProps.fields };
  }
}

/**
 * Properties for creating field index policies
 */
export interface FieldIndexPolicyProps {
  /**
   * List of fields to index in log events.
   *
   * A maximum of 20 fields can be indexed per log group, and each field index
   * name can include a maximum of 100 characters.
   *
   * @default no fields
   */
  readonly fields: string[];
}
